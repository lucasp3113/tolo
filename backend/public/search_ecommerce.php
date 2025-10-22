<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
require __DIR__ . '/../vendor/autoload.php';

use MeiliSearch\Client;

$client = new Client('http://127.0.0.1:7700');
$index = $client->index('E-Commerce');

$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(value: [
        "success" => false
    ]);
} else {

    $body = json_decode(file_get_contents("php://input"), true);
    $searchQuery = $body['search'];

    $resultados = $index->search($searchQuery, [
        'matchingStrategy' => 'all'
    ]);
    $hits = $resultados->getHits();

    $cutes_words = [];
    foreach ($hits as $h) {
        $cutes_words[] = $h["name"];
    }

    if (count($cutes_words) === 0) {
        echo json_encode([
            "success" => true,
            "data" => []
        ]);
        exit;
    }

    $number_of_question_marks = implode(",", array_fill(0, count($cutes_words), "?"));
    $numero_of_s = str_repeat("s", count($cutes_words));

    $query = $data_base->prepare(
        "SELECT e.id_ecommerce, e.nombre_ecommerce, e.logo, r.nombre_rango, u.nombre_usuario
                FROM ecommerces e
                JOIN rangos r ON r.id_rango = e.rango_actual
                JOIN usuarios u ON u.id_usuario = e.id_usuario
                WHERE e.nombre_ecommerce IN ($number_of_question_marks);
                "
    );
    $query->bind_param($numero_of_s, ...$cutes_words);
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $result
        ]);
    }
}
