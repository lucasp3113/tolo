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
    if (isset($body["user"])) {
        $query = $data_base->prepare("SELECT map FROM ecommerces WHERE id_usuario = ?");
        $query->bind_param("i", $body["user"]);
    } else {
        $query = $data_base->prepare(
    "SELECT map FROM ecommerces 
            WHERE nombre_ecommerce = ?"
        );
        $query->bind_param("s", $body["selectedSeller"]);
    }
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC)[0]["map"];
        http_response_code(200);
        echo json_encode($result);
    }
}