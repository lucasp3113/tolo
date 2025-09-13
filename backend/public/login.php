<?php
mysqli_report(MYSQLI_REPORT_OFF);
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);

require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
$secret_key = "LA_CACHIMBA_AMA";
$issued_at = time();
$expiration_time = $issued_at + 8000;

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    $body = json_decode(file_get_contents("php://input"), true);
    $user = $body["user"];
    $password = $body["password"];

    $query = $data_base->prepare("SELECT id_usuario, nombre_usuario, contraseña, tipo_usuario FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $user);
    $query->execute();

    if ($query->error) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "ERROR, Vuelve a intentarlo"
        ]);
        exit;
    } else {
        $result = $query->get_result();
        if ($result->num_rows === 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Usuario incorrecto",
                "input" => "user"
            ]);
        } else {
            $array_result = $result->fetch_assoc();
            $user_type = $array_result["tipo_usuario"];
            if (password_verify($password, $array_result["contraseña"])) {
                $payload = [
                    "iss" => "http://tu-dominio.com",
                    "iat" => $issued_at,
                    "exp" => $expiration_time,
                    "user" => $user,
                    "id_usuario" => $array_result['id_usuario'],
                    "user_type" => $user_type
                ];
                $jwt = JWT::encode($payload, $secret_key, 'HS256');

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Logeado con éxito",
                    "token" => $jwt,
                    "expiration" => $expiration_time,
                    "user_type" => $user_type
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Contraseña incorrecta",
                    "input" => "password"
                ]);
            }
        }
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ERROR, Vuelve a intentarlo"
    ]);
}
?>