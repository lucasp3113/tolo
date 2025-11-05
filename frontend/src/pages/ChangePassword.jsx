import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import logoToloBlue from "../assets/logoToloBlue.png";
import { HiEye } from "react-icons/hi";
import { HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

export default function ChangePassword() {
  useEffect(() => {
    sessionStorage.removeItem("pending_user");

    const verifyToken = sessionStorage.getItem("verify_token");
    const verifyTime = sessionStorage.getItem("verify_time");

    const fiveMinutes = 5 * 60 * 1000; // 5 minutos
    const now = Date.now();

    if (!verifyToken || !verifyTime || now - Number(verifyTime) > fiveMinutes) {
      sessionStorage.removeItem("verify_token");
      sessionStorage.removeItem("verify_time");
      window.location.href = "/verify_code";
    }
  }, []);

  function changePasswordExecute(data) {
    axios
      .post("/api/change_password.php", {
        user: user,
        data: data,
      })
      .then((res) => {
        console.log(res);
        navigate("/settings");
        setShowSuccess(true);
      })
      .catch((err) => {
        const message = err.response?.data?.message;
        if (message === "Contraseña incorrecta") {
          setError("passwordCurrent", {
            type: "manual",
            message: message,
          });
        }
        console.log(message);
      });
  }

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    user = payload.user;
  }

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(changePasswordExecute)}
      className="w-85 mb-52 m-auto mt-12 bg-white p-4 shadow rounded-xl"
    >
      <div className="flex flex-col mt-3 ml-3 items-start">
        <h2 className="font-quicksand text-2xl font-bold">
          Cambiar contraseña
        </h2>
        <p className="text-sm whitespace-nowrap text-gray-600">
          Completá el formulario para cambiar tu contraseña.
        </p>
      </div>

      <Input
        key="passwordCurrent"
        type="password"
        name="passwordCurrent"
        placeholder="Contraseña actual"
        required={true}
        register={register}
        errors={errors}
        label={"Contraseña actual"}
      />

      <Input
        icon={
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer"
          >
            {showPassword ? <HiEye /> : <HiEyeOff />}
          </div>
        }
        label={"Contraseña nueva"}
        type={showPassword ? "text" : "password"}
        name={"passwordNow"}
        placeholder={"Contraseña"}
        required={true}
        register={register}
        errors={errors}
        pattern={{
          regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
          message:
            "La contraseña debe tener al menos una letra mayúscula, un número y un símbolo",
        }}
      />

      <Input
        key="passwordRepeat"
        type="password"
        name="passwordRepeat"
        placeholder="Contraseña actual"
        required={true}
        register={register}
        errors={errors}
        label={"Repetir contraseña"}
        validate={(value) => {
          if (value === watch("passwordNow")) {
            return true;
          } else {
            return "Las contraseñas no coinciden";
          }
        }}
      />

      <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
      {/* {showSuccess && (
        <Alert
          type="toast"
          variant="success"
          title="¡Se ha cambiado la contraseña de forma exitosa!"
          duration={4000}
          onClose={() => setShowSuccess(false)}
          show={true}
        />
      )} */}
    </form>
  );
}
