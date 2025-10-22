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

$data_base->begin_transaction();

try {
    $query = $data_base->prepare("SELECT id_ecommerce FROM productos WHERE id_producto = ?");
    $query->bind_param("i", $body["id_product"]);
    $query->execute();
    $result = $query->get_result();
    $producto = $result->fetch_assoc();
    
    if (!$producto) {
        throw new Exception("Producto no encontrado");
    }
    
    $id_ecommerce = $producto['id_ecommerce'];
    
    $query = $data_base->prepare("SELECT id_carrito FROM carrito WHERE id_usuario = ? AND id_ecommerce = ?");
    $query->bind_param("ii", $body["id_client"], $id_ecommerce);
    $query->execute();
    $result = $query->get_result();
    $carrito = $result->fetch_assoc();
    
    if ($carrito) {
        $id_carrito = $carrito['id_carrito'];
    } else {
        $query = $data_base->prepare("INSERT INTO carrito(id_usuario, id_ecommerce) VALUES(?, ?)");
        $query->bind_param("ii", $body["id_client"], $id_ecommerce);
        $query->execute();
        $id_carrito = $data_base->insert_id;
    }
    
    $query = $data_base->prepare("SELECT id_item, cantidad FROM items_carrito WHERE id_carrito = ? AND id_producto = ?");
    $query->bind_param("ii", $id_carrito, $body["id_product"]);
    $query->execute();
    $result = $query->get_result();
    $item_existente = $result->fetch_assoc();
    
    if ($item_existente) {
        $nueva_cantidad = $item_existente['cantidad'] + $body["amount"];
        $query = $data_base->prepare("UPDATE items_carrito SET cantidad = ? WHERE id_item = ?");
        $query->bind_param("ii", $nueva_cantidad, $item_existente['id_item']);
        $query->execute();
    } else {
        $query = $data_base->prepare("INSERT INTO items_carrito(id_carrito, id_producto, cantidad, precio_unitario) VALUES(?, ?, ?, ?)");
        $query->bind_param("iiid", $id_carrito, $body["id_product"], $body["amount"], $body["price"]);
        $query->execute();
    }
    
    $data_base->commit();
    
    echo json_encode([
        "success" => true,
        "message" => "Producto agregado al carrito"
    ]);
    
} catch (Exception $e) {
    $data_base->rollback();
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$data_base->close();
