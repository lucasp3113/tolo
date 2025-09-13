<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");
if (!$data_base) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

if (!empty($_POST['user']) && isset($_FILES['profilePicture'])) {
    $username = $_POST['user'];
    $file = $_FILES['profilePicture'];

    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
    $max_size = 5 * 1024 * 1024;

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al subir la imagen"]);
        exit;
    }
    if (!in_array($file['type'], $allowed_types)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Formato no permitido. Solo PNG y JPG"]);
        exit;
    }
    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "La imagen es demasiado grande"]);
        exit;
    }
    $upload_dir = "public/uploads/profile_pictures/";
    if (!file_exists($upload_dir))
        mkdir($upload_dir, 0777, true);

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $unique_name = uniqid() . '_' . time() . '.' . $extension;
    $file_path = $upload_dir . $unique_name;
    $query = $data_base->prepare("
        SELECT e.logo 
        FROM ecommerces e 
        JOIN usuarios u ON e.id_usuario = u.id_usuario 
        WHERE u.nombre_usuario = ?
    ");
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result()->fetch_assoc();
    $current_logo = $result['logo'] ?? null;
    if (move_uploaded_file($file['tmp_name'], $file_path)) {
        $query_update = $data_base->prepare("
            UPDATE ecommerces e
            JOIN usuarios u ON e.id_usuario = u.id_usuario
            SET e.logo = ?
            WHERE u.nombre_usuario = ?
        ");
        $query_update->bind_param("ss", $file_path, $username);

        if ($query_update->execute()) {
            if ($current_logo && file_exists($current_logo)) {
                unlink($current_logo);
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Foto de perfil guardada exitosamente",
                "logo" => $file_path
            ]);
            exit;
        } else {
            unlink($file_path); // eliminar imagen si falla la base de datos
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error al actualizar la base de datos"]);
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al mover la imagen al servidor"]);
        exit;
    }

} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No se recibió usuario o archivo"]);
}
?>