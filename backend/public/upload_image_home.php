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

function processImage($source_path, $destination_path, $max_width = 1024) {
    $image_info = getimagesize($source_path);
    if (!$image_info) {
        return false;
    }
    
    $mime_type = $image_info['mime'];
    $original_width = $image_info[0];
    $original_height = $image_info[1];
    
    switch ($mime_type) {
        case 'image/jpeg':
        case 'image/jpg':
            $source_image = imagecreatefromjpeg($source_path);
            break;
        case 'image/png':
            $source_image = imagecreatefrompng($source_path);
            break;
        case 'image/webp':
            $source_image = imagecreatefromwebp($source_path);
            break;
        default:
            return false;
    }
    
    if (!$source_image) {
        return false;
    }

    if ($original_width > $max_width) {
        $new_width = $max_width;
        $new_height = intval(($original_height * $max_width) / $original_width);
    } else {
        $new_width = $original_width;
        $new_height = $original_height;
    }
    
    $resized_image = imagecreatetruecolor($new_width, $new_height);
    
    imagealphablending($resized_image, false);
    imagesavealpha($resized_image, true);
    $transparency = imagecolorallocatealpha($resized_image, 0, 0, 0, 127);
    imagefill($resized_image, 0, 0, $transparency);
    
    imagecopyresampled(
        $resized_image, $source_image,
        0, 0, 0, 0,
        $new_width, $new_height,
        $original_width, $original_height
    );
    
    $result = imagewebp($resized_image, $destination_path, 85);
    
    imagedestroy($source_image);
    imagedestroy($resized_image);
    
    return $result;
}

if (!empty($_POST['user']) && isset($_FILES['imageHome'])) {
    $username = $_POST['user'];
    $file = $_FILES['imageHome'];

    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    $max_size = 10 * 1024 * 1024; 

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al subir la imagen"]);
        exit;
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actual_mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($actual_mime, $allowed_types)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Formato no permitido. Solo PNG, WEBP y JPG"]);
        exit;
    }

    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "La imagen es demasiado grande"]);
        exit;
    }

    if (!function_exists('imagewebp')) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "El servidor no soporta WebP"]);
        exit;
    }
    
    $upload_dir = "uploads/home_images/";
    if (!file_exists($upload_dir))
        mkdir($upload_dir, 0777, true);
    
    $unique_name = uniqid() . '_' . time() . '.webp';
    $file_path = $upload_dir . $unique_name;
    
    $query = $data_base->prepare("
        SELECT home 
        FROM ecommerces e
        JOIN usuarios u ON e.id_usuario = u.id_usuario
        WHERE u.nombre_usuario = ?
    ");
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result()->fetch_assoc();
    $current_home = $result['home'] ?? null;

    if (processImage($file['tmp_name'], $file_path, 1024)) {
        $query_update = $data_base->prepare("
            UPDATE ecommerces e
            JOIN usuarios u ON e.id_usuario = u.id_usuario
            SET e.home = ?
            WHERE u.nombre_usuario = ?
        ");
        $query_update->bind_param("ss", $file_path, $username);

        if ($query_update->execute()) {
            if ($current_home && file_exists($current_home)) {
                unlink($current_home);
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Imagen de home procesada y guardada exitosamente",
                "home" => $file_path,
                "format" => "webp"
            ]);
            exit;
        } else {
            unlink($file_path); 
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error al actualizar la base de datos"]);
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al procesar la imagen"]);
        exit;
    }

} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No se recibió usuario o archivo"]);
}
