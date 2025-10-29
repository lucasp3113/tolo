<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight request
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

// Validar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);
for ($i = 0; $i < count($body["data"]); $i++) {
    $query = $data_base->prepare("INSERT INTO caracteristicas_producto(id_producto, caracteristica) VALUES(?, ?)");
    $query->bind_param("is", $body["productId"], $body["data"][$i]);
    if($query->execute()) {
        continue;
    } else {
        http_response_code(400);
        echo json_encode([
            "success"=> false,

        ]);
        exit;
    }
}

// Validar que data no esté vacío
if (empty($body["data"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El array 'data' no puede estar vacío"
    ]);
    exit;
}

// Iniciar transacción para asegurar atomicidad
$data_base->begin_transaction();

try {
    $query = $data_base->prepare("INSERT INTO caracteristicas_producto(id_producto, caracteristica) VALUES(?, ?)");
    
    if (!$query) {
        throw new Exception("Error al preparar la consulta: " . $data_base->error);
    }
    
    for ($i = 0; $i < count($body["data"]); $i++) {
        $query->bind_param("is", $body["productId"], $body["data"][$i]);
        
        if (!$query->execute()) {
            throw new Exception("Error al insertar característica: " . $query->error);
        }
    }
    
    // Si todo salió bien, confirmar la transacción
    $data_base->commit();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Características insertadas correctamente",
        "inserted" => count($body["data"])
    ]);
    
} catch (Exception $e) {
    // Si hay error, revertir todos los cambios
    $data_base->rollback();
    
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$query->close();
$data_base->close();