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
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare(
        "SELECT e.logo
         FROM ecommerces e
         JOIN usuarios u ON u.id_usuario = e.id_usuario
         WHERE u.nombre_usuario = ?");
    $query->bind_param("s", $body["user"]);
    if($query->execute()) {
        $logo = $query->get_result()->fetch_assoc();
        http_response_code(200);
        echo json_encode([
            "success"=> true,
            "logo"=> $logo
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "success"=> false
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos"
    ]);
}
?>