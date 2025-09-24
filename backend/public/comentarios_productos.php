<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
ini_set('display_startup_errors', 1);
ini_set('display_errors', 0); // no mostrar errores en la salida
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data_base = new mysqli("localhost", "root", "", "tolo");

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar la base de datos: " . $data_base->connect_error
    ]);
    exit;
}

$data_base->set_charset("utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch($method) {
    case 'GET':
        obtenerComentarios($data_base);
        break;
    case 'POST':
        crearComentario($data_base, $data);
        break;
    case 'PUT':
        actualizarComentario($data_base, $data);
        break;
    case 'DELETE':
        eliminarComentario($data_base, $data);
        break;
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Método no permitido"
        ]);
        break;
}

function obtenerComentarios($data_base) {
    $id_producto = $_GET['id_producto'] ?? null;
    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    $offset = ($page - 1) * $limit;
    
    if (!$id_producto) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Falta id_producto"
        ]);
        return;
    }
    
    // Obtener comentarios paginados
    $query = $data_base->prepare("
        SELECT 
            id_comentario,
            id_usuario,
            rating,
            comentario,
            nombre_usuario,
            avatar_url,
            tiempo_transcurrido,
            fecha_creacion
        FROM vista_comentarios 
        WHERE id_producto = ? 
        ORDER BY fecha_creacion DESC 
        LIMIT ? OFFSET ?
    ");
    
    if (!$query) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar consulta"
        ]);
        return;
    }
    
    $query->bind_param("iii", $id_producto, $limit, $offset);
    
    if (!$query->execute()) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al ejecutar consulta"
        ]);
        return;
    }
    
    $result = $query->get_result();
    $comentarios = $result->fetch_all(MYSQLI_ASSOC);
    
    // Obtener total de comentarios para paginación
    $count_query = $data_base->prepare("
        SELECT COUNT(*) as total 
        FROM comentarios_productos 
        WHERE id_producto = ? AND activo = TRUE
    ");
    $count_query->bind_param("i", $id_producto);
    $count_query->execute();
    $total_result = $count_query->get_result()->fetch_assoc();
    $total = $total_result['total'];
    
    // Obtener estadísticas de rating
    $stats_query = $data_base->prepare("
        SELECT 
            AVG(rating) as promedio_rating,
            COUNT(*) as total_comentarios,
            SUM(CASE WHEN rating >= 4.5 THEN 1 ELSE 0 END) as rating_5,
            SUM(CASE WHEN rating >= 3.5 AND rating < 4.5 THEN 1 ELSE 0 END) as rating_4,
            SUM(CASE WHEN rating >= 2.5 AND rating < 3.5 THEN 1 ELSE 0 END) as rating_3,
            SUM(CASE WHEN rating >= 1.5 AND rating < 2.5 THEN 1 ELSE 0 END) as rating_2,
            SUM(CASE WHEN rating < 1.5 THEN 1 ELSE 0 END) as rating_1
        FROM comentarios_productos 
        WHERE id_producto = ? AND activo = TRUE
    ");
    $stats_query->bind_param("i", $id_producto);
    $stats_query->execute();
    $stats = $stats_query->get_result()->fetch_assoc();
    
    $query->close();
    $count_query->close();
    $stats_query->close();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => [
            "comentarios" => $comentarios,
            "pagination" => [
                "current_page" => (int)$page,
                "total_pages" => ceil($total / $limit),
                "total_comments" => (int)$total,
                "per_page" => (int)$limit
            ],
            "stats" => [
                "promedio_rating" => round($stats['promedio_rating'] ?? 0, 1),
                "total_comentarios" => (int)$stats['total_comentarios'],
                "distribucion" => [
                    "5_estrellas" => (int)$stats['rating_5'],
                    "4_estrellas" => (int)$stats['rating_4'],
                    "3_estrellas" => (int)$stats['rating_3'],
                    "2_estrellas" => (int)$stats['rating_2'],
                    "1_estrella" => (int)$stats['rating_1']
                ]
            ]
        ],
        "message" => "Comentarios obtenidos correctamente"
    ]);
}

