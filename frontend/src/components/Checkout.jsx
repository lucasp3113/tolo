import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckoutBricks({ total = 1000, onPaymentSuccess, idCompra, data }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brickController, setBrickController] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createPreference = async () => {
      try {
        const response = await fetch("/api/create_preference.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: total }),
        });

        const data = await response.json();

        if (data.preference_id) {
          setPreferenceId(data.preference_id);
          console.log("Preference ID creado:", data.preference_id);
        } else {
          setError("Error al crear la preferencia de pago");
        }
      } catch (err) {
        console.error("Error creando preferencia:", err);
        setError("Error al crear la preferencia: " + err.message);
      }
    };
    console.log("DATA AYUDONA✅:", data)

    createPreference();
  }, [total]);

  useEffect(() => {
    if (!preferenceId) return;

    if (brickController) {
      try {
        brickController.unmount();
      } catch (e) {
        console.log("Error al desmontar brick:", e);
      }
    }

    const container = document.getElementById("paymentBrick_container");
    if (container) {
      container.innerHTML = "";
    }

    if (!window.MercadoPago) {
      setError(
        "MercadoPago SDK no está cargado. Verifica que el script esté en el HTML."
      );
      setLoading(false);
      return;
    }

    const initPaymentBrick = async () => {
      try {
        setLoading(true);
        setError(null);

        const mp = new window.MercadoPago(
          "TEST-32a1b4af-2f2e-4814-9f12-1eddd0a45481",
          {
            locale: "es-UY",
          }
        );

        const bricksBuilder = mp.bricks();

        const settings = {
          initialization: {
            amount: total,
            preferenceId: preferenceId,
            payer: {
              email: "",
            },
          },
          customization: {
            visual: {
              style: {
                theme: "default",
              },
            },
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              bankTransfer: "all",
              mercadoPago: "all",
              maxInstallments: 12,
            },
          },
          callbacks: {
            onReady: () => {
              console.log("Payment Brick está listo");
              setLoading(false);
            },
            onSubmit: ({ selectedPaymentMethod, formData }) => {
              console.log("Método seleccionado:", selectedPaymentMethod);
              console.log("Datos enviados:", formData);

              return new Promise((resolve, reject) => {
                fetch("/api/mercado_pago.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(formData),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Error en la respuesta del servidor");
                    }
                    return response.json();
                  })
                  .then((result) => {
                    console.log("Respuesta del servidor:", result);
                    if (idCompra) {
                      fetch("/api/save_payment.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id_carrito: idCompra,
                          payment_id: result.id,
                          payment_method_id: result.payment_method_id,
                          status: result.status,
                          amount: result.transaction_amount,
                          external_resource_url: result.external_resource_url,
                          payment_reference: result.payment_method_reference_id,
                        }),
                      })
                        .then((res) => res.json())
                        .then((saveResult) => {
                          console.log("Pago guardado en BD:", saveResult);

                          if (onPaymentSuccess) {
                            onPaymentSuccess({ id: result.id });
                          }
                          sessionStorage.setItem("paymentSuccess", "success");
                          navigate("/payments_history");
                          resolve();
                          // axios para bajar stock

                          axios
                            .post("/api/update_stock.php", data)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((err) => console.log(err));
                        })
                        .catch((err) => {
                          console.error("Error guardando en BD:", err);
                          reject(err);
                        });
                    } else {
                      if (onPaymentSuccess) {
                        onPaymentSuccess({ id: result.id });
                      }
                      navigate("/payments_history");
                      resolve();
                    }
                  })
                  .catch((error) => {
                    console.error("Error al procesar el pago:", error);
                    alert("Error al procesar el pago: " + error.message);
                    reject(error);
                  });
              });
            },
            onError: (error) => {
              console.error("Error en Payment Brick:", error);
              setError("Error al cargar el formulario: " + error.message);
            },
          },
        };

        const controller = await bricksBuilder.create(
          "payment",
          "paymentBrick_container",
          settings
        );
        setBrickController(controller);
        console.log("Payment Brick creado exitosamente");
      } catch (err) {
        console.error("Error al inicializar Payment Brick:", err);
        setError("Error al inicializar: " + err.message);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      initPaymentBrick();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (brickController) {
        try {
          brickController.unmount();
        } catch (e) {
          console.log("Error al limpiar brick:", e);
        }
      }
    };
  }, [preferenceId, total, navigate, onPaymentSuccess, idCompra]);

  return (
    <div
      className="font-semibold mercado_pago translate-y-8 md:traslate-y-2 lg:translate-y-2"
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Quicksand, sans-serif",
        minHeight: "400px",
      }}
    >
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
          }}
        >
          <div
            style={{
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #009ee3",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p style={{ fontFamily: "Quicksand, sans-serif" }}>
            {preferenceId
              ? "Cargando formulario de pago..."
              : "Preparando preferencia de pago..."}
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            padding: "15px",
            borderRadius: "4px",
            color: "#c33",
            marginBottom: "20px",
            fontFamily: "Quicksand, sans-serif",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <div
        id="paymentBrick_container"
        style={{
          minHeight: "300px",
        }}
      ></div>

      <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
}

export default CheckoutBricks;
