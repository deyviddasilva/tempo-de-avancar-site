<?php
/**
 * Configuração central — Tempo de Avançar
 * Preencha com as credenciais reais do seu servidor MySQL.
 */
declare(strict_types=1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'tempo_de_avancar');
define('DB_USER', 'root');
define('DB_PASS', '');

function conectarBanco(): PDO {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $opcoes = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    return new PDO($dsn, DB_USER, DB_PASS, $opcoes);
}

// Cabeçalhos padrão para todos os endpoints de API
function definirCabecalhosApi(): void {
    header('Content-Type: application/json; charset=utf-8');
    // Ajuste para o domínio real do site em produção
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

function responderJson(array $dados, int $codigoHttp = 200): void {
    http_response_code($codigoHttp);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}
