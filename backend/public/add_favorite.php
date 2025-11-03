<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

mysqli_report(MYSQLI_REPORT_OFF);

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al conectar con la base de datos"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$user_id = $input["idUsuario"];
$product_id = $input["idProducto"];

$sql = "INSERT INTO favoritos (id_usuario, id_producto) VALUES (?, ?)";
$stmt = $data_base->prepare($sql);
$stmt->bind_param("ii", $user_id, $product_id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Producto agregado a favoritos"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al insertar"]);
}

$stmt->close();
$data_base->close();