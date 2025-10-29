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
    $data = json_decode(file_get_contents("php://input"), true);
    $timeRange = $data['timeRange'];

    $dateCondition = "";

    switch ($timeRange) {
        case '1dia':
            $dateCondition = "WHERE DATE(fecha_compra) = CURDATE()";
            break;
        case '1semana':
            $dateCondition = "WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            break;
        case '1mes':
            $dateCondition = "WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            break;
        case '5meses':
            $dateCondition = "WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL 5 MONTH)";
            break;
        case '1año':
            $dateCondition = "WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            break;
        default:
            $dateCondition = "WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    }

    $query = $data_base->prepare(
        "SELECT DATE(fecha_compra) AS date, 
        SUM(comision_plataforma) AS total 
        FROM compras 
        $dateCondition 
        GROUP BY DATE(fecha_compra) 
        ORDER BY date ASC"
    );

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
                'total' => (float)$row['total']
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
?>