<?php
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
    $body = json_decode(file_get_contents("php://input"), true);
    $timeRange = $body['timeRange'] ?? '1semana';
    $userId = $body['userId'];

    if (empty($userId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Falta el ID de usuario."]);
        exit;
    }

    $dateCondition = "";

    switch ($timeRange) {
        case '1dia':
            $dateCondition = "AND DATE(fecha_compra) = CURDATE()";
            break;
        case '1semana':
            $dateCondition = "AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            break;
        case '1mes':
            $dateCondition = "AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            break;
        case '5meses':
            $dateCondition = "AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 5 MONTH)";
            break;
        case '1año':
            $dateCondition = "AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            break;
        default:
            $dateCondition = "AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    }

    $query = $data_base->prepare(
        "SELECT 
        DATE(fecha_compra) AS date, 
        SUM(total) AS total, 
        SUM(comision_plataforma) AS comision
        FROM compras c
        JOIN ecommerces e ON e.id_ecommerce = c.id_ecommerce
        WHERE e.id_usuario = ? 
        $dateCondition
        GROUP BY
        DATE(fecha_compra)
        ORDER BY date ASC
        "
    );

    $query->bind_param("i", $userId);

    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "ERROR al obtener las ganancias"
        ]);
    } else {
        $result = $query->get_result();
        $earnings = [];

        while ($row = $result->fetch_assoc()) {
            $earnings[] = [
                'date' => $row['date'],
                'total' => (float)$row['total'] - (float)$row['comision']
            ];
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $earnings
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "ERROR de conexión"
    ]);
}
