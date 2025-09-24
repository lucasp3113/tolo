<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);

$productId = $_GET['productId'];

$query = $data_base->prepare("
    SELECT c.*, u.nombre_usuario 
    FROM comentarios_productos c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_producto = ? AND c.activo = 1
    ORDER BY c.fecha_creacion DESC
");

$query->bind_param("i", $productId);
$query->execute();
$comments = $query->get_result()->fetch_all(MYSQLI_ASSOC);

$statsQuery = $data_base->prepare("SELECT COUNT(*) as total_comentarios, AVG(rating) as promedio_rating FROM comentarios_productos WHERE id_producto = ? AND activo = 1");
$statsQuery->bind_param("i", $productId);
$statsQuery->execute();
$stats = $statsQuery->get_result()->fetch_assoc();
$stats['promedio_rating'] = round($stats['promedio_rating'], 1);

echo json_encode(["success" => true, "comments" => $comments, "stats" => $stats]);