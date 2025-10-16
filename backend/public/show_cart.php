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
    $body = json_decode(file_get_contents(("php://input")), true);
    $query = $data_base->prepare("SELECT u.id_usuario FROM usuarios u WHERE u.nombre_usuario = ?");
    $query->bind_param("s", $body["client"]);
    if ($query->execute()) {
        $id_client = $query->get_result()->fetch_assoc();

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

        $query = $data_base->prepare(
            "SELECT c.estado, c.id_compra, COALESCE(e.nombre_ecommerce, u.nombre_usuario) AS vendedor, e.logo, d.cantidad, d.precio_unitario, p.id_producto, p.nombre_producto, p.envio_gratis, ca.nombre_categoria,
            CASE 
                WHEN ca.nombre_categoria IN ('" . implode("','", $color_stock_categories) . "') THEN
                    (SELECT SUM(cp.stock)
                     FROM colores_producto cp
                     WHERE cp.id_producto = p.id_producto)
                WHEN ca.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
                    (SELECT SUM(tcp.stock)
                     FROM colores_producto cp
                     JOIN talles_color_producto tcp ON tcp.id_color = cp.id_color
                     WHERE cp.id_producto = p.id_producto)
                ELSE p.stock
            END AS stock,
            CASE 
                WHEN ca.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
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
                FROM compras c
                JOIN detalles_compras d ON d.id_compra = c.id_compra
                JOIN productos p ON p.id_producto = d.id_producto
                LEFT JOIN ecommerces e ON e.id_usuario = p.id_vendedor
                JOIN usuarios u ON u.id_usuario = p.id_vendedor
                JOIN productos_categorias pd ON pd.id_producto = p.id_producto
                JOIN categorias ca on ca.id_categoria = pd.id_categoria
                WHERE c.id_cliente = ?
            "
        );
        $query->bind_param("i", $id_client["id_usuario"]);
        if ($query->execute()) {
            $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $result
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Error"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error"
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
