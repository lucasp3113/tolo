<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar función para enviar mails
require __DIR__ . '/../utils/send_mails.php';

// Cargar configuración DB (ajustá la ruta y archivo según tu proyecto)
$config = require __DIR__ . '/../config.php';

// Crear conexión a la base de datos
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al conectar con la base de datos"]);
    exit;
}

// Leer datos del frontend
$body = json_decode(file_get_contents("php://input"), true);
$userEmail = $body["email"] ?? null;

if (!$userEmail) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta el email"]);
    exit;
}

// Validar que el email exista en la base de datos
$stmt = $data_base->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count == 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El email que ingresó no es el correcto"]);
    exit;
}

// Generar código
$verificationCode = strval(rand(100000, 999999));

// Guardar código en sesión con clave única por usuario
$key = "verification_code_$userEmail";
$_SESSION[$key] = [
    "code" => $verificationCode,
    "expires" => time() + 300 // 5 minutos de validez
];

error_log("Código guardado para $userEmail: $verificationCode");

// Enviar correo con el código
$sent = sendMail(
    $userEmail,
    "Código de verificación",
    "Tu código de verificación es: <b>$verificationCode</b>"
);

// Responder según resultado del envío
if ($sent) {
    echo json_encode(["success" => true, "message" => "Código enviado a $userEmail"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "No se pudo enviar el mail"]);
}
