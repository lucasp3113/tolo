<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]);
    exit;
}

$productId = $_GET['productId'];

// para el tiempo
function formatearTiempo($segundos) {
    if ($segundos < 60) return "hace " . $segundos . " segundos";
    if ($segundos < 3600) return "hace " . floor($segundos / 60) . " minutos";
    if ($segundos < 86400) return "hace " . floor($segundos / 3600) . " horas";
    if ($segundos < 604800) return "hace " . floor($segundos / 86400) . " días";
    if ($segundos < 2592000) return "hace " . floor($segundos / 604800) . " semanas";
    if ($segundos < 31536000) return "hace " . floor($segundos / 2592000) . " meses";
    return "hace " . floor($segundos / 31536000) . " años";
}

$query = $data_base->prepare("
    SELECT 
        c.*, 
        u.nombre_usuario,
        TIMESTAMPDIFF(SECOND, c.fecha_creacion, NOW()) as segundos_transcurridos
    FROM comentarios_productos c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_producto = ? AND c.activo = 1
    ORDER BY c.fecha_creacion DESC
");

$query->bind_param("i", $productId);
$query->execute();
$comments = $query->get_result()->fetch_all(MYSQLI_ASSOC);

foreach ($comments as &$comment) {
    $comment['tiempo_transcurrido'] = formatearTiempo($comment['segundos_transcurridos']);
    
    $respuestas_query = $data_base->prepare("
        SELECT 
            r.id_respuesta,
            r.respuesta,
            r.fecha_creacion,
            u.nombre_usuario,
            u.id_usuario,
            TIMESTAMPDIFF(SECOND, r.fecha_creacion, NOW()) as segundos_transcurridos
        FROM respuestas_comentario r
        JOIN usuarios u ON r.id_usuario = u.id_usuario
        WHERE r.id_comentario = ?
        ORDER BY r.fecha_creacion ASC
    ");
    
    $respuestas_query->bind_param("i", $comment['id_comentario']);
    $respuestas_query->execute();
    $result = $respuestas_query->get_result();
    
    $respuestas = [];
    while ($respuesta = $result->fetch_assoc()) {
        $respuesta['tiempo_transcurrido'] = formatearTiempo($respuesta['segundos_transcurridos']);
        $respuestas[] = $respuesta;
    }
    
    $comment['respuestas'] = $respuestas;
    $comment['total_respuestas'] = count($respuestas);
    $respuestas_query->close();
}

$statsQuery = $data_base->prepare("
    SELECT COUNT(*) as total_comentarios, AVG(rating) as promedio_rating 
    FROM comentarios_productos 
    WHERE id_producto = ? AND activo = 1
");
$statsQuery->bind_param("i", $productId);
$statsQuery->execute();
$stats = $statsQuery->get_result()->fetch_assoc();
$stats['promedio_rating'] = round($stats['promedio_rating'], 1);

echo json_encode([
    "success" => true, 
    "comments" => $comments, 
    "stats" => $stats
]);

$query->close();
$statsQuery->close();
$data_base->close();
?>