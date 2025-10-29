<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
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
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$data_base->set_charset("utf8mb4");

// Función para formatear tiempo
function formatearTiempo($segundos) {
    if ($segundos < 60) return "hace " . $segundos . " segundos";
    if ($segundos < 3600) return "hace " . floor($segundos / 60) . " minutos";
    if ($segundos < 86400) return "hace " . floor($segundos / 3600) . " horas";
    if ($segundos < 604800) return "hace " . floor($segundos / 86400) . " días";
    if ($segundos < 2592000) return "hace " . floor($segundos / 604800) . " semanas";
    if ($segundos < 31536000) return "hace " . floor($segundos / 2592000) . " meses";
    return "hace " . floor($segundos / 31536000) . " años";
}

$body = json_decode(file_get_contents("php://input"), true);

// Validaciones
if (!isset($body["commentId"], $body["userId"], $body["respuesta"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos requeridos: commentId, userId o respuesta"
    ]);
    exit;
}

// Validar longitud de respuesta
$respuesta_trimmed = trim($body["respuesta"]);
if (strlen($respuesta_trimmed) < 1) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La respuesta no puede estar vacía"
    ]);
    exit;
}

if (strlen($respuesta_trimmed) > 500) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La respuesta no puede exceder 500 caracteres"
    ]);
    exit;
}

// Verificar que el comentario existe
$check_comment = $data_base->prepare(
    "SELECT id_comentario FROM comentarios_productos WHERE id_comentario = ?"
);
$check_comment->bind_param("i", $body["commentId"]);
$check_comment->execute();
$comment_exists = $check_comment->get_result()->fetch_assoc();
$check_comment->close();

if (!$comment_exists) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "El comentario no existe"
    ]);
    exit;
}

// Insertar respuesta
$query = $data_base->prepare(
    "INSERT INTO respuestas_comentario(id_comentario, id_usuario, respuesta) VALUES(?, ?, ?)"
);
$query->bind_param("iis", $body["commentId"], $body["userId"], $respuesta_trimmed);

if ($query->execute()) {
    $id_respuesta = $data_base->insert_id;

    // Obtener los datos completos de la respuesta recién creada
    $queryRespuesta = $data_base->prepare(
        "SELECT 
            r.id_respuesta,
            r.respuesta,
            r.fecha_creacion,
            r.id_comentario,
            r.id_usuario,
            u.nombre_usuario,
            TIMESTAMPDIFF(SECOND, r.fecha_creacion, NOW()) as segundos_transcurridos
         FROM respuestas_comentario r
         JOIN usuarios u ON r.id_usuario = u.id_usuario
         WHERE r.id_respuesta = ?"
    );
    
    if (!$queryRespuesta) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar consulta de respuesta"
        ]);
        $query->close();
        $data_base->close();
        exit;
    }
    
    $queryRespuesta->bind_param("i", $id_respuesta);
    $queryRespuesta->execute();
    $result = $queryRespuesta->get_result();
    $nuevaRespuesta = $result->fetch_assoc();

    if ($nuevaRespuesta) {
        // Formatear el tiempo
        $nuevaRespuesta['tiempo_transcurrido'] = formatearTiempo($nuevaRespuesta['segundos_transcurridos']);
        
        // Remover el campo temporal
        unset($nuevaRespuesta['segundos_transcurridos']);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Respuesta agregada correctamente",
            "respuesta" => $nuevaRespuesta
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al obtener la respuesta creada"
        ]);
    }

    $queryRespuesta->close();
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al agregar respuesta",
        "error_detail" => $query->error
    ]);
}

$query->close();
$data_base->close();