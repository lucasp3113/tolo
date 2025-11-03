<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

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
$user_id = $input["idUsuario"] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta el idUsuario"]);
    exit;
}

// Si se solicita filtrar por ecommerce
if (!empty($input["ecommerce"])) {
    $ecommerce_nombre = $input["ecommerce"];
    
    // Verificar si el ecommerce existe por nombre
    $check_sql = "SELECT id_ecommerce, id_usuario, nombre_ecommerce FROM ecommerces WHERE nombre_ecommerce = ?";
    $check_stmt = $data_base->prepare($check_sql);
    $check_stmt->bind_param("s", $ecommerce_nombre);
    $check_stmt->execute();
    $ecommerce_result = $check_stmt->get_result();
    
    if ($ecommerce_result->num_rows === 0) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "favorites" => [],
            "count" => 0,
            "message" => "El ecommerce no existe"
        ]);
        $check_stmt->close();
        $data_base->close();
        exit;
    }
    
    $ecommerce_data = $ecommerce_result->fetch_assoc();
    $id_ecommerce = $ecommerce_data['id_ecommerce'];
    $check_stmt->close();
    
    // Obtener favoritos del usuario de productos que pertenecen a ese ecommerce
    $sql = "SELECT 
            p.id_producto,
            p.nombre_producto,
            p.descripcion,
            p.precio,
            p.stock,
            COALESCE(
                (SELECT CONCAT('uploads/products/', icp.ruta_imagen)
                 FROM imagenes_color_producto icp
                 JOIN colores_producto cp ON cp.id_color = icp.id_color
                 WHERE cp.id_producto = p.id_producto
                 ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC
                 LIMIT 1),
                (SELECT i.ruta_imagen
                 FROM imagenes_productos i
                 WHERE i.id_producto = p.id_producto
                 ORDER BY i.id_imagen ASC
                 LIMIT 1)
            ) AS ruta_imagen,
            p.envio_gratis,
            p.fecha_publicacion,
            p.estado
        FROM productos p
        INNER JOIN favoritos f ON f.id_producto = p.id_producto
        WHERE f.id_usuario = ? AND p.id_ecommerce = ?";
    
    $stmt = $data_base->prepare($sql);
    $stmt->bind_param("ii", $user_id, $id_ecommerce);
} else {
    // Sin filtro de ecommerce, obtenemos todos los favoritos del usuario
    $sql = "SELECT 
            p.id_producto,
            p.nombre_producto,
            p.descripcion,
            p.precio,
            p.stock,
            COALESCE(
                (SELECT CONCAT('uploads/products/', icp.ruta_imagen)
                 FROM imagenes_color_producto icp
                 JOIN colores_producto cp ON cp.id_color = icp.id_color
                 WHERE cp.id_producto = p.id_producto
                 ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC
                 LIMIT 1),
                (SELECT i.ruta_imagen
                 FROM imagenes_productos i
                 WHERE i.id_producto = p.id_producto
                 ORDER BY i.id_imagen ASC
                 LIMIT 1)
            ) AS ruta_imagen,
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