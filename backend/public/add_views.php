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
    $query = $data_base->prepare("INSERT INTO visitas (fecha) VALUES (NOW())");
    
    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            "message" => "ERROR al registrar la visita"
        ]);
    } else {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            "message" => "Visita registrada exitosamente"
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        "message" => "ERROR de conexión"
    ]);
}
?>