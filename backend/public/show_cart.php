<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");
if ($data_base) {
    $body = json_decode(file_get_contents(("php://input")), true);
    $query = $data_base->prepare("SELECT u.id_usuario FROM usuarios u WHERE u.nombre_usuario = ?");
    $query->bind_param("s", $body["client"]);
    if ($query->execute()) {
        $id_client = $query->get_result()->fetch_assoc();
        $query = $data_base->prepare(
            "SELECT c.estado, c.id_compra, COALESCE(e.nombre_ecommerce, u.nombre_usuario) AS vendedor, e.logo, d.cantidad, d.precio_unitario, p.stock, p.id_producto, p.nombre_producto, p.envio_gratis, ca.nombre_categoria,
               (SELECT i.ruta_imagen
                FROM imagenes_productos i
                WHERE i.id_producto = p.id_producto 
                LIMIT 1) AS ruta_imagen
                FROM compras c
                JOIN detalles_compras d ON d.id_compra = c.id_compra
                JOIN productos p ON p.id_producto = d.id_producto
                LEFT JOIN ecommerces e ON e.id_usuario = p.id_vendedor
                JOIN usuarios u ON u.id_usuario = p.id_vendedor
                JOIN productos_categorias pd ON pd.id_producto = p.id_producto
                JOIN categorias ca on ca.id_categoria = pd.id_categoria
                WHERE c.id_cliente = ?
            "
        );
        $query->bind_param("i", $id_client["id_usuario"]);
        if ($query->execute()) {
            $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $result
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Error"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Error"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}
?>