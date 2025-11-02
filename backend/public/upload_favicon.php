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

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

if (!empty($_POST['user']) && isset($_FILES['favicon'])) {
    $username = $_POST['user'];
    $file = $_FILES['favicon'];

    $allowed_types = ['image/x-icon', 'image/vnd.microsoft.icon'];
    $max_size = 10 * 1024 * 1024;

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al subir el archivo"]);
        exit;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actual_mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($actual_mime, $allowed_types)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Solo se permite formato .ico"]);
        exit;
    }

    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "El archivo es demasiado grande"]);
        exit;
    }

    $upload_dir = "uploads/favicons_images/";
    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

    $unique_name = uniqid() . '_' . time() . '.ico';
    $file_path = $upload_dir . $unique_name;

    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al guardar el archivo"]);
        exit;
    }

    $query = $data_base->prepare("
        SELECT favicon
        FROM ecommerces e
        JOIN usuarios u ON e.id_usuario = u.id_usuario
        WHERE u.nombre_usuario = ?
    ");
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result()->fetch_assoc();
    $current_favicon = $result['favicon'] ?? null;

    $query_update = $data_base->prepare("
        UPDATE ecommerces e
        JOIN usuarios u ON e.id_usuario = u.id_usuario
        SET e.favicon = ?
        WHERE u.nombre_usuario = ?
    ");
    $query_update->bind_param("ss", $file_path, $username);

    if ($query_update->execute()) {
        if ($current_favicon && file_exists($current_favicon)) unlink($current_favicon);

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Favicon actualizado correctamente",
            "favicon" => $file_path
        ]);
        exit;
    } else {
        unlink($file_path);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al actualizar la base de datos"]);
        exit;
    }

} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No se recibió usuario o archivo"]);
}
