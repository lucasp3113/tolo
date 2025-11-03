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
    $data = json_decode(file_get_contents("php://input"), true);
    $timeRange = $data['timeRange'] ?? '1semana';
    $userId = $data['userId'] ?? null;
    $body = $data;

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
        COUNT(*) AS count 
        FROM compras c
        JOIN ecommerces e ON e.id_ecommerce = c.id_ecommerce
        WHERE e.id_usuario = ?
        $dateCondition
        GROUP BY DATE(fecha_compra) 
        ORDER BY date ASC"
    );

    $query->bind_param("i", $body["userId"]);

    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            "message" => "ERROR al obtener las visitas"
        ]);
    } else {
        $result = $query->get_result();
        $sales = [];

        while ($row = $result->fetch_assoc()) {
            $sales[] = [
                'date' => $row['date'],
                'count' => (int)$row['count']
            ];
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $sales
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        "message" => "ERROR de conexión"
    ]);
}
