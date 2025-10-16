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

$special_image_categories = [
    "Electrónica",
    "Ropa hombre",
    "Ropa mujer",
    "Ropa niño",
    "Ropa niña",
    "Ropa unisex",
    "Calzado",
    "Accesorios",
    "Juguetes",
    "Hogar y Cocina",
    "Salud y Belleza",
    "Deportes y Aire libre",
    "Bebés y niños",
    "Computación",
    "Celulares y accesorios",
    "Oficina y papelería",
    "Automotriz",
    "Jardín y exteriores",
    "Vehículos",
    "Repuestos y autopartes",
    "Motocicletas",
    "Náutica",
    "Electrodomésticos",
    "Instrumentos Musicales"
];

$color_stock_categories = [
    "Accesorios",
    "Juguetes",
    "Hogar y Cocina",
    "Salud y Belleza",
    "Deportes y Aire libre",
    "Bebés y niños",
    "Computación",
    "Celulares y accesorios",
    "Oficina y papelería",
    "Automotriz",
    "Jardín y exteriores",
    "Vehículos",
    "Repuestos y autopartes",
    "Motocicletas",
    "Náutica",
    "Electrodomésticos",
    "Instrumentos Musicales",
    "Electrónica"
];

$query = $data_base->prepare("
    SELECT 
        p.id_producto, 
        p.nombre_producto, 
        p.precio,
        GROUP_CONCAT(DISTINCT c.nombre_categoria) as categorias,
        CASE 
            WHEN GROUP_CONCAT(DISTINCT c.nombre_categoria) REGEXP '" . implode("|", array_map('preg_quote', $color_stock_categories)) . "' THEN
                (SELECT SUM(cp.stock)
                 FROM colores_producto cp
                 WHERE cp.id_producto = p.id_producto)
            WHEN GROUP_CONCAT(DISTINCT c.nombre_categoria) REGEXP '" . implode("|", array_map('preg_quote', $special_image_categories)) . "' THEN
                (SELECT SUM(tcp.stock)
                 FROM colores_producto cp
                 JOIN talles_color_producto tcp ON tcp.id_color = cp.id_color
                 WHERE cp.id_producto = p.id_producto)
            ELSE p.stock
        END AS stock,
        CASE 
            WHEN GROUP_CONCAT(DISTINCT c.nombre_categoria) REGEXP '" . implode("|", array_map('preg_quote', $special_image_categories)) . "' THEN
                (SELECT CONCAT('uploads/products/', icp.ruta_imagen) 
                 FROM imagenes_color_producto icp
                 JOIN colores_producto cp ON cp.id_color = icp.id_color
                 WHERE cp.id_producto = p.id_producto
                 ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC 
                 LIMIT 1)
            ELSE
                (SELECT i.ruta_imagen 
                 FROM imagenes_productos i
                 WHERE p.id_producto = i.id_producto
                 ORDER BY i.id_imagen ASC 
                 LIMIT 1)
        END AS ruta_imagen
    FROM productos p
    JOIN productos_categorias pc ON pc.id_producto = p.id_producto 
    JOIN categorias c ON c.id_categoria = pc.id_categoria
    WHERE p.id_vendedor = ?
    GROUP BY p.id_producto, p.nombre_producto, p.precio, p.stock
");

$query->bind_param("i", $id);
if (!$query->execute()) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener productos"
    ]);
    exit;
}

$result = $query->get_result()->fetch_all(MYSQLI_ASSOC);

if (count($result) === 0) {
    echo json_encode([]);
    exit;
}

$data = [];
foreach ($result as $producto) {
    $data[] = [
        'id_producto' => $producto['id_producto'],
        'nombre_producto' => $producto['nombre_producto'],
        'precio' => $producto['precio'],
        'stock' => $producto['stock'] ?: 0,
        'ruta_imagen' => $producto['ruta_imagen']
    ];
}

echo json_encode($data);
