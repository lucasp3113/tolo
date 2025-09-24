<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);

if (!isset($body["productId"]) || !isset($body["userId"]) || !isset($body["rating"]) || !isset($body["comentario"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos requeridos"
    ]);
    exit;
}

$query = $data_base->prepare("INSERT INTO comentarios_productos(id_producto, id_usuario, rating, comentario) VALUES(?, ?, ?, ?)");
$query->bind_param("iids", $body["productId"], $body["userId"], $body["rating"], $body["comentario"]);

if ($query->execute()) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Comentario agregado correctamente"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al agregar comentario"
    ]);
}

$query->close();
$data_base->close();
