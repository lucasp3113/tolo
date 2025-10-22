<?php

$config = require __DIR__ . '/../config.php';

$conn = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

// Leer el id_usuario (ej: notifications.php?id_usuario=1)
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;


// Traer notificaciones del usuario
$sql = "SELECT id_notificacion, mensaje, tipo
        FROM notificaciones 
        WHERE id_usuario = ? 
        ORDER BY fecha_envio DESC";

$query = $conn->prepare($sql);

$query->bind_param("i", $id_usuario);
if($query->execute()) {
    $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
    http_response_code(200);
    echo json_encode([
        "success"=> true,
        "notificaciones"=> $result,
        "id"=> $id_usuario
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        "success"=> false
    ]);
}

