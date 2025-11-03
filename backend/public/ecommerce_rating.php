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
        "success" => false
    ]);
} else {
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare(
    "SELECT
    COUNT(*) as total_comentarios,
    AVG(rating) as promedio_rating
    FROM comentarios_productos
    JOIN productos p ON p.id_producto = comentarios_productos.id_producto
    JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
    WHERE e.id_usuario = ?
    AND activo = 1"
    );
    $query->bind_param("i", $body["userId"]);
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $result
        ]);
    }
}
