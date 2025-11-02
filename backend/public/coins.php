<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $data_base->connect_error]);
    exit;
}
$userId = json_decode(file_get_contents("php://input"), true)["id"];
    $stmt = $data_base->prepare("SELECT tolo_coins FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        http_response_code(200);
        echo json_encode(["tolo_coins" => (float)$row['tolo_coins']]);
    } else {
        http_response_code(200);
        echo json_encode(["tolo_coins" => 0]);
    }

    $stmt->close();
$data_base->close();
