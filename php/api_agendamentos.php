<?php
/**
 * Recebe o formulário "Agendar visita ao CT" do site público.
 * POST { nome, telefone, email, interesse, data, mensagem }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';
definirCabecalhosApi();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderJson(['erro' => 'Método não permitido.'], 405);
}

$dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$nome = trim($dados['nome'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$email = trim($dados['email'] ?? '');

if ($nome === '' || $telefone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responderJson(['erro' => 'Preencha nome, telefone e um e-mail válido.'], 400);
}

try {
    $pdo = conectarBanco();
    $comando = $pdo->prepare(
        'INSERT INTO agendamentos_visita (nome, telefone, email, interesse, data_preferida, mensagem)
         VALUES (:nome, :telefone, :email, :interesse, :data_preferida, :mensagem)'
    );
    $comando->execute([
        'nome' => $nome,
        'telefone' => $telefone,
        'email' => $email,
        'interesse' => $dados['interesse'] ?? null,
        'data_preferida' => $dados['data'] ?: null,
        'mensagem' => $dados['mensagem'] ?? null,
    ]);
    // Opcional: enviar e-mail de notificação para a equipe aqui (mail() ou PHPMailer)
    responderJson(['sucesso' => true, 'mensagem' => 'Solicitação recebida com sucesso.'], 201);
} catch (PDOException $e) {
    responderJson(['erro' => 'Não foi possível registrar sua solicitação.'], 500);
}
