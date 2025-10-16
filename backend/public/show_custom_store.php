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
    if (isset($body["ecommerce"])) {
        $query_text =
            "SELECT c.header_color, c.main_color, c.footer_color    
                FROM custom_shops c
                JOIN ecommerces e ON e.nombre_ecommerce = ?
                WHERE c.id_ecommerce = e.id_ecommerce";
        $query = $data_base->prepare($query_text);
        $query->bind_param("s", $body["ecommerce"]);
    } else {
        $query_text =
            "SELECT c.header_color, c.main_color, c.footer_color    
            FROM custom_shops c
            JOIN ecommerces e ON e.id_usuario = ?
            WHERE c.id_ecommerce = e.id_ecommerce";
        $query = $data_base->prepare($query_text);
        $query->bind_param("i", $body["userId"]);
    }
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $result[0]
        ]);
    }
}