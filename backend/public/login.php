<?php
// esto es para q php no lance errores automaticamente, entonces los puedo manejar manualmente
mysqli_report(MYSQLI_REPORT_OFF);

require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
$secret_key = "LA_CACHIMBA_AMA";
$issued_at = time();
$expiration_time = $issued_at + 3600;

//Esto indica q este archivo no es una pagina normal, si no q debe tratarse como un json
header('Content-Type: application/json');

//Esto es para q se puedan hacer peticiones a este archivo desde cualquier dominio o puerto SACAR EN PRODUCCION
header("Access-Control-Allow-Origin: *");

//Instancio un objeto de la clase mysqli, logrando una conexion con la base de datos
$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    //json_decode se utiliza para transformar json en un array de php. Y file_get_contents("php://input) se utiliza para obtener el cuerpo de la peticion de la fomra más cruda posible
    $body = json_decode(file_get_contents("php://input"), true);
    $user = $body["user"];
    // hasheo de la contraseña para q sea segura
    $password = $body["password"];

    /*Arma una consulta sql, pero no completa, si no q crea marcadores de posicion(Los ?). Y luego hay q rellenar esos lugares. Esto se hace asi, para q no se puedan hacer inyecciones sql
     */
    $query = $data_base->prepare("SELECT nombre_usuario, contraseña FROM usuarios WHERE nombre_usuario = ? ");

    //Completa los marcadores de posición(?) en orden de las varibles que se le pase como parametro  a bind_param. El primer parametro indica de que tipo de variable(String, int), son los datos q se pasas, en orden.
    $query->bind_param("s", $user);

    //Ejecutamos la constulta sql
    $query->execute();

    // Si hay un error en la consulta sql:
    if ($query->error) {
        //Genera un codigo http 400
        http_response_code(400);
        //Y manda los siguientes datos al frontend:
        echo json_encode([
            "success" => false,
            "message" => "ERROR, Vuelve a intentarlo"
        ]);
        //corta la ejecucion del código
        exit;
    } else {
        //guarda el resultado de la consulta sql
        $result = $query->get_result();

        //si el resultado de la consulta sql, no tiene filas, es decir no encontró ningun usuario
        if ($result->num_rows === 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Usuario incorrecto",
                "input" => "user"
            ]);
        } else {
            //si no(si encontró un usuario), compara la contraseña de la base de datos con la contraseña que ingresó el usuario:
            if (password_verify($password, $result->fetch_assoc()["contraseña"])) {
                $payload = [
                    "iss" => "http://tu-dominio.com", // issuer: quién emite el token
                    "iat" => $issued_at,               // issued at: cuándo se emitió
                    "exp" => $expiration_time,        // expiration time: cuándo expira
                    "user" => $user                   // datos que quieras incluir
                ];
                // Generamos el token firmado con HS256 y la clave secreta
                $jwt = JWT::encode($payload, $secret_key, 'HS256');

                //le dice al fornt q ta todo bien muchacho
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Logeado con éxito",
                    "token"=> $jwt
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Contraseña incorrecta",
                    "input" => "password"
                ]);
            }

        }
        ;
    }


} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ERROR, Vuelve a intentarlo"
    ]);
}



?>