<?php
/**
 * Autenticação do painel administrativo.
 * POST { "usuario": "...", "senha": "..." }
 * Retorna um token de sessão simples (troque por JWT em produção, se preferir).
 */
declare(strict_types=1);
require __DIR__ . '/config.php';
definirCabecalhosApi();
session_start();

$dados = json_decode(file_get_contents('php://input'), true);
$usuario = trim($dados['usuario'] ?? '');
$senha   = $dados['senha'] ?? '';

if ($usuario === '' || $senha === '') {
    responderJson(['erro' => 'Informe usuário e senha.'], 400);
}

try {
    $pdo = conectarBanco();
    $consulta = $pdo->prepare('SELECT id, nome, senha_hash, papel FROM usuarios WHERE usuario = :usuario AND ativo = 1');
    $consulta->execute(['usuario' => $usuario]);
    $conta = $consulta->fetch();

    if (!$conta || !password_verify($senha, $conta['senha_hash'])) {
        responderJson(['erro' => 'Usuário ou senha inválidos.'], 401);
    }

    // Sessão do lado do servidor — a área financeira sempre confere o papel aqui,
    // nunca apenas no front-end.
    $_SESSION['usuario_id'] = $conta['id'];
    $_SESSION['papel'] = $conta['papel'];

    responderJson([
        'sucesso' => true,
        'nome'    => $conta['nome'],
        'papel'   => $conta['papel'],
    ]);
} catch (PDOException $e) {
    responderJson(['erro' => 'Falha ao conectar ao banco de dados.'], 500);
}

/**
 * Função auxiliar a incluir no topo de qualquer endpoint protegido:
 *
 *   exigirLogin();            // qualquer usuário autenticado
 *   exigirLogin('admin');     // apenas administradores (ex: financeiro)
 */
function exigirLogin(?string $papelExigido = null): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['usuario_id'])) {
        responderJson(['erro' => 'Não autenticado.'], 401);
    }
    if ($papelExigido !== null && ($_SESSION['papel'] ?? '') !== $papelExigido) {
        responderJson(['erro' => 'Acesso restrito a administradores.'], 403);
    }
}
