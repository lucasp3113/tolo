<?php
header('Content-Type: application/json'); 
$config = require __DIR__ . '/../config.php';

// Crear conexión
$conn = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id_usuario = $data['id_usuario'] ?? 0;
$tolo_usados = $data['tolo_coins_usados'] ?? 0;
$tolo_ganados = $data['tolo_coins_ganados'] ?? 0;

$stmt = $conn->prepare("SELECT tolo_coins FROM usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$actuales = $row['tolo_coins'] ?? 0;


$nuevos = max(0, $actuales - $tolo_usados + $tolo_ganados);


$stmt = $conn->prepare("UPDATE usuarios SET tolo_coins = ? WHERE id_usuario = ?");
$stmt->bind_param("ii", $nuevos, $id_usuario); // ambos enteros
$stmt->execute();


echo json_encode([
    "success" => true,
    "nuevos_tolo_coins" => $nuevos
]);
