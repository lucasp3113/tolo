<?php
require __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
$config = require __DIR__ . '/../config.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

$secret_key = "LA_CACHIMBA_AMA";
$input = json_decode(file_get_contents("php://input"), true);
$token = $input['token'] ?? null;
$decoded = JWT::decode($token, new Key($secret_key, "HS256"));

// 4. Conectarse a la base de datos
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);
if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
    exit;
}

// 5. Buscar el usuario y obtener tipo_usuario
$query = $data_base->prepare("SELECT tipo_usuario, nombre_usuario FROM usuarios WHERE nombre_usuario = ?");
$query->bind_param("s", $decoded->user);

if ($query->execute()) {
    $result = $query->get_result()->fetch_assoc();
    http_response_code(200);
    if ($result["tipo_usuario"] === "admin") {
        echo json_encode([
            "success" => true,
            "data" => $result
        ]);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(["success" => false]);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false]);
    exit;
}
?>