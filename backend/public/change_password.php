<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    $body = json_decode(file_get_contents("php://input"), true);
    $data = $body["data"];
    $user = $body["user"];
    $query = $data_base->prepare("SELECT contraseña FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $user);
    if ($query->execute()) {
        $password = $query->get_result()->fetch_assoc();
        if (password_verify($data["passwordCurrent"], $password["contraseña"])) {
            $password_now_hash = password_hash($data["passwordNow"], PASSWORD_DEFAULT);
            $query = $data_base->prepare("UPDATE usuarios SET contraseña = ? WHERE nombre_usuario = ?");
            $query->bind_param("ss", $password_now_hash, $user);
            if($query->execute()) {
                echo http_response_code(200);
                json_encode([
                    "success"=> true,
                    "message"=> "GOOOD"
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Contraseña incorrecta"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error"
        ]);
        exit;
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