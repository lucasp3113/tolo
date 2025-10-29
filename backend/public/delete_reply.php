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

if ($data_base->connect_error) {     
    http_response_code(500);     
    echo json_encode([         
        "success" => false,         
        "message" => "Error de conexión a la base de datos"     
    ]);     
    exit; 
}  

$body = json_decode(file_get_contents("php://input"), true);  

$query = $data_base->prepare("DELETE FROM respuestas_comentario WHERE id_respuesta = ?"); 
$query->bind_param("i", $body["replyId"]); 

if ($query->execute()) {     
    http_response_code(200);     
    echo json_encode([         
        "success" => true     
    ]); 
} else {     
    http_response_code(400);     
    echo json_encode([         
        "success" => false     
    ]);     
    exit; 
}
