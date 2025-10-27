import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function PaymentsHistory() {
    const [payments, setPayments] = useState([]);
    const {ecommerce} = useParams()
    const [loading, setLoading] = useState(true);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.id_usuario;
    }

    useEffect(() => {
        if (!user) return;

        fetch('/api/show_payments.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_usuario: user,
                nombre_ecommerce: ecommerce || null
            })
        })
            .then(res => res.json())
            .then(data => {
                setPayments(data.data);
                setLoading(false);
                console.log(data)
            })
            .catch(err => {
                console.error('Error al cargar pagos:', err);
                setLoading(false);
            });
    }, [ecommerce]);

    const getStatusColor = (estado) => {
        const colors = {
            'aprobado': 'bg-green-100 text-green-800',
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'rechazado': 'bg-red-100 text-red-800',
            'cancelado': 'bg-gray-100 text-gray-800'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (estado) => {
        const texts = {
            'aprobado': 'Aprobado',
            'pendiente': 'Pendiente',
            'rechazado': 'Rechazado',
            'cancelado': 'Cancelado'
        };
        return texts[estado] || estado;
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            'abitab': 'Abitab',
            'redpagos': 'Redpagos',
            'visa': 'Visa',
            'master': 'Mastercard',
            'oca': 'OCA',
            'account_money': 'Cuenta MercadoPago'
        };
        return methods[method] || method;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (selectedPaymentId) {
        return <PaymentStatus key={selectedPaymentId} paymentId={selectedPaymentId} onBack={() => setSelectedPaymentId(null)} />;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mb-24">
            <h1 className="font-quicksand font-bold text-4xl mb-8 text-center">
                Historial de pagos{ecommerce ? ` - ${ecommerce}` : ''}
            </h1>

            {payments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-xl font-quicksand">
                        No tienes pagos registrados{ecommerce ? ` en ${ecommerce}` : ''}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {payments.map(payment => (
                        <div
                            key={payment.id_pago}
                            onClick={() => setSelectedPaymentId(payment.mercadopago_payment_id)}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-quicksand text-sm text-gray-500">
                                        Pago #{payment.id_pago}
                                    </p>
                                    <p className="font-quicksand font-semibold text-2xl mt-1">
                                        ${payment.monto}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-quicksand font-semibold ${getStatusColor(payment.estado_pago)}`}>
                                    {getStatusText(payment.estado_pago)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-quicksand">Método de pago</p>
                                    <p className="font-quicksand font-medium mt-1">
                                        {getPaymentMethodText(payment.payment_method_id)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-quicksand">Fecha</p>
                                    <p className="font-quicksand font-medium mt-1">
                                        {new Date(payment.fecha_creacion).toLocaleDateString('es-UY', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-blue-600 font-quicksand font-semibold text-sm">
                                    Click para ver detalles →
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PaymentStatus({ paymentId, onBack }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerIdRef = useRef(`statusScreen_${Date.now()}_${Math.random()}`);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!paymentId || hasInitialized.current) return;

        const containerId = containerIdRef.current;
        
        const timer = setTimeout(() => {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (!window.MercadoPago) {
                setError('MercadoPago SDK no está cargado');
                setLoading(false);
                return;
            }

            hasInitialized.current = true;

            const initStatusScreen = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const mp = new window.MercadoPago('TEST-32a1b4af-2f2e-4814-9f12-1eddd0a45481', {
                        locale: 'es-UY'
                    });

                    const bricksBuilder = mp.bricks();

                    const settings = {
                        initialization: {
                            paymentId: paymentId
                        },
                        customization: {
                            visual: {
                                hideStatusDetails: false,
                                hideTransactionDate: false,
                                style: {
                                    theme: 'default'
                                }
                            },
                            backUrls: {
                                'return': window.location.href
                            }
                        },
                        callbacks: {
                            onReady: () => {
                                setLoading(false);
                            },
                            onError: (error) => {
                                console.error('Error en Status Screen:', error);
                                setError('Error al cargar estado del pago');
                                setLoading(false);
                            }
                        }
                    };

                    await bricksBuilder.create('statusScreen', containerId, settings);

                } catch (err) {
                    console.error('Error al inicializar Status Screen:', err);
                    setError('Error al mostrar estado');
                    setLoading(false);
                }
            };

            initStatusScreen();
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [paymentId]);

    return (
        <div className="max-w-3xl font-quicksand mx-auto p-6">
            <button
                onClick={onBack}
                className="mb-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-quicksand font-semibold transition-colors"
            >
                ← Volver al historial
            </button>

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="font-quicksand text-gray-600">Cargando estado del pago...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-800 font-quicksand font-semibold">{error}</p>
                </div>
            )}

            <div id={containerIdRef.current} className="w-full"></div>
        </div>
    );
}

export default PaymentsHistory;