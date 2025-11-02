<?php
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
        "message" => "Error al conectar con la base de datos"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$ecommerce = $body["ecommerce"] ?? null;

if (!$ecommerce) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Debe especificar el nombre del ecommerce"
    ]);
    exit;
}

$query_text = "SELECT 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto, 
    p.precio, 
    SUM(d.cantidad) AS cantidad_vendida,
    COUNT(DISTINCT c.id_cliente) AS compradores_distintos,
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
    COALESCE(
        (SELECT CONCAT('uploads/products/', icp.ruta_imagen)
         FROM imagenes_color_producto icp
         JOIN colores_producto cp ON cp.id_color = icp.id_color
         WHERE cp.id_producto = p.id_producto
         ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC
         LIMIT 1 OFFSET 1),
        (SELECT i.ruta_imagen
         FROM imagenes_productos i
         WHERE i.id_producto = p.id_producto
         ORDER BY i.id_imagen ASC
         LIMIT 1 OFFSET 1)
    ) AS imagen_2
FROM productos p
JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
JOIN detalles_compra d ON d.id_producto = p.id_producto
JOIN compras c ON c.id_compra = d.id_compra
WHERE e.nombre_ecommerce = ?
GROUP BY 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto,
    p.precio
ORDER BY cantidad_vendida DESC
LIMIT 30
";


$query = $data_base->prepare($query_text);
$query->bind_param("s", $ecommerce);

if ($query->execute()) {
    $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $result
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al ejecutar la consulta"
    ]);
}
