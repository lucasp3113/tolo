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

$data_base = new mysqli("localhost", "root", "", "tolo");

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
      if ($user_type == "ecommerce") {
         $user_id = $data_base->insert_id;
         $ecommerce_name = $body["nameEcommerce"];
         $query = $data_base->prepare("INSERT INTO ecommerces(id_usuario, nombre_ecommerce) VALUES(?, ?)");
         $query->bind_param("is", $user_id, $ecommerce_name);
         if ($query->execute()) {
            http_response_code(200);
            echo json_encode([
               "success" => true,
               "message" => 'Cuenta creada con éxito'
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
         $payload = [
            "iss" => "http://tu-dominio.com", // issuer: quién emite el token
            "iat" => $issued_at,               // issued at: cuándo se emitió
            "exp" => $expiration_time,        // expiration time: cuándo expira
            "user" => $username                   // datos que quieras incluir
         ];
         // Generamos el token firmado con HS256 y la clave secreta
         $jwt = JWT::encode($payload, $secret_key, 'HS256');
         http_response_code(200);
         echo json_encode([
            "success" => true,
            "message" => 'Cuenta creada con éxito',
            "token"=> $jwt
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