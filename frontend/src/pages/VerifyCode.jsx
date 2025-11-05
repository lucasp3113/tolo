import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

export default function VerifyCode() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const user = sessionStorage.getItem("pending_user");
  const [showSuccess, setShowSuccess] = useState();

  useEffect(() => {
    if (!user) {
      navigate("/request_code");
    }
  }, [user, navigate]);

  async function verify(data) {
    try {
      const res = await axios.post(
        "/api/verify_code.php",
        { email: user, code: data.code },
        { withCredentials: true }
      );

      console.log("✅ Respuesta del PHP:", res.data);

      if (res.data.success) {
        sessionStorage.setItem("verify_token", res.data.token);
        sessionStorage.setItem("verify_time", Date.now().toString());
        setShowSuccess(true);
        navigate("/change_password");
      } else {
        setError("code", {
          type: "manual",
          message: res.data.message || "Código incorrecto",
        });
      }
    } catch (err) {
      console.error(
        "❌ Error en verify_code:",
        err.response?.data || err.message
      );
      setError("code", {
        type: "manual",
        message: err.response?.data?.message || "Error inesperado",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(verify)}
      className="w-85 m-auto mt-12 bg-white p-4 shadow rounded-xl"
    >
      <h2 className="font-quicksand text-2xl font-bold mb-3">
        Verificar código
      </h2>

      <Input
        key="email"
        type="code"
        name="code"
        placeholder="Código de 6 dígitos"
        required={true}
        register={register}
        errors={errors}
        label={"Ingresá tu código acá"}
      />

      {errors.code && (
        <p className="text-red-500 text-sm">{errors.code.message}</p>
      )}

      <Button
        className="mt-4 bg-blue-500! hover:bg-blue-600! hover:scale-100! transition-colors! text-white px-4 py-2 rounded"
        size="md"
        text="Verificar"
        color="blue"
      />

      {/* {showSuccess && (
        <Alert
          type="toast"
          variant="success"
          title="Código verificado correctamente"
          duration={4000}
          onClose={() => setShowSuccess(false)}
          show={true}
        />
      )} */}
    </form>
  );
}
