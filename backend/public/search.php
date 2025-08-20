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
    $searchQuery = $body['search'] ?? '';
    $resultados = $index->search($searchQuery, [
        'matchingStrategy' => 'all'
    ]);
    $hits = $resultados->getHits();

    $cute_word = ($hits) ? "%" . $hits[0]['id'] . "%" : "";
    $query = $data_base->prepare("SELECT id_producto, id_ecommerce, nombre_producto, precio, stock FROM productos WHERE nombre_producto LIKE ?");
    $query->bind_param("s", $cute_word);
    if ($query->execute()) {
        $result = $query->get_result();
        if ($result->num_rows) {
            echo json_encode([
                "success" => true,
                "result" => $result->fetch_all(MYSQLI_ASSOC)
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