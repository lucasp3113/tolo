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
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

$body = json_decode($_POST['json'], true);

$idColor = $body['idColor'] ?? null;
$nameColor = $body['nameColor'] ?? null;
$nameSizes = $body['nameSizes'] ?? [];
$nameStocks = $body['nameStocks'] ?? [];
$nameStockColor = $body['nameStockColor'] ?? null;

if (!$idColor || !$nameColor) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Faltan datos requeridos"]);
    exit;
}

$query = $data_base->prepare("SELECT id_producto FROM colores_producto WHERE id_color = ?");
$query->bind_param("i", $idColor);
$query->execute();
$result = $query->get_result()->fetch_assoc();

if (!$result) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Color no encontrado"]);
    exit;
}

$idProducto = $result['id_producto'];

$query = $data_base->prepare("SELECT id_categoria FROM productos_categorias WHERE id_producto = ?");
$query->bind_param("i", $idProducto);
$query->execute();
$categories = $query->get_result()->fetch_all(MYSQLI_ASSOC);

if (!empty($categories)) {
    $category_ids = array_column($categories, 'id_categoria');
    $placeholders = implode(',', array_fill(0, count($category_ids), '?'));
    $query = $data_base->prepare("SELECT nombre_categoria FROM categorias WHERE id_categoria IN ($placeholders)");
    $types = str_repeat('i', count($category_ids));
    $query->bind_param($types, ...$category_ids);
    $query->execute();
    $category_names = array_column($query->get_result()->fetch_all(MYSQLI_ASSOC), 'nombre_categoria');
} else {
    $category_names = [];
}

$size_categories = ["Ropa hombre", "Ropa mujer", "Ropa niño", "Ropa niña", "Ropa unisex", "Calzado"];
$needs_sizes = !empty(array_intersect($category_names, $size_categories));

if ($needs_sizes) {
    $query = $data_base->prepare("UPDATE colores_producto SET nombre = ?, stock = NULL WHERE id_color = ?");
    $query->bind_param("si", $nameColor, $idColor);
} else {
    if ($nameStockColor !== null && $nameStockColor !== false) {
        $query = $data_base->prepare("UPDATE colores_producto SET nombre = ?, stock = ? WHERE id_color = ?");
        $query->bind_param("sii", $nameColor, $nameStockColor, $idColor);
    } else {
        $query = $data_base->prepare("UPDATE colores_producto SET nombre = ?, stock = NULL WHERE id_color = ?");
        $query->bind_param("si", $nameColor, $idColor);
    }
}

if (!$query->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar color", "error" => $query->error]);
    exit;
}

$query = $data_base->prepare("DELETE FROM talles_color_producto WHERE id_color = ?");
$query->bind_param("i", $idColor);
$query->execute();

if ($needs_sizes && !empty($nameSizes)) {
    for ($i = 0; $i < count($nameSizes); $i++) {
        if (isset($nameStocks[$i])) {
            $query = $data_base->prepare("INSERT INTO talles_color_producto(id_color, talle, stock) VALUES(?, ?, ?)");
            $query->bind_param("isi", $idColor, $nameSizes[$i], $nameStocks[$i]);
            if (!$query->execute()) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Error al agregar talle"]);
                exit;
            }
        }
    }
}

if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
    $query = $data_base->prepare("SELECT ruta_imagen FROM imagenes_color_producto WHERE id_color = ?");
    $query->bind_param("i", $idColor);
    if ($query->execute()) {
        $old_images = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        foreach ($old_images as $image) {
            $file_path = __DIR__ . "/../public/uploads/products/" . $image['ruta_imagen'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }
    }

    $query = $data_base->prepare("DELETE FROM imagenes_color_producto WHERE id_color = ?");
    $query->bind_param("i", $idColor);
    $query->execute();

    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        if (!isset($_FILES['images']['error'][$index]) || $_FILES['images']['error'][$index] !== UPLOAD_ERR_OK) {
            continue;
        }

        $originalName = $_FILES['images']['name'][$index];
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = uniqid('color_' . $idColor . '_') . '.' . $ext;
        $uploadPath = __DIR__ . "/../public/uploads/products/$newName";

        if (move_uploaded_file($tmpName, $uploadPath)) {
            $query = $data_base->prepare("INSERT INTO imagenes_color_producto(id_color, ruta_imagen) VALUES(?, ?)");
            $query->bind_param("is", $idColor, $newName);
            $query->execute();
        }
    }
}

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Color actualizado exitosamente",
    "id_color" => $idColor
]);
