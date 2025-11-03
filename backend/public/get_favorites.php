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
$user_id = $input["userId"] ?? $input["idUsuario"] ?? null; // ✅ Acepta ambos
$product_id = $input["id_producto"] ?? $input["idProducto"] ?? null; // ✅ Acepta ambos

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta el userId"]);
    exit;
}

// Si hay product_id, buscar solo ese favorito (para verificar si existe)
if ($product_id) {
    $sql = "SELECT 
                p.id_producto,
                p.nombre_producto,
                p.descripcion,
                p.precio,
                p.stock,
                (SELECT ip.ruta_imagen 
                 FROM imagenes_productos ip 
                 WHERE ip.id_producto = p.id_producto 
                 LIMIT 1) as ruta_imagen,
                p.envio_gratis,
                p.fecha_publicacion,
                p.estado
            FROM productos p
            INNER JOIN favoritos f ON f.id_producto = p.id_producto
            WHERE f.id_usuario = ? AND p.id_producto = ?";
    
    $stmt = $data_base->prepare($sql);
    $stmt->bind_param("ii", $user_id, $product_id);
} else {
    // Si no hay product_id, traer todos los favoritos del usuario
    $sql = "SELECT 
                p.id_producto,
                p.nombre_producto,
                p.descripcion,
                p.precio,
                p.stock,
                (SELECT ip.ruta_imagen 
                 FROM imagenes_productos ip 
                 WHERE ip.id_producto = p.id_producto 
                 LIMIT 1) as ruta_imagen,
                p.envio_gratis,
                p.fecha_publicacion,
                p.estado
            FROM productos p
            INNER JOIN favoritos f ON f.id_producto = p.id_producto
            WHERE f.id_usuario = ?";
    
    $stmt = $data_base->prepare($sql);
    $stmt->bind_param("i", $user_id);
}

$stmt->execute();
$result = $stmt->get_result();

$favorites = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

http_response_code(200);
echo json_encode([
    "success" => true,
    "favorites" => $favorites,
    "count" => count($favorites)
]);

$stmt->close();
$data_base->close();