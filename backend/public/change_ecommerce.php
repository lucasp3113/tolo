<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$data_base = new mysqli("localhost", "root", "", "tolo");
if($data_base) {
    $body = json_decode(file_get_contents("php://input"), true);
    $query = $data_base->prepare("SELECT id_usuario, contraseña FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $body["userCurrent"]);
    if($query->execute()) {
        $result = $query->get_result()->fetch_assoc();
        if(password_verify($body["passwordCurrent"], $result["contraseña"])) {
            $query = $data_base->prepare("UPDATE ecommerces SET nombre_ecommerce = ? WHERE id_usuario = ?");
            $query->bind_param("si", $body["ecommerceNew"], $result["id_usuario"]);
            if($query->execute()) {
                http_response_code(200);
                json_encode([
                    "success"=> true
                ]);
            } else {
                http_response_code(400);
            echo json_encode([
                "success"=> false
            ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success"=> false,
                "message"=> "Contraseña incorrecta"
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success"=> false
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success"=> false,
        "message"=> "Error al conectar con la base de datos"
    ]);
}
?>