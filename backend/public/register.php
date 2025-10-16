<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
$secret_key = "LA_CACHIMBA_AMA";
$issued_at = time();
$expiration_time = $issued_at + 8000;

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base) {
   $body = json_decode(file_get_contents('php://input'), true);
   if ($body) {
      $username = $body["user"];
      $email = $body["email"];
      $password_hash = password_hash($body["password"], PASSWORD_DEFAULT);
      switch ($body["select"]) {
         case "e-commerce(tienda)":
            $user_type = "ecommerce";
            break;
         case "Cliente":
            $user_type = "cliente";
            break;
         case "Vendedor":
            $user_type = "vendedor_particular";
            break;
      }
      $query = $data_base->prepare("INSERT INTO usuarios(nombre_usuario, email, contraseña, tipo_usuario) VALUES(?, ?, ?, ?)");
      $query->bind_param("ssss", $username, $email, $password_hash, $user_type);
      if (!$query->execute()) {
         http_response_code(400);
         echo json_encode([
            "success" => false,
            "message" => "Este usuario ya existe"
         ]);
         exit;
      }
      
      // Obtenemos el ID del usuario recién creado
      $user_id = $data_base->insert_id;
      
      if ($user_type == "ecommerce") {
         $ecommerce_name = $body["nameEcommerce"];
         $query = $data_base->prepare("INSERT INTO ecommerces(id_usuario, nombre_ecommerce) VALUES(?, ?)");
         $query->bind_param("is", $user_id, $ecommerce_name);
         if ($query->execute()) {
            // Creamos el payload con todos los datos como en el login
            $payload = [
               "iss" => "http://tu-dominio.com",
               "iat" => $issued_at,
               "exp" => $expiration_time,
               "id_usuario" => $user_id,
               "user" => $username,
               "user_type" => $user_type
            ];
            
            $jwt = JWT::encode($payload, $secret_key, 'HS256');
            
            http_response_code(200);
            echo json_encode([
               "success" => true,
               "message" => 'Cuenta creada con éxito',
               "token" => $jwt,
               "expiration" => $expiration_time,
               "user_type" => $user_type,
               "id_usuario" => $user_id
            ]);
            exit;
         } else {
            http_response_code(400);
            echo json_encode([
               "success" => false,
               "message" => "Ese e-commerce ya existe"
            ]);
            exit;
         }
      } else {
         // Para usuarios que no son e-commerce, también incluimos todos los datos
         $payload = [
            "iss" => "http://tu-dominio.com",
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "id_usuario" => $user_id,   
            "user" => $username,
            "user_type" => $user_type      
         ];
         
         $jwt = JWT::encode($payload, $secret_key, 'HS256');
         
         http_response_code(200);
         echo json_encode([
            "success" => true,
            "message" => 'Cuenta creada con éxito',
            "token" => $jwt,
            "expiration" => $expiration_time,   
            "user_type" => $user_type,           
            "id_usuario" => $user_id            
         ]);
      }
      $query->close();
      $data_base->close();
      exit;
   } else {
      http_response_code(400);
      echo json_encode([
         'success' => false,
         "message" => "ERROR, Vuelve a intentarlo"
      ]);
      exit;
   }
} else {
   http_response_code(400);
   echo json_encode([
      "success" => false,
      "message" => "ERROR, Vuelve a intentarlo"

   ]);
   exit;
}

?>