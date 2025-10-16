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
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$data = $body["data"];
$query = $data_base->prepare("SELECT id_ecommerce, nombre_ecommerce FROM ecommerces WHERE id_usuario = ?");
$query->bind_param('i', $body["id_usuario"]);
if ($query->execute()) {
    $result = $query->get_result()->fetch_assoc();
    $id_ecommerce = $result["id_ecommerce"];
    $name_ecommerce = $result["nombre_ecommerce"];
    $query = $data_base->prepare(
        "INSERT INTO custom_shops(id_ecommerce, header_color, main_color, footer_color) 
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    header_color = VALUES(header_color),
    main_color = VALUES(main_color),
    footer_color = VALUES(footer_color)"
    );
    $query->bind_param("isss", $id_ecommerce, $data["header"], $data["main"], $data["footer"]);
    if ($query->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "ecommerce"=> $name_ecommerce
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false
    ]);
}
