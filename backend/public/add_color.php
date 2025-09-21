<?php 
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

$body = json_decode($_POST['json'], true);

$idProducto = $body['idProducto'] ?? null;
$nameColor = $body['nameColor'] ?? null;
$nameSizes = $body['nameSizes'] ?? [];
$nameStocks = $body['nameStocks'] ?? [];
$nameStockColor = $body['nameStockColor'] ?? false;

$query_text = $nameStockColor ? "INSERT INTO colores_producto(id_producto, nombre, stock) VALUES(?, ?, ?)" : "INSERT INTO colores_producto(id_producto, nombre) VALUES(?, ?)";

$query = $data_base->prepare($query_text);
if($nameStockColor) {
    $query->bind_param("isi", $idProducto, $nameColor, $nameStockColor);
} else {
    $query->bind_param("is", $idProducto, $nameColor);
}

if (!$query->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, $query->error, "message" => "Error al agregar color"]);
    exit;
}

$id_color = $data_base->insert_id;

for ($i = 0; $i < count($nameSizes); $i++) {
    $query = $data_base->prepare("INSERT INTO talles_color_producto(id_color, talle, stock) VALUES(?, ?, ?)");
    $query->bind_param("isi", $id_color, $nameSizes[$i], $nameStocks[$i]);
    if (!$query->execute()) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al agregar talle"]);
        exit;
    }
}

if (isset($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        $originalName = $_FILES['images']['name'][$index];
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = uniqid('color_'.$id_color.'_') . '.' . $ext;
        $uploadPath = __DIR__ . "/../public/uploads/products/$newName";

        if (move_uploaded_file($tmpName, $uploadPath)) {
            $query = $data_base->prepare("INSERT INTO imagenes_color_producto(id_color, ruta_imagen) VALUES(?, ?)");
            $query->bind_param("is", $id_color, $newName);
            $query->execute();
        }
    }
}

http_response_code(200);
echo json_encode([
    "success" => true,
    "id_color" => $id_color
]);
