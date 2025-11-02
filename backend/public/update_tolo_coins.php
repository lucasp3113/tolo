<?php
header('Content-Type: application/json'); 
$config = require __DIR__ . '/../config.php';

$conn = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id_usuario = $data['id_usuario'] ?? 0;
$tolo_ganados = floatval($data['tolo_coins_ganados'] ?? 0);

$stmt = $conn->prepare("UPDATE usuarios SET tolo_coins = ? WHERE id_usuario = ?");
$stmt->bind_param("di", $tolo_ganados, $id_usuario);
$stmt->execute();

echo json_encode([
    "success" => true,
    "nuevos_tolo_coins" => round($nuevos, 2)
]);