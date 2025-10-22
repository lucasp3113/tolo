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
        "error" => "Error de conexión: " . $data_base->connect_error
    ]);
    exit;
}

$query = $data_base->prepare("
    SELECT 
        c.id_compra, 
        u.nombre_usuario AS cliente, 
        c.fecha_compra, 
        c.total, 
        c.comision_plataforma,
        c.estado
    FROM compras c
    JOIN usuarios u ON u.id_usuario = c.id_cliente
    ORDER BY c.fecha_compra DESC
    LIMIT 30
");

if (!$query) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error en prepare(): " . $data_base->error
    ]);
    exit;
}

if (!$query->execute()) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al ejecutar query: " . $query->error
    ]);
    exit;
}

$result = $query->get_result();
$rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

http_response_code(200);
echo json_encode([
    "success" => true,
    "data" => $rows
]);

$data_base->close();
