<?php
/**
 * Controle de presença
 * GET  ?turma_id=1&data=2026-09-04         -> lista presença do dia
 * POST { turma_id, data, presencas:[{aluno_id, presente}] } -> salva
 */
declare(strict_types=1);
require __DIR__ . '/config.php';
require __DIR__ . '/auth.php';
definirCabecalhosApi();
exigirLogin(); // professor ou admin

$pdo = conectarBanco();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $turmaId = (int)($_GET['turma_id'] ?? 0);
    $data = $_GET['data'] ?? date('Y-m-d');

    $sql = 'SELECT a.id AS aluno_id, a.nome, p.presente
            FROM alunos a
            LEFT JOIN presencas p ON p.aluno_id = a.id AND p.turma_id = :turma_id AND p.data_aula = :data
            WHERE a.turma_id = :turma_id AND a.ativo = 1
            ORDER BY a.nome';
    $consulta = $pdo->prepare($sql);
    $consulta->execute(['turma_id' => $turmaId, 'data' => $data]);
    responderJson(['alunos' => $consulta->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    $turmaId = (int)($dados['turma_id'] ?? 0);
    $data = $dados['data'] ?? date('Y-m-d');
    $lista = $dados['presencas'] ?? [];

    $sql = 'INSERT INTO presencas (aluno_id, turma_id, data_aula, presente, registrado_por)
            VALUES (:aluno_id, :turma_id, :data, :presente, :registrado_por)
            ON DUPLICATE KEY UPDATE presente = VALUES(presente)';
    $comando = $pdo->prepare($sql);

    foreach ($lista as $item) {
        $comando->execute([
            'aluno_id' => $item['aluno_id'],
            'turma_id' => $turmaId,
            'data' => $data,
            'presente' => $item['presente'] ? 1 : 0,
            'registrado_por' => $_SESSION['usuario_id'],
        ]);
    }
    responderJson(['sucesso' => true]);
}
