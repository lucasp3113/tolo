<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require __DIR__ . '/../vendor/autoload.php';
use MeiliSearch\Client;

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
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

if (empty($_POST)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos POST"
    ]);
    exit;
}


$username = $_POST["username"];
$name_product = $_POST["nameProduct"];
$product_price = $_POST["productPrice"];
$product_stock = $_POST["productStock"] ?? null;
$product_description = $_POST["productDescription"] ?? null;
$categories_json = $_POST["categories"] ?? "[]";
$categories_array = json_decode($categories_json, true);
$category_list = array_map(fn($item) => $item[0], $categories_array);
$shipping = !empty($_POST["shipping"]) ? 1 : 0;

$clothing_categories = [
    "Ropa hombre","Ropa mujer","Ropa niño","Ropa niña","Ropa unisex","Calzado","Accesorios","Bebés y niños"
];

$no_image_categories = [
    "Electrónica","Computación","Celulares y accesorios","Oficina y papelería","Automotriz",
    "Motocicletas","Náutica","Electrodomésticos","Instrumentos Musicales"
];

$is_clothing = !empty(array_intersect($category_list, $clothing_categories));
$skip_images = !empty(array_intersect($category_list, $no_image_categories));

function convertToWebP($source_path, $destination_path) {
    $image_info = getimagesize($source_path);
    if (!$image_info) return false;

    switch ($image_info['mime']) {
        case 'image/jpeg':
        case 'image/jpg': $source_image = imagecreatefromjpeg($source_path); break;
        case 'image/png': $source_image = imagecreatefrompng($source_path); break;
        case 'image/gif': $source_image = imagecreatefromgif($source_path); break;
        case 'image/webp': $source_image = imagecreatefromwebp($source_path); break;
        default: return false;
    }

    if (!$source_image) return false;

    $result = imagewebp($source_image, $destination_path, 85);
    imagedestroy($source_image);
    return $result;
}

function saveImages($product_id, $data_base) {
    if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) return false;

    $saved_images = [];
    $upload_dir = "uploads/products/";

    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

    $allowed_types = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    $max_size = 5 * 1024 * 1024;

    for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
        $file_tmp = $_FILES['images']['tmp_name'][$i];
        $file_size = $_FILES['images']['size'][$i];
        $file_error = $_FILES['images']['error'][$i];

        if ($file_error !== UPLOAD_ERR_OK) continue;

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $actual_mime = finfo_file($finfo, $file_tmp);
        finfo_close($finfo);

        if (!in_array($actual_mime, $allowed_types)) continue;
        if ($file_size > $max_size) continue;

        $unique_name = uniqid() . '_' . time() . '.webp';
        $file_path = $upload_dir . $unique_name;

        if (convertToWebP($file_tmp, $file_path)) {
            $relative_path = "uploads/products/" . $unique_name;
            $query = $data_base->prepare("INSERT INTO imagenes_productos (id_producto, ruta_imagen) VALUES (?, ?)");
            $query->bind_param("is", $product_id, $relative_path);
            if ($query->execute()) $saved_images[] = $relative_path;
            else unlink($file_path);
        }
    }
    return count($saved_images) > 0 ? $saved_images : false;
}

$query = $data_base->prepare("SELECT id_usuario, tipo_usuario FROM usuarios WHERE nombre_usuario = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result()->fetch_assoc();

if (!$result) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    exit;
}

$id = $result["id_usuario"];
$user_type = $result["tipo_usuario"];
$id_ecommerce = null;

if ($user_type === "ecommerce") {
    $query = $data_base->prepare("SELECT id_ecommerce FROM ecommerces WHERE id_usuario = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $id_ecommerce = $query->get_result()->fetch_assoc()["id_ecommerce"];
} elseif ($user_type !== "vendedor_particular") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Usuario no autorizado"]);
    exit;
}

if ($is_clothing) {
    $query = $data_base->prepare("INSERT INTO productos(id_vendedor, id_ecommerce, nombre_producto, descripcion, precio, envio_gratis) VALUES (?, ?, ?, ?, ?, ?)");
    $query->bind_param("iissdi", $id, $id_ecommerce, $name_product, $product_description, $product_price, $shipping);
} else {
    $query = $data_base->prepare("INSERT INTO productos(id_vendedor, id_ecommerce, nombre_producto, descripcion, precio, stock, envio_gratis) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $query->bind_param("iissdii", $id, $id_ecommerce, $name_product, $product_description, $product_price, $product_stock, $shipping);
}

if (!$query->execute()) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error al crear el producto", "error" => $query->error]);
    exit;
}

$product_id = $data_base->insert_id;

if (!empty($category_list)) {
    $placeholders = implode(',', array_fill(0, count($category_list), '?'));
    $types = str_repeat('s', count($category_list));
    $query = $data_base->prepare("SELECT id_categoria FROM categorias WHERE nombre_categoria IN ($placeholders)");
    $query->bind_param($types, ...$category_list);
    $query->execute();
    $id_categories = array_column($query->get_result()->fetch_all(MYSQLI_NUM), 0);

    if (!empty($id_categories)) {
        $insert_values = [];
        $placeholders = implode(',', array_fill(0, count($id_categories), '(?, ?)'));
        foreach ($id_categories as $cat_id) {
            $insert_values[] = $product_id;
            $insert_values[] = $cat_id;
        }
        $types = str_repeat('ii', count($id_categories));
        $query = $data_base->prepare("INSERT INTO productos_categorias(id_producto, id_categoria) VALUES $placeholders");
        $query->bind_param($types, ...$insert_values);
        $query->execute();
    }
}

$images_saved = false;
if (!$skip_images) $images_saved = saveImages($product_id, $data_base);

$client = new Client('http://127.0.0.1:7700');
$index = $client->getIndex('productos');
$producto_index = [
    'id' => trim(str_replace(" ", "", $name_product)),
    'name' => $name_product
];
$index->addDocuments([$producto_index]);

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Producto creado e indexado exitosamente",
    "product_id" => $product_id,
    "images_uploaded" => $images_saved,
    "shipping" => $shipping,
    "is_clothing" => $is_clothing,
    "skip_images" => $skip_images
]);
