<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

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
         http_response_code(200);
            echo json_encode([
               "success" => true,
               "message" => 'Cuenta creada con éxito'
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