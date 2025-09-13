<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require __DIR__ . '/../vendor/autoload.php';
use MeiliSearch\Client;

$client = new Client('http://127.0.0.1:7700');
$index = $client->index('productos');

$data_base = new mysqli("localhost", "root", "", "tolo");
if (!$data_base->connect_error) {
    $body = json_decode(file_get_contents("php://input"), true);
    $searchQuery = $body['search'];
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
    $number_of_question_marks = implode(",", array_fill(0, count($hits), "?"));
    $query_text = "SELECT p.id_producto, p.id_ecommerce, p.nombre_producto, p.precio, p.stock, c.nombre_categoria, (
    SELECT i.ruta_imagen FROM imagenes_productos i
    WHERE p.id_producto = i.id_producto
    ORDER BY i.id_imagen ASC LIMIT 1
    ) AS ruta_imagen
    FROM productos p
    JOIN productos_categorias pc ON pc.id_producto = p.id_producto 
    JOIN categorias c ON c.id_categoria = pc.id_categoria
    WHERE nombre_producto IN ($number_of_question_marks) ".($categorie ? "AND c.nombre_categoria = '$categorie'" : "")
    .($order_by ? ' ORDER BY p.precio ' .$order_by : '');
    $number_of_s = str_repeat("s", count($hits));
    $query = $data_base->prepare($query_text);
    $query->bind_param($number_of_s, ...$cutes_words);
    if ($query->execute()) {
        $result = $query->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        if ($result->num_rows) {
            echo json_encode([
                "success" => true,
                "data" => $data
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
?>