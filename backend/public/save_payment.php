<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true);

error_log('Guardando pago en BD: ' . json_encode($body));

$estadoMap = [
    'approved' => 'aprobado',
    'pending' => 'pendiente',
    'rejected' => 'rechazado',
    'cancelled' => 'cancelado',
    'in_process' => 'pendiente'
];

$estado = isset($estadoMap[$body['status']]) ? $estadoMap[$body['status']] : 'pendiente';

$data_base->begin_transaction();

try {
    $query = $data_base->prepare("
        SELECT c.id_carrito, c.id_usuario, c.id_ecommerce
        FROM carrito c
        WHERE c.id_carrito = ?
    ");
    $query->bind_param("i", $body['id_carrito']);
    $query->execute();
    $carrito = $query->get_result()->fetch_assoc();
    
    if (!$carrito) {
        throw new Exception("Carrito no encontrado");
    }
    
    $query = $data_base->prepare("
        SELECT r.nombre_rango, r.porcentaje_comision
        FROM ecommerces e
        JOIN rangos r ON e.rango_actual = r.id_rango
        WHERE e.id_ecommerce = ?
    ");
    $query->bind_param("i", $carrito['id_ecommerce']);
    $query->execute();
    $ecommerce = $query->get_result()->fetch_assoc();
    
    $query = $data_base->prepare("
        SELECT ic.id_producto, ic.cantidad, ic.precio_unitario
        FROM items_carrito ic
        WHERE ic.id_carrito = ?
    ");
    $query->bind_param("i", $body['id_carrito']);
    $query->execute();
    $items = $query->get_result()->fetch_all(MYSQLI_ASSOC);
    
    $comision_total = 0;
    $items_con_comision = [];
    
    foreach ($items as $item) {
        $precio_producto = $item['precio_unitario'];
        $comision = 0;
        
        if ($precio_producto < 40000) {
            $comision = $precio_producto * ($ecommerce['porcentaje_comision'] / 100);
        } elseif ($precio_producto < 100000) {
            $comisiones_media = [
                'junior' => 3500,
                'amateur' => 2800,
                'semi_senior' => 2100,
                'senior' => 1400,
                'elite' => 1000
            ];
            $comision = $comisiones_media[$ecommerce['nombre_rango']];
        } else {
            $comisiones_alta = [
                'junior' => 5000,
                'amateur' => 4500,
                'semi_senior' => 4000,
                'senior' => 3500,
                'elite' => 2000
            ];
            $comision = $comisiones_alta[$ecommerce['nombre_rango']];
        }
        
        $comision_total += $comision * $item['cantidad'];
        $items_con_comision[] = [
            'id_producto' => $item['id_producto'],
            'cantidad' => $item['cantidad'],
            'precio_unitario' => $item['precio_unitario'],
            'comision' => $comision
        ];
    }
    
    $query = $data_base->prepare("
        INSERT INTO compras (id_cliente, id_ecommerce, total, comision_plataforma, estado)
        VALUES (?, ?, ?, ?, ?)
    ");
    $estado_compra = $estado === 'aprobado' ? 'pagada' : 'pendiente';
    $query->bind_param("iidds", $carrito['id_usuario'], $carrito['id_ecommerce'], $body['amount'], $comision_total, $estado_compra);
    $query->execute();
    $id_compra = $data_base->insert_id;
    
    $query = $data_base->prepare("
        INSERT INTO detalles_compra (id_compra, id_producto, cantidad, precio_unitario, subtotal, comision)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    foreach ($items_con_comision as $item) {
        $subtotal = $item['cantidad'] * $item['precio_unitario'];
        $query->bind_param(
            "iiiddd",
            $id_compra,
            $item['id_producto'],
            $item['cantidad'],
            $item['precio_unitario'],
            $subtotal,
            $item['comision']
        );
        $query->execute();
    }
    
    $query = $data_base->prepare("
        INSERT INTO pagos (
            id_compra,
            mercadopago_payment_id,
            payment_method_id,
            estado_pago,
            monto,
            external_resource_url,
            payment_reference
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $query->bind_param(
        "isssdss",
        $id_compra,
        $body['payment_id'],
        $body['payment_method_id'],
        $estado,
        $body['amount'],
        $body['external_resource_url'],
        $body['payment_reference']
    );
    $query->execute();
    $id_pago = $data_base->insert_id;
    
    $carrito_limpiado = false;
    if ($estado === 'aprobado' || $estado === 'pendiente') {
        $query = $data_base->prepare("DELETE FROM items_carrito WHERE id_carrito = ?");
        $query->bind_param("i", $body['id_carrito']);
        $query->execute();
        
        $query = $data_base->prepare("DELETE FROM carrito WHERE id_carrito = ?");
        $query->bind_param("i", $body['id_carrito']);
        $query->execute();
        
        $carrito_limpiado = true;
        error_log('Carrito limpiado para estado: ' . $estado);
    }
    if ($estado === 'aprobado') {
        $mensaje_notif = "¡Tu pago de $" . $body['amount'] . " fue aprobado!";
        $tipo_notif = "pago_aprobado";
    } else if ($estado === 'pendiente') {
        $mensaje_notif = "Tu pago de $" . $body['amount'] . " está pendiente de confirmación";
        $tipo_notif = "pago_pendiente";
    } else if ($estado === 'rechazado') {
        $mensaje_notif = "Tu pago de $" . $body['amount'] . " fue rechazado. Puedes intentar nuevamente.";
        $tipo_notif = "pago_rechazado";
    } else {
        $mensaje_notif = "Tu pago de $" . $body['amount'] . " fue cancelado";
        $tipo_notif = "pago_cancelado";
    }
    
    $query = $data_base->prepare("
        INSERT INTO notificaciones (id_usuario, mensaje, tipo) 
        VALUES (?, ?, ?)
    ");
    $query->bind_param("iss", $carrito['id_usuario'], $mensaje_notif, $tipo_notif);
    $query->execute();
    
    $data_base->commit();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "id_pago" => $id_pago,
        "id_compra" => $id_compra,
        "estado" => $estado,
        "comision_total" => $comision_total,
        "carrito_limpiado" => $carrito_limpiado
    ]);
    
} catch (Exception $e) {
    $data_base->rollback();
    error_log('Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$data_base->close();