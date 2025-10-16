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
    $query = $data_base->prepare("INSERT INTO compras(id_cliente) VALUES(?)");
    $query->bind_param("i", $body["id_client"]);
    if ($query->execute()) {
        $id_compra = $data_base->insert_id;
        $query = $data_base->prepare("INSERT INTO detalles_compras(id_compra, id_producto, cantidad, precio_unitario) VALUES(?, ?, ?, ?)");
        $query->bind_param("iiii", $id_compra, $body["id_product"], $body["amount"], $body["price"]);
        if ($query->execute()) {
            echo json_encode([
                "success" => true,
                "data" => "GOOOOD"
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Error al crear los detalles de la compra"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error",
            "data"=> $body
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