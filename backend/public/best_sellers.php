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
        "success" => false
    ]);
} else {
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare("SELECT 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto, 
    p.precio, 
    SUM(d.cantidad) AS cantidad_vendida,
    COUNT(DISTINCT c.id_cliente) AS compradores_distintos,
    (
    SELECT i.ruta_imagen FROM imagenes_productos i
    WHERE i.id_producto = p.id_producto
    LIMIT 1
    ) AS ruta_imagen
FROM productos p
JOIN ecommerces e 
    ON e.id_ecommerce = p.id_ecommerce
JOIN detalles_compra d 
    ON d.id_producto = p.id_producto
JOIN compras c 
    ON c.id_compra = d.id_compra
WHERE e.nombre_ecommerce = ?
GROUP BY 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto,
    p.precio
ORDER BY cantidad_vendida DESC
LIMIT 30");
    $query->bind_param("s", $body["ecommerce"]);
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $result
        ]);
    }
}