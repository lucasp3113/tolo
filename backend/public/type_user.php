<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");

if ($data_base) {
    $user = json_decode(file_get_contents("php://input"), true)["usuario"];
    $query = $data_base->prepare("SELECT tipo_usuario FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $user);
    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
        "succes"=> false,
        "message"=> "ERROR, vuelve a intentarlo"
    ]);
    exit;
    } else {
        $user_type = $query->get_result()->fetch_assoc()["tipo_usuario"];
        http_response_code(200);
        echo json_encode([
            "success"=> true,
            "user_type"=> $user_type
        ]);
        exit;

    }
} else {
    http_response_code(400);
    echo json_encode([
        "succes"=> false,
        "message"=> "ERROR, vuelve a intentarlo"
    ]);
    exit;
}


?>