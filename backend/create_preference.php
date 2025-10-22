<?php
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

MercadoPagoConfig::setAccessToken('TEST-6074791770160221-100820-928d1d3d19380e0796cae21f1f748590-2914640071');

$jsonData = file_get_contents('php://input');
$requestData = json_decode($jsonData, true);

try {
    $client = new PreferenceClient();
    
    $preferenceData = [
        "items" => [
            [
                "title" => "Producto de prueba",
                "description" => "Compra en tienda",
                "quantity" => 1,
                "unit_price" => (float)$requestData['amount'],
                "currency_id" => "UYU"
            ]
        ],
        "purpose" => "wallet_purchase"
    ];
    
    $preference = $client->create($preferenceData);
    
    echo json_encode([
        'preference_id' => $preference->id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
