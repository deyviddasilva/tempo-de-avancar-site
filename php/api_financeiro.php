<?php
/**
 * Caixa financeiro — acesso EXCLUSIVO de administradores.
 * A checagem de papel acontece aqui, no servidor — nunca confie
 * apenas no front-end para esconder esta informação.
 */
declare(strict_types=1);
require __DIR__ . '/config.php';
require __DIR__ . '/auth.php';
definirCabecalhosApi();
exigirLogin('admin'); // <- só passa quem tem papel = admin

$pdo = conectarBanco();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $consulta = $pdo->query('SELECT * FROM financeiro ORDER BY data_movimento DESC LIMIT 100');
    responderJson(['movimentacoes' => $consulta->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    $comando = $pdo->prepare(
        'INSERT INTO financeiro (descricao, categoria, tipo, valor, data_movimento, registrado_por)
         VALUES (:descricao, :categoria, :tipo, :valor, :data_movimento, :registrado_por)'
    );
    $comando->execute([
        'descricao' => $dados['descricao'],
        'categoria' => $dados['categoria'],
        'tipo' => $dados['tipo'],
        'valor' => $dados['valor'],
        'data_movimento' => $dados['data_movimento'] ?? date('Y-m-d'),
        'registrado_por' => $_SESSION['usuario_id'],
    ]);
    responderJson(['sucesso' => true], 201);
}
