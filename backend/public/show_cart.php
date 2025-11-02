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
    echo json_encode(["success" => false, "message" => "Error en la DB"]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);

$query = $data_base->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
$query->bind_param("s", $body["client"]);
$query->execute();
$id_client = $query->get_result()->fetch_assoc();

if (!$id_client) {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    exit;
}

$color_categories = [
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

$size_categories = [
    "Ropa hombre",
    "Ropa mujer",
    "Ropa niño",
    "Ropa niña",
    "Ropa unisex",
    "Calzado"
];

$query = $data_base->prepare("
SELECT 
    c.id_carrito,
    COALESCE(e.nombre_ecommerce, u.nombre_usuario) AS vendedor,
    e.logo,
    ic.id_item,
    ic.cantidad,
    ic.precio_unitario,
    p.id_producto,
    p.nombre_producto,
    ca.nombre_categoria,

    /* STOCK DINÁMICO */
    CASE 
        WHEN ca.nombre_categoria IN ('Ropa hombre','Ropa mujer','Ropa niño','Ropa niña','Ropa unisex','Calzado') THEN
            (SELECT SUM(tcp.stock)
             FROM colores_producto cp
             JOIN talles_color_producto tcp ON tcp.id_color = cp.id_color
             WHERE cp.id_producto = p.id_producto)

        WHEN ca.nombre_categoria IN ('Electrónica','Ropa hombre','Ropa mujer','Ropa niño','Ropa niña','Ropa unisex','Calzado',
            'Accesorios','Juguetes','Hogar y Cocina','Salud y Belleza','Deportes y Aire libre',
            'Bebés y niños','Computación','Celulares y accesorios','Oficina y papelería','Automotriz',
            'Jardín y exteriores','Vehículos','Repuestos y autopartes','Motocicletas','Náutica',
            'Electrodomésticos','Instrumentos Musicales') THEN
            (SELECT SUM(cp.stock)
             FROM colores_producto cp
             WHERE cp.id_producto = p.id_producto)

        ELSE p.stock
    END AS stock,

    /* USAR LOS VALORES REALES DEL CARRITO → ✅ FIX */
    ic.id_color,
    ic.id_talle_color_producto,

    /* IMAGEN PERFECTA */
    (
        CASE 
            WHEN ca.nombre_categoria IN ('Electrónica','Ropa hombre','Ropa mujer','Ropa niño','Ropa niña','Ropa unisex','Calzado',
                'Accesorios','Juguetes','Hogar y Cocina','Salud y Belleza','Deportes y Aire libre',
                'Bebés y niños','Computación','Celulares y accesorios','Oficina y papelería','Automotriz',
                'Jardín y exteriores','Vehículos','Repuestos y autopartes','Motocicletas','Náutica',
                'Electrodomésticos','Instrumentos Musicales') THEN
                (SELECT CONCAT('uploads/products/', icp.ruta_imagen)
                 FROM colores_producto cp
                 JOIN imagenes_color_producto icp ON icp.id_color = cp.id_color
                 WHERE cp.id_producto = p.id_producto
                 ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC LIMIT 1)
            ELSE
                (SELECT ruta_imagen
                 FROM imagenes_productos
                 WHERE id_producto = p.id_producto
                 ORDER BY id_imagen ASC LIMIT 1)
        END
    ) AS ruta_imagen

FROM carrito c
JOIN items_carrito ic ON ic.id_carrito = c.id_carrito
JOIN productos p ON p.id_producto = ic.id_producto
LEFT JOIN ecommerces e ON e.id_ecommerce = c.id_ecommerce
LEFT JOIN usuarios u ON u.id_usuario = e.id_usuario
JOIN productos_categorias pc ON pc.id_producto = p.id_producto
JOIN categorias ca ON ca.id_categoria = pc.id_categoria
WHERE c.id_usuario = ?
ORDER BY vendedor, ic.fecha_agregado DESC

");

$query->bind_param("i", $id_client["id_usuario"]);
$query->execute();

$result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
echo json_encode(["success" => true, "data" => $result]);

$data_base->close();
