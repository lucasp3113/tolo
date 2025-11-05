<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$userEmail = $body["email"] ?? null;
$code = $body["code"] ?? null;

if (!$userEmail || !$code) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta email o código"]);
    exit;
}

$key = "verification_code_$userEmail";

if (!isset($_SESSION[$key])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No hay código activo para este email"]);
    exit;
}

$data = $_SESSION[$key];

if (time() > $data["expires"]) {
    unset($_SESSION[$key]);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El código expiró"]);
    exit;
}

if ($code !== $data["code"]) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Código incorrecto"]);
    exit;
}

// Generar token único para el usuario ya verificado
$token = bin2hex(random_bytes(16));
$_SESSION["verified_$token"] = $userEmail;

unset($_SESSION[$key]);

echo json_encode(["success" => true, "token" => $token]);
