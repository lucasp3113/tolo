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

if (!isset($_GET['productId']) || empty($_GET['productId'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "productId es requerido",
        "stats" => ["total_comentarios" => 0, "promedio_rating" => 0],
        "comments" => []
    ]);
    exit;
}

$query = $data_base->prepare("INSERT INTO respuestas_comentario(id_respuesta, id_usuario, respuesta) VALUES(?, ?, ?)");
$query->bind_param("iis", $body["commentId"], $body["userId"], $body["respuesta"]);

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
