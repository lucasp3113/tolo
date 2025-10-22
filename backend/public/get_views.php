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
            $dateCondition = "WHERE DATE(fecha) = CURDATE()";
            break;
        case '1semana':
            $dateCondition = "WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            break;
        case '1mes':
            $dateCondition = "WHERE fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            break;
        case '5meses':
            $dateCondition = "WHERE fecha >= DATE_SUB(NOW(), INTERVAL 5 MONTH)";
            break;
        case '1año':
            $dateCondition = "WHERE fecha >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            break;
        default:
            $dateCondition = "WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    }

    $query = $data_base->prepare(
        "SELECT DATE(fecha) AS date, 
    COUNT(*) AS count FROM visitas $dateCondition 
    GROUP BY DATE(fecha) ORDER BY date ASC"
    );

    if (!$query->execute()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            "message" => "ERROR al obtener las visitas"
        ]);
    } else {
        $result = $query->get_result();
        $visits = [];

        while ($row = $result->fetch_assoc()) {
            $visits[] = [
                'date' => $row['date'],
                'count' => (int)$row['count']
            ];
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $visits
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        "message" => "ERROR de conexión"
    ]);
}
