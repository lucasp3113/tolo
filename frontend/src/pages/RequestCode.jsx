import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import Alert from "../components/Alert";
import ClipLoader from "react-spinners/ClipLoader";

export default function RequestCode() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function requestCode(data) {
    console.log("📤 Enviando a PHP:", data.email);
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/request_code.php",
        { email: data.email },
        { withCredentials: true }
      );
      console.log("✅ Respuesta del PHP:", res.data);

      if (res.data.success) {
        sessionStorage.setItem("pending_user", data.email);
        console.log("💾 Guardado pending_user:", data.email);
        setLoading(false);
        setShowSuccess(true);
        navigate("/verify_code");
      } else {
        console.warn("⚠️ PHP devolvió error lógico:", res.data);
        setLoading(false);
        setError("email", {
          type: "manual",
          message: res.data.message || "Error inesperado",
        });
      }
    } catch (err) {
      setLoading(false);
      console.error(
        "❌ Error de red o servidor:",
        err.response?.data || err.message
      );
      setError("email", {
        type: "manual",
        message: err.response?.data?.message || "Error inesperado",
      });
    }
  }

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(requestCode)}
      className="w-85 m-auto mt-12 bg-white p-4 shadow rounded-xl"
    >
      <h2 className="font-quicksand text-2xl font-bold mb-3">
        Verificación de identidad
      </h2>
      <Input
        key="email"
        type="email"
        name="email"
        placeholder="Ingresá tu correo electrónico"
        required={true}
        register={register}
        errors={errors}
        label={"E-Mail"}
      />
      <Button
        className="mt-4 bg-blue-500! hover:bg-blue-600! hover:scale-100! transition-colors! text-white px-4 py-2 rounded"
        size="md"
        text="Enviar código"
        color="blue"
      />
      {loading && (
        
        <div className="fixed bottom-28 left-0 right-0 z-50 flex justify-center items-center h-20 mt-1 mb-11">
          <p>
            Enviando código...
          </p>
          <div className="fixed bottom-28 left-0 right-0 z-50 flex justify-center items-center h-20">
          <ClipLoader size={40} color="#f0000" className="ml-2" />
          </div>
        </div>
      )}
      {/* {showSuccess && (
        <Alert
          type="toast"
          variant="success"
          title="Hemos enviado un código a tu E-Mail. No se lo compartas a nadie."
          duration={4000}
          onClose={() => setShowSuccess(false)}
          show={true}
        />
      )} */}
    </form>
  );
}
