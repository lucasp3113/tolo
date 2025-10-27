<?php
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;

MercadoPagoConfig::setAccessToken('TEST-6074791770160221-100820-928d1d3d19380e0796cae21f1f748590-2914640071');

$jsonData = file_get_contents('php://input');
$requestData = json_decode($jsonData, true);

error_log('📥 Datos recibidos: ' . $jsonData);

try {
    $client = new PaymentClient();
    
    $paymentData = [
        "transaction_amount" => (float)$requestData['transaction_amount'],
        "payment_method_id" => $requestData['payment_method_id'],
        "payer" => [
            "email" => $requestData['payer']['email']
        ]
    ];
    
    // Si es tarjeta, agregar campos específicos
    if (isset($requestData['token'])) {
        $paymentData['token'] = $requestData['token'];
        $paymentData['installments'] = (int)$requestData['installments'];
        $paymentData['issuer_id'] = $requestData['issuer_id'];
        
        if (isset($requestData['payer']['identification'])) {
            $paymentData['payer']['identification'] = [
                'type' => $requestData['payer']['identification']['type'],
                'number' => $requestData['payer']['identification']['number']
            ];
        }
    }
    
    error_log('📤 Enviando a MercadoPago: ' . json_encode($paymentData));
    
    $payment = $client->create($paymentData);
    
    error_log('✅ Pago creado: ID=' . $payment->id . ', Status=' . $payment->status);
    
    // ✅ DEVOLVER MÁS INFO PARA STATUS SCREEN BRICK
    echo json_encode([
        'id' => $payment->id,
        'status' => $payment->status,
        'status_detail' => $payment->status_detail,
        'payment_method_id' => $payment->payment_method_id,
        'transaction_amount' => $payment->transaction_amount,
        'external_resource_url' => $payment->transaction_details->external_resource_url ?? null, // 🎯 Para tickets
        'payment_method_reference_id' => $payment->transaction_details->payment_method_reference_id ?? null // 🎯 Código de pago
    ]);
    
} catch (Exception $e) {
    error_log('❌ Error procesando pago: ' . $e->getMessage());
    
    $errorResponse = [
        'error' => true,
        'message' => $e->getMessage()
    ];
    
    if (method_exists($e, 'getApiResponse')) {
        $errorResponse['api_response'] = $e->getApiResponse();
    }
    
    http_response_code(500);
    echo json_encode($errorResponse);
}