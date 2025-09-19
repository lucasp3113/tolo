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
    $data = json_decode(file_get_contents("php://input"), true);
    $id_producto = $data["idProducto"];
    $query = $data_base->prepare("SELECT nombre_producto, precio, stock FROM productos WHERE id_producto = ?");
    $query->bind_param("i", $id_producto);

    if ($query->execute()) {
        $result = $query->get_result()->fetch_assoc();

        $query2 = $data_base->prepare("SELECT ruta_imagen FROM imagenes_productos WHERE i_producto = ?");
        $query2->bind_param("i", $id_producto);
        http_response_code(200);
        if ($query2->execute()) {
            $result2 = $query2->get_result()->fetch_all(MYSQLI_ASSOC);
            echo json_encode([
                "success" => true,
                "data" => [$result, $result2]
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Te afecté"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Te afecté"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos"
    ]);
    exit;
}