<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos",
        "error" => $data_base->connect_error
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$productId = $body["productId"] ?? null;
$data = $body["data"] ?? [];

if (!$productId || empty($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos requeridos"
    ]);
    exit;
}

$data_base->begin_transaction();

try {
    $queryCheck = $data_base->prepare("
        SELECT id_caracteristica 
        FROM caracteristicas_producto 
        WHERE id_producto = ? AND caracteristica = ?
    ");
    $queryInsert = $data_base->prepare("
        INSERT INTO caracteristicas_producto (id_producto, caracteristica)
        VALUES (?, ?)
    ");

    foreach ($data as $charac) {
        $charac = trim($charac);
        if ($charac === "") continue;

        $queryCheck->bind_param("is", $productId, $charac);
        $queryCheck->execute();
        $res = $queryCheck->get_result();

        if ($res->num_rows === 0) {
            $queryInsert->bind_param("is", $productId, $charac);
            $queryInsert->execute();
        }
    }

    $data_base->commit();

    $result = $data_base->query("SELECT * FROM caracteristicas_producto WHERE id_producto = $productId");
    $rows = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Características actualizadas correctamente",
        "data" => $rows
    ]);

} catch (Exception $e) {
    $data_base->rollback();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
} finally {
    $queryCheck->close();
    $queryInsert->close();
    $data_base->close();
}