function crearComentario($data_base, $data) {
    $id_producto = $data['id_producto'] ?? null;
    $id_usuario = $data['id_usuario'] ?? null; // Deberías obtener esto del token de sesión
    $rating = $data['rating'] ?? null;
    $comentario = $data['comentario'] ?? null;
    
    // Validaciones
    if (!$id_producto || !$id_usuario || !$rating || !$comentario) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Faltan campos obligatorios"
        ]);
        return;
    }
    
    if ($rating < 0 || $rating > 5) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "El rating debe estar entre 0 y 5"
        ]);
        return;
    }
    
    if (strlen(trim($comentario)) < 5) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "El comentario debe tener al menos 5 caracteres"
        ]);
        return;
    }
    
    if (strlen($comentario) > 1000) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "El comentario no puede exceder 1000 caracteres"
        ]);
        return;
    }
    
    // Verificar si el usuario ya comentó este producto
    $check_query = $data_base->prepare("
        SELECT id_comentario 
        FROM comentarios_productos 
        WHERE id_usuario = ? AND id_producto = ?
    ");
    $check_query->bind_param("ii", $id_usuario, $id_producto);
    $check_query->execute();
    $existing = $check_query->get_result()->fetch_assoc();
    $check_query->close();
    
    if ($existing) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Ya has comentado este producto. Puedes editar tu comentario existente."
        ]);
        return;
    }
    
    // Insertar comentario
    $insert_query = $data_base->prepare("
        INSERT INTO comentarios_productos (id_producto, id_usuario, rating, comentario) 
        VALUES (?, ?, ?, ?)
    ");
    
    if (!$insert_query) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar consulta"
        ]);
        return;
    }
    
    $insert_query->bind_param("iids", $id_producto, $id_usuario, $rating, trim($comentario));
    
    if ($insert_query->execute()) {
        $id_comentario = $data_base->insert_id;
        
        // Obtener el comentario recién creado
        $get_new_comment = $data_base->prepare("
            SELECT * FROM vista_comentarios 
            WHERE id_comentario = ?
        ");
        $get_new_comment->bind_param("i", $id_comentario);
        $get_new_comment->execute();
        $nuevo_comentario = $get_new_comment->get_result()->fetch_assoc();
        $get_new_comment->close();
        
        $insert_query->close();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "data" => $nuevo_comentario,
            "message" => "Comentario creado correctamente"
        ]);
    } else {
        $insert_query->close();
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al crear el comentario"
        ]);
    }
}

function actualizarComentario($data_base, $data) {
    $id_comentario = $data['id_comentario'] ?? null;
    $id_usuario = $data['id_usuario'] ?? null; // Del token de sesión
    $rating = $data['rating'] ?? null;
    $comentario = $data['comentario'] ?? null;
    
    if (!$id_comentario || !$id_usuario || !$rating || !$comentario) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Faltan campos obligatorios"
        ]);
        return;
    }
    
    // Verificar que el comentario pertenece al usuario
    $verify_query = $data_base->prepare("
        SELECT id_comentario 
        FROM comentarios_productos 
        WHERE id_comentario = ? AND id_usuario = ?
    ");
    $verify_query->bind_param("ii", $id_comentario, $id_usuario);
    $verify_query->execute();
    $comment = $verify_query->get_result()->fetch_assoc();
    $verify_query->close();
    
    if (!$comment) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Comentario no encontrado o no tienes permisos"
        ]);
        return;
    }
    
    // Actualizar comentario
    $update_query = $data_base->prepare("
        UPDATE comentarios_productos 
        SET rating = ?, comentario = ?, fecha_actualizacion = CURRENT_TIMESTAMP 
        WHERE id_comentario = ?
    ");
    $update_query->bind_param("dsi", $rating, trim($comentario), $id_comentario);
    
    if ($update_query->execute()) {
        $update_query->close();
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Comentario actualizado correctamente"
        ]);
    } else {
        $update_query->close();
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al actualizar el comentario"
        ]);
    }
}

function eliminarComentario($data_base, $data) {
    $id_comentario = $data['id_comentario'] ?? null;
    $id_usuario = $data['id_usuario'] ?? null;
    
    // DEBUG: Agregar logs
    error_log("DEBUG DELETE - id_comentario: " . $id_comentario);
    error_log("DEBUG DELETE - id_usuario: " . $id_usuario);
    
    if (!$id_comentario || !$id_usuario) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Faltan campos obligatorios"
        ]);
        return;
    }
    
    $delete_query = $data_base->prepare("
        DELETE FROM comentarios_productos
        WHERE id_comentario = ? AND id_usuario = ?; 
    ");
    $delete_query->bind_param("ii", $id_comentario, $id_usuario);
        
    if ($delete_query->execute()) {
        // DEBUG: Verificar cuántas filas se afectaron
        $affected_rows = $delete_query->affected_rows;
        error_log("DEBUG DELETE - affected_rows: " . $affected_rows);
        
        if ($affected_rows > 0) {
            $delete_query->close();
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Comentario eliminado correctamente"
            ]);
        } else {
            $delete_query->close();
            error_log("DEBUG DELETE - NO SE AFECTARON FILAS");
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Comentario no encontrado o no tienes permisos"
            ]);
        }
    } else {
        error_log("DEBUG DELETE - ERROR EN EXECUTE: " . $delete_query->error);
        $delete_query->close();
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Error al ejecutar consulta de eliminación"
        ]);
    }
}

$data_base->close();
