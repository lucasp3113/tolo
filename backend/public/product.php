<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data_base = new mysqli("localhost", "root", "", "tolo");

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al cachimbear la base de datos" . $data_base->connect_error
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id_producto = $data["idProducto"] ?? null;

if (!$id_producto) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Falta idProducto"
    ]);
    exit;
}

$query = $data_base->prepare("
    SELECT 
        nombre_producto, 
        descripcion, 
        precio, 
        stock, 
        totalRating, 
        ventas
    FROM productos 
    WHERE id_producto = ?
");

$query->bind_param("i", $id_producto);

if ($query->execute()) {
    $result = $query->get_result()->fetch_assoc();
    if (!$result) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Producto no encontrado"
    ]);
    exit;
}

    // Verificar si viene la descripcion
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $result,
        "message" => "Producto encontrado correctamente"
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "TE CACHIMBEÉ"
    ]);
    exit;
}
