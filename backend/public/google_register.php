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
    $accountType = $data['accountType'];
    $ecommerceName = $data['ecommerceName'] ?? null;
    
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
        $nombre = $payload['name'] ?? '';
        
        $username = explode('@', $email)[0];
        $original_username = $username;
        
        $stmt = $data_base->prepare("SELECT * FROM usuarios WHERE email = ? OR google_id = ?");
        $stmt->bind_param('ss', $email, $google_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->fetch_assoc()) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'El email ya está registrado',
                'original_username' => $original_username,
                'email' => $email
            ]);
            exit;
        }
        
        $counter = 1;
        while (true) {
            $stmt = $data_base->prepare("SELECT * FROM usuarios WHERE nombre_usuario = ?");
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if (!$result->fetch_assoc()) {
                break;
            }
            $username = $original_username . $counter;
            $counter++;
        }
        
        $tipo_usuario = match($accountType) {
            'Cliente' => 'cliente',
            'Vendedor' => 'vendedor_particular',
            'e-commerce(tienda)' => 'ecommerce',
            default => 'cliente'
        };
        
        $stmt = $data_base->prepare("
            INSERT INTO usuarios (nombre_usuario, email, contraseña, tipo_usuario, google_id) 
            VALUES (?, ?, NULL, ?, ?)
        ");
        $stmt->bind_param('ssss', $username, $email, $tipo_usuario, $google_id);
        $stmt->execute();
        $userId = $data_base->insert_id;
        
        if ($tipo_usuario === 'ecommerce' && $ecommerceName) {
            $stmt = $data_base->prepare("SELECT * FROM ecommerces WHERE nombre_ecommerce = ?");
            $stmt->bind_param('s', $ecommerceName);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->fetch_assoc()) {
                $stmt = $data_base->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
                $stmt->bind_param('i', $userId);
                $stmt->execute();
                
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'El nombre del e-commerce ya existe']);
                exit;
            }
            
            $stmt = $data_base->prepare("
                INSERT INTO ecommerces (id_usuario, nombre_ecommerce) 
                VALUES (?, ?)
            ");
            $stmt->bind_param('is', $userId, $ecommerceName);
            $stmt->execute();
        }
        
        $secret_key = "LA_CACHIMBA_AMA";
        $issued_at = time();
        $expiration_time = $issued_at + 8000;
        
        $payload = [
            "iss" => "http://tu-dominio.com",
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "id_usuario" => $userId,
            "user" => $username,
            "user_type" => $tipo_usuario
        ];
        
        $token = \Firebase\JWT\JWT::encode($payload, $secret_key, 'HS256');
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Cuenta creada con éxito',
            'token' => $token,
            'expiration' => $expiration_time,
            'user_type' => $tipo_usuario,
            'id_usuario' => $userId,
            'original_username' => $original_username,
            'final_username' => $username
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

$data_base->close();