<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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
$id_usuario = $body['id_usuario'];
$nombre_ecommerce = $body['nombre_ecommerce'] ?? null;

if ($nombre_ecommerce) {
    $query = $data_base->prepare("
        SELECT 
            p.id_pago,
            p.id_compra,
            p.mercadopago_payment_id,
            p.payment_method_id,
            p.estado_pago,
            p.monto,
            p.fecha_creacion,
            p.external_resource_url,
            p.payment_reference,
            c.id_cliente
        FROM pagos p
        INNER JOIN compras c ON p.id_compra = c.id_compra
        INNER JOIN detalles_compra dc ON c.id_compra = dc.id_compra
        INNER JOIN productos pr ON dc.id_producto = pr.id_producto
        INNER JOIN ecommerces e ON pr.id_ecommerce = e.id_ecommerce
        WHERE c.id_cliente = ? AND e.nombre_ecommerce = ?
        GROUP BY p.id_pago
        ORDER BY p.fecha_creacion DESC
    ");
    
    $query->bind_param("is", $id_usuario, $nombre_ecommerce);
} else {
    $query = $data_base->prepare("
        SELECT 
            p.id_pago,
            p.id_compra,
            p.mercadopago_payment_id,
            p.payment_method_id,
            p.estado_pago,
            p.monto,
            p.fecha_creacion,
            p.external_resource_url,
            p.payment_reference,
            c.id_cliente
        FROM pagos p
        INNER JOIN compras c ON p.id_compra = c.id_compra
        WHERE c.id_cliente = ?
        ORDER BY p.fecha_creacion DESC
    ");
    
    $query->bind_param("i", $id_usuario);
}

if ($query->execute()) {
    $result = $query->get_result();
    $pagos = [];
    
    while ($row = $result->fetch_assoc()) {
        $pagos[] = $row;
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $pagos
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener pagos: " . $data_base->error
    ]);
}

$query->close();
$data_base->close();