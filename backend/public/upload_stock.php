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


if (!$body || !is_array($body) || count($body) === 0) {
    echo json_encode(["success" => false, "message" => "No se recibieron productos"]);
    exit;
}


$data_base->begin_transaction();

try {

    foreach ($body as $item) {

        $cantidad = intval($item["cantidad"]);
        $id_producto = intval($item["id_producto"]);
        $id_color = isset($item["id_color"]) ? intval($item["id_color"]) : null;
        $id_talle_color = isset($item["id_talle_color_producto"]) ? intval($item["id_talle_color_producto"]) : null;

        if ($id_talle_color) {

            $query = $data_base->prepare("
                UPDATE talles_color_producto
                SET stock = stock - ?
                WHERE id_talle_color_producto = ? AND stock >= ?
            ");
            $query->bind_param("iii", $cantidad, $id_talle_color, $cantidad);
            $query->execute();

            if ($query->affected_rows === 0) {
                throw new Exception("Stock insuficiente en talle/color.");
            }

        }
        else if ($id_color) {

            $query = $data_base->prepare("
                UPDATE colores_producto
                SET stock = stock - ?
                WHERE id_color = ? AND (stock IS NULL OR stock >= ?)
            ");
            $query->bind_param("iii", $cantidad, $id_color, $cantidad);
            $query->execute();

            if ($query->affected_rows === 0) {
                throw new Exception("Stock insuficiente en color.");
            }

        }
        else {

            $query = $data_base->prepare("
                UPDATE productos
                SET stock = stock - ?
                WHERE id_producto = ? AND stock >= ?
            ");
            $query->bind_param("iii", $cantidad, $id_producto, $cantidad);
            $query->execute();

            if ($query->affected_rows === 0) {
                throw new Exception("Stock insuficiente en producto.");
            }
        }
    }

    $data_base->commit();

    echo json_encode(["success" => true]);
    exit;

} catch (Exception $e) {

    $data_base->rollback();

    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    exit;
}
