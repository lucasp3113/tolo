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

    $query = $data_base->prepare("
        SELECT 
            e.logo,
            e.home AS imagen_inicio,
            e.map AS ubicacion,
            e.favicon,
            c.id_custom_shop IS NOT NULL AS tiene_custom_shop
        FROM usuarios u
        LEFT JOIN ecommerces e ON e.id_usuario = u.id_usuario
        LEFT JOIN custom_shops c ON c.id_ecommerce = e.id_ecommerce
        WHERE u.id_usuario = ?
        LIMIT 1
    ");

    $query->bind_param("i", $body["userId"]);

    if($query->execute()) {
        $result = $query->get_result()->fetch_assoc();
        http_response_code(200);
        echo json_encode([
            "success"=> true,
            "data"=> $result
        ]);
    }
}
