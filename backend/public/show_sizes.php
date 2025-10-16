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
    $query = $data_base->prepare("SELECT id_talle, id_producto, talle FROM talles_producto WHERE id_producto = ?");
    $query->bind_param("i", $body["productId"]);
    if($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success"=> true,
            "data"=> $result
        ]);
    }
}