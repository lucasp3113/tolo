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
if (!$data_base) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar la base de datos"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$username = $body["username"] ?? null;
if (!$username) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Falta el nombre de usuario"
    ]);
    exit;
}

$query = $data_base->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
$query->bind_param("s", $username);
if (!$query->execute()) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener usuario"
    ]);
    exit;
}

$id = $query->get_result()->fetch_assoc()["id_usuario"] ?? null;
if (!$id) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Usuario no encontrado"
    ]);
    exit;
}

$query = $data_base->prepare("SELECT id_producto, nombre_producto, precio, stock FROM productos WHERE id_vendedor = ?");
$query->bind_param("i", $id);
if (!$query->execute()) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener productos"
    ]);
    exit;
}

$products = $query->get_result()->fetch_all(MYSQLI_ASSOC);
if (count($products) === 0) {
    echo json_encode([]);
    exit;
}

$IDs_products = array_column($products, "id_producto");
$number_of_question_marks = implode(",", array_fill(0, count($IDs_products), "?"));
$types = str_repeat("i", count($IDs_products));

$sql = "SELECT id_producto, ruta_imagen FROM imagenes_productos WHERE id_producto IN ($number_of_question_marks)";
$query = $data_base->prepare($sql);

$params = [];
$params[] = &$types;
foreach ($IDs_products as $key => &$val) {
    $params[] = &$val;
}
call_user_func_array([$query, 'bind_param'], $params);

if (!$query->execute()) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener imágenes"
    ]);
    exit;
}

$routes = $query->get_result()->fetch_all(MYSQLI_ASSOC);

$map_images = [];
foreach ($routes as $ruta) {
    $id_prod = $ruta['id_producto'];
    if (!isset($map_images[$id_prod])) {
        $map_images[$id_prod] = $ruta['ruta_imagen'];
    }
}

$data = [];
foreach ($products as $producto) {
    $producto['ruta_imagen'] = $map_images[$producto['id_producto']] ?? null;
    $data[] = $producto;
}

echo json_encode($data);
