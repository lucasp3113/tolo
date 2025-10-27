<?php
require __DIR__ . '/vendor/autoload.php';

use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;

mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

if ($data_base->connect_error) {
    error_log('Error de conexión BD');
    http_response_code(500);
    exit;
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

error_log('Webhook recibido: ' . $jsonData);

// Validar que sea un webhook válido
if (!isset($data['type']) || !isset($data['data']['id'])) {
    error_log('Webhook inválido');
    http_response_code(400);
    exit;
}

if ($data['type'] === 'payment') {
    $paymentId = $data['data']['id'];
    
    try {
        MercadoPagoConfig::setAccessToken('TEST-6074791770160221-100820-928d1d3d19380e0796cae21f1f748590-2914640071');
        $client = new PaymentClient();
        $payment = $client->get($paymentId);
        
        error_log('Estado del pago: ' . $payment->status);
        
        $estadoMap = [
            'approved' => 'completado',
            'pending' => 'pendiente',
            'rejected' => 'fallido',
            'cancelled' => 'cancelado',
            'in_process' => 'pendiente'
        ];
        
        $nuevoEstado = $estadoMap[$payment->status] ?? 'pendiente';
        
        $query = $data_base->prepare("
            UPDATE pagos 
            SET estado_pago = ?, fecha_actualizacion = NOW()
            WHERE mercadopago_payment_id = ?
        ");
        $query->bind_param("ss", $nuevoEstado, $paymentId);
        
        if (!$query->execute()) {
            error_log('Error actualizando pago: ' . $query->error);
        } else {
            error_log('Pago actualizado correctamente');
        }
        
        $query_pago = $data_base->prepare("
            SELECT p.id_compra, p.monto, c.id_cliente 
            FROM pagos p
            INNER JOIN compras c ON p.id_compra = c.id_compra
            WHERE p.mercadopago_payment_id = ?
        ");
        $query_pago->bind_param("s", $paymentId);
        $query_pago->execute();
        $result = $query_pago->get_result()->fetch_assoc();
        
        if ($result) {
            $id_usuario = $result['id_cliente'];
            $monto = $result['monto'];
            $id_compra = $result['id_compra'];
            
            if ($nuevoEstado === 'completado') {
                $query_carrito = $data_base->prepare("DELETE FROM carrito WHERE id_compra = ?");
                $query_carrito->bind_param("i", $id_compra);
                $query_carrito->execute();
                error_log('🗑️ Carrito limpiado por webhook');
                
                $mensaje_notif = "¡Tu pago de $" . $monto . " fue aprobado!";
                $tipo_notif = "pago_aprobado";
            } else if ($nuevoEstado === 'fallido') {
                $mensaje_notif = "Tu pago de $" . $monto . " fue rechazado";
                $tipo_notif = "pago_rechazado";
            } else {
                $mensaje_notif = "Tu pago de $" . $monto . " cambió a estado: " . $nuevoEstado;
                $tipo_notif = "pago_actualizado";
            }
            
            $query_notif = $data_base->prepare("
                INSERT INTO notificaciones (id_usuario, mensaje, tipo) 
                VALUES (?, ?, ?)
            ");
            $query_notif->bind_param("iss", $id_usuario, $mensaje_notif, $tipo_notif);
            
            if ($query_notif->execute()) {
                error_log('Notificación creada');
            } else {
                error_log('Error creando notificación: ' . $query_notif->error);
            }
        } else {
            error_log('No se encontró el pago en la BD');
        }
        
    } catch (Exception $e) {
        error_log('Error procesando webhook: ' . $e->getMessage());
        http_response_code(500);
        exit;
    }
}

http_response_code(200);
echo json_encode(['success' => true]);

$data_base->close();