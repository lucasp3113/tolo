<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

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
$idColor = $body["idColor"] ?? null;

if (!$idColor) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "No se recibió idColor"
    ]);
    exit;
}

$query = $data_base->prepare("SELECT ruta_imagen FROM imagenes_color_producto WHERE id_color = ?");
$query->bind_param("i", $idColor);
$query->execute();
$result = $query->get_result();
$images = $result->fetch_all(MYSQLI_ASSOC);

$uploadDir = __DIR__ . '/../public/uploads/products/';
foreach ($images as $img) {
    $filePath = $uploadDir . $img['ruta_imagen'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }
}

$query = $data_base->prepare("DELETE FROM colores_producto WHERE id_color = ?");
$query->bind_param("i", $idColor);

if ($query->execute()) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Color e imágenes eliminados correctamente"
    ]);
    exit;
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar el color"
    ]);
    exit;
}
