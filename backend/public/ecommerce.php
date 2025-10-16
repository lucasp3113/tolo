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

if ($data_base) {
    $user = json_decode(file_get_contents("php://input"), true);

    $query = $data_base->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
    $query->bind_param("s", $user["usuario"]);

    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            "message" => "ERROR en la consulta, vuelve a intentarlo"
        ]);
    } else {
        $id_usuario = $query->get_result()->fetch_assoc()["id_usuario"];

        $query = $data_base->prepare("SELECT nombre_ecommerce, rango_actual, facturacion_acumulada FROM ecommerces WHERE id_usuario = ?");
        $query->bind_param("i", $id_usuario);

        if (!$query->execute()) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                "message" => "ERROR en la consulta, vuelve a intentarlo"
            ]);
        } else {
            $result = $query->get_result()->fetch_assoc();
            $current_range = $result["rango_actual"];

            $response = [
                'success' => true,
                'ecommerce_name' => $result["nombre_ecommerce"],
                'cumulative_billing' => $result["facturacion_acumulada"]
            ];

            $query = $data_base->prepare("SELECT nombre_rango, porcentaje_comision FROM rangos WHERE id_rango = ?");
            $query->bind_param("i", $current_range);

            if (!$query->execute()) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    "message" => "ERROR en la consulta, vuelve a intentarlo"
                ]);
            } else {
                $result = $query->get_result()->fetch_assoc();

                $ecommerce_data = [
                    "name_range" => $result["nombre_rango"],
                    "commission_percentage" => (float) $result["porcentaje_comision"]
                ];

                $query = $data_base->prepare("SELECT facturacion_minima, nombre_rango, porcentaje_comision FROM rangos WHERE id_rango = ?");
                $next_range = $current_range + 1;
                $query->bind_param("i", $next_range);
                if (!$query->execute()) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        "message" => "ERROR, Vuelve a intentarlo"
                    ]);
                } else {
                    $result = $query->get_result()->fetch_assoc();
                    $next_range_data = [
                        "minimum_billing"=> $result["facturacion_minima"],
                        "next_range"=> $result["nombre_rango"],
                        "next_percentage"=> (float)$result["porcentaje_comision"]
                    ];
                    $response = array_merge($response, $ecommerce_data, $next_range_data);
                    http_response_code(200);
                    echo json_encode($response);
                }
            }
        }
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        "message" => "ERROR, Vuelve a intentarlo"
    ]);
}
?>