<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require __DIR__ . '/../vendor/autoload.php';
use MeiliSearch\Client;

$client = new Client('http://127.0.0.1:7700');
$index = $client->index('productos');

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if (!$data_base->connect_error) {
    $body = json_decode(file_get_contents("php://input"), true);
    $searchQuery = $body['search'];
    $ecommerce_name = $body["nameEcommerce"] ?? null;
    if (isset($body["orderBy"])) {
        $order_by = $body["orderBy"] == "lowerPrice" ? "ASC" : "DESC";
    } else {
        $order_by = null;
    }
    $condition = $body["condition"] ?? null;
    $free_Shipping = $body["freeShipping"] ?? null;
    $categorie = $body["categorie"] ?? null;

    if (!$searchQuery) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Ingrese una busqueda"
        ]);
        exit;
    }

    $resultados = $index->search($searchQuery, [
        'matchingStrategy' => 'all'
    ]);
    $hits = $resultados->getHits();

    $cutes_words = [];
    foreach ($hits as $h) {
        $cutes_words[] = $h["name"];
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

    $number_of_question_marks = implode(",", array_fill(0, count($hits), "?"));

    $query_text = $ecommerce_name ?
        "SELECT p.id_producto, p.id_ecommerce, p.nombre_producto, p.precio, com.rating, c.nombre_categoria,
    CASE 
        WHEN c.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
            (SELECT tcp.stock
             FROM imagenes_color_producto icp
             JOIN colores_producto cp ON cp.id_color = icp.id_color
             JOIN talles_color_producto tcp ON tcp.id_color = cp.id_color
             WHERE cp.id_producto = p.id_producto
             ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC, tcp.id_talle_color_producto ASC
             LIMIT 1)
        ELSE p.stock
    END AS stock,
    CASE 
        WHEN c.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
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
    LEFT JOIN comentarios_productos com ON com.id_producto = p.id_producto
    JOIN ecommerces e ON e.nombre_ecommerce = ?
    WHERE nombre_producto IN ($number_of_question_marks) AND p.id_ecommerce = e.id_ecommerce " . ($categorie ?
            "AND c.nombre_categoria = '$categorie'" : "")
        . ($order_by ? ' ORDER BY p.precio ' . $order_by : '') :
        "SELECT p.id_producto, p.id_ecommerce, p.nombre_producto, p.precio, com.rating, c.nombre_categoria,
    CASE 
        WHEN c.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
            (SELECT tcp.stock
             FROM imagenes_color_producto icp
             JOIN colores_producto cp ON cp.id_color = icp.id_color
             JOIN talles_color_producto tcp ON tcp.id_color = cp.id_color
             WHERE cp.id_producto = p.id_producto
             ORDER BY cp.id_color ASC, icp.id_imagen_color_producto ASC, tcp.id_talle_color_producto ASC
             LIMIT 1)
        ELSE p.stock
    END AS stock,
    CASE 
        WHEN c.nombre_categoria IN ('" . implode("','", $special_image_categories) . "') THEN
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
    LEFT JOIN comentarios_productos com ON com.id_producto = p.id_producto
    JOIN categorias c ON c.id_categoria = pc.id_categoria
    WHERE nombre_producto IN ($number_of_question_marks) " . ($categorie ? "AND c.nombre_categoria = '$categorie'" : "")
        . ($order_by ? ' ORDER BY p.precio ' . $order_by : '');

    $number_of_s = $ecommerce_name ? str_repeat("s", count($hits) + 1) : str_repeat("s", count($hits));
    $query = $data_base->prepare($query_text);

    if ($ecommerce_name) {
        $query->bind_param($number_of_s, $ecommerce_name, ...$cutes_words);
    } else {
        $query->bind_param($number_of_s, ...$cutes_words);
    }

    if ($query->execute()) {
        $result = $query->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        if ($result->num_rows) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $data,
                "ecommerce_name" => $ecommerce_name
            ]);
            exit;
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Ninguna publicación coincidió con tu busqueda"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "ERROR"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ERROR AL CONECTAR CON LA BASE DE DATOS"
    ]);
    exit;
}