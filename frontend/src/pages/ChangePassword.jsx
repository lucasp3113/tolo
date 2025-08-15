import React, { useState } from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'
import { useForm } from 'react-hook-form'
import logoToloBlue from '../assets/logoToloBlue.png'
import { HiEye } from 'react-icons/hi'
import { HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'

export default function ChangePassword() {
    function changePasswordExecute(data) {
        console.log(data)
        axios.post("/api/change_password.php", {
            "user": user,
            "data": data
        })
        .then((res) => console.log(res))
        .catch((err) => {
            const message = err.response.data.message
            if (message === "Contraseña incorrecta") {
                setError("passwordCurrent", {
                    type: "manual",
                    message: message
                }) 
            }
            console.log(message)
        })
    }

    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }

    const [showPassword, setShowPassword] = useState(false)

    const { register, watch, handleSubmit, formState: { errors }, setError } = useForm()

    return (
        <form
            onSubmit={handleSubmit(changePasswordExecute)}
            className="w-85 mb-52 m-auto mt-5 bg-white p-3 shadow rounded-xl">
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>Login</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">Completá el formulario para cambiar tu contraseña.</p>
            </div>
            <Input
                key="passwordCurrent"
                type="password"
                name="passwordCurrent"
                className="pr-10 bg-white h-9 mb-3"
                placeholder="Contraseña actual"
                required={true}
                register={register}
                errors={errors}
                label={"Contraseña actual"}
            />
            <Input
                icon={
                    <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
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
                    message: "La contraseña debe tener al menos una letra mayúscula, un número y un símbolo"
                }}
            />
            <Input
                key="passwordRepeat"
                type="password"
                name="passwordRepeat"
                className="pr-10 bg-white h-9 mb-3"
                placeholder="Contraseña actual"
                required={true}
                register={register}
                errors={errors}
                label={"Repetir contraseña"}
                validate={(value) => {
                    if (value === watch("passwordNow")) {
                        return true
                    } else {
                        return "Las contraseñas no coinciden"
                    }
                }}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Iniciar sesión"} />

            <div className="flex flex-col items-center justify-center mt-3">
                <span>O ingresa por:</span>
                <FcGoogle className="text-4xl mt-2 mb-3 hover:scale-120 transition-transform ease-in-out duration-200" />
            </div>
        </form>
    )
}
