<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    $body = json_decode(file_get_contents("php://input"), true);
    $id = $body["id"];
    $query = $data_base->prepare("SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = ?");
    $query->bind_param("i", $id);
    if ($query->execute()) {
        $routes = $query->get_result()->fetch_all();
        foreach ($routes as $route) {
            $path = __DIR__  . "/" . $route[0];
            if (file_exists($path)) {
                unlink($path);
            }
        }
        $query = $data_base->prepare("DELETE FROM productos WHERE id_producto = ?");
        $query->bind_param("i", $id);
        if ($query->execute()) {
            http_response_code(200);
            echo json_encode([
                "success"=> true,
                "message"=> "GOOOD"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error, vuelve a intentarlo"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error, se eliminó la ruta de la base de datos, pero no de la carpeta upload"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos"
    ]);
    exit;
}
?>