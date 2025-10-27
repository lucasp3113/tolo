<?php
require_once '../vendor/autoload.php';
require_once '../config.php';

use League\OAuth2\Client\Provider\Google;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $credential = $data['credential'];
    
    try {
        $parts = explode('.', $credential);
        if (count($parts) !== 3) {
            throw new Exception('Token inválido');
        }
        
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        
        if (!$payload) {
            throw new Exception('No se pudo decodificar el token');
        }
        
        if ($payload['aud'] !== '611656355931-jtjpo3d30ueql5p97bc6n43l1m3578ob.apps.googleusercontent.com') {
            throw new Exception('Token no corresponde a esta aplicación');
        }
        
        if ($payload['exp'] < time()) {
            throw new Exception('Token expirado');
        }
        
        $email = $payload['email'];
        $google_id = $payload['sub'];
        
        $stmt = $data_base->prepare("SELECT id_usuario, nombre_usuario, tipo_usuario FROM usuarios WHERE email = ? OR google_id = ?");
        $stmt->bind_param('ss', $email, $google_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if (!$user) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No tenés cuenta. Registrate primero.']);
            exit;
        }
        
        $secret_key = "LA_CACHIMBA_AMA";
        $issued_at = time();
        $expiration_time = $issued_at + 8000;
        
        $payload = [
            "iss" => "http://tu-dominio.com",
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "id_usuario" => $user['id_usuario'],
            "user" => $user['nombre_usuario'],
            "user_type" => $user['tipo_usuario']
        ];
        
        $token = \Firebase\JWT\JWT::encode($payload, $secret_key, 'HS256');
        
        echo json_encode([
            'success' => true,
            'message' => 'Logeado con éxito',
            'token' => $token,
            'expiration' => $expiration_time,
            'user_type' => $user['tipo_usuario']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

$data_base->close();
