<?php
$host = "localhost";
$user = "root";        // Usuario MySQL
$password = "";        // Contraseña MySQL
$dbname = "tolo";      // Base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

// Leer el id_usuario (ej: notifications.php?id_usuario=1)
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario === 0) {
    echo json_encode(["error" => "Falta el parámetro id_usuario"]);
    exit;
}

// Traer notificaciones del usuario
$sql = "SELECT id_notificacion, mensaje, estado, tipo, fecha_envio
        FROM notificaciones 
        WHERE id_usuario = $id_usuario 
        ORDER BY fecha_envio DESC";

$result = $conn->query($sql);

$notificaciones = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $notificaciones[] = $row;
    }
}

// Devolver JSON
header('Content-Type: application/json');
echo json_encode($notificaciones);

$conn->close();
?>
