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
if ($data_base) {
    $body = json_decode(file_get_contents(("php://input")), true);
    $query = $data_base->prepare(
"UPDATE ecommerces e
        JOIN usuarios u ON u.id_usuario = e.id_usuario
        SET e.map = ?
        WHERE u.id_usuario = ?
        "
    );
    $query->bind_param("si", $body["map"], $body["user"]);
    if($query->execute()) {
        http_response_code(200);
    } else {
        http_response_code(400);
    }
} else {
    http_response_code(500);
}