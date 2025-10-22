<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

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

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta el idUsuario"]);
    exit;
}

// AGREGADA ruta_imagen y cambiado a fetch_all
$sql = "SELECT 
            p.id_producto,
            p.nombre_producto,
            p.descripcion,
            p.precio,
            p.stock,
            i.ruta_imagen,
            p.envio_gratis,
            p.fecha_publicacion,
            p.estado
        FROM productos p
        JOIN favoritos f ON f.id_producto = p.id_producto
        JOIN imagenes_productos i ON i.id_producto = p.id_producto
        WHERE f.id_usuario = ?";

$stmt = $data_base->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// CAMBIADO de fetch_assoc() a fetch_all(MYSQLI_ASSOC)
$favorites = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

http_response_code(200);
echo json_encode([
    "success" => true,
    "favorites" => $favorites
]);

$stmt->close();
$data_base->close();
