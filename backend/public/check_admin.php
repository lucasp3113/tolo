<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");


$secret_key = "LA_CACHIMBA_AMA";

$headers = apache_request_headers();

if (!isset($headers['Authorization'])) {
    echo json_encode(["error" => "Token no enviado"]);
    http_response_code(401);
    exit;
}


list($jwt) = sscanf($headers['Authorization'], 'Bearer %s');

try {
    $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));

    if ($decoded->rol !== "admin") {
        echo json_encode(["error" => "No autorizado", "rol" => $decoded->rol]);
        http_response_code(403);
        exit;
    }

    echo json_encode([
        "success" => true,
        "rol" => $decoded->rol,
        "user" => $decoded->user
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => "Token inválido", "message" => $e->getMessage()]);
    http_response_code(401);
    exit;
}
?>
