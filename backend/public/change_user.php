<?php
mysqli_report(MYSQLI_REPORT_OFF);
header(header: 'Content-Type: application/json');
header(header: "Access-Control-Allow-Origin: *");
$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);
if ($data_base) {
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare("SELECT contraseña FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $body["userCurrent"]);
    if ($query->execute()) {
        $result = $query->get_result()->fetch_assoc();
        if (password_verify($body["passwordCurrent"], $result["contraseña"])) {
            $query = $data_base->prepare("UPDATE usuarios SET nombre_usuario = ? WHERE nombre_usuario = ?");
            $query->bind_param("ss", $body["userNew"], $body["userCurrent"]);
            if ($query->execute()) {
                http_response_code(200);
                echo json_encode([
                    "success" => true
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message"=> "Error al actualizar"
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Contraseña incorrecta"
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error con la conexion a la base de datos"
    ]);
    exit;
}
?>