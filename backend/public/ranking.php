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

if($data_base->connect_error){
    http_response_code(500);
    echo json_encode([
        "success" => false
    ]);
} else {
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare(
"SELECT e.nombre_ecommerce, e.logo, SUM(c.total) AS total
        FROM ecommerces e
        JOIN compras c ON c.id_ecommerce = e.id_ecommerce
        GROUP BY e.nombre_ecommerce, e.logo
        ORDER BY total DESC
        LIMIT 3
");
    if($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success"=> true,
            "data"=> $result
        ]);
    }
}