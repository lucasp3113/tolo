<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    $body = json_decode(file_get_contents(("php://input")), true);
    $query = $data_base->prepare("DELETE FROM compras WHERE id_compra = ?");
    $query->bind_param("i", $body["id_compra"]);
    if ($query->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

?>