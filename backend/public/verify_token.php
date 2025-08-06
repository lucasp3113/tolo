<?php
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
// No hace falta el Access-Control-Allow-Headers porque no usás Authorization header

$secret_key = "LA_CACHIMBA_AMA";

// Ahora obtenemos el token desde GET
$token = $_GET['token'] ?? '';

if (!$token) {
    http_response_code(401);
    echo json_encode(["valid" => false, "message" => "Token no enviado"]);
    exit;
}

try {
    $decoded = JWT::decode($token, new Key($secret_key, "HS256"));
    echo json_encode(["valid" => true, "user" => $decoded->user]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["valid" => false, "message" => "Token inválido o expirado"]);
}
