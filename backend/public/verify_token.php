<?php
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$secret_key = "LA_CACHIMBA_AMA";
$token = $_GET['token'] ?? null;

if (!$token) {
   http_response_code(400);
   echo json_encode(["valid" => false, "message" => "Token no enviado"]);
   exit;
}

try {
   $decoded = JWT::decode($token, new Key($secret_key, "HS256"));
   echo json_encode([
      "valid" => true,
      "user" => $decoded->user,
      "id_usuario"=> $decoded->id_usuario,
      "user_type" => $decoded->user_type 
   ]);
} catch (Exception $e) {
   http_response_code(400);
   echo json_encode(["valid" => false, "message" => "Token inválido o expirado"]);
}
?>
