import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from "../components/AuthProvider.jsx";
import Input from '../components/Input'
import Button from '../components/Button'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import logoToloBlue from '../assets/LogoToloBlue.png'
import { FaUserCircle } from 'react-icons/fa'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'


export default function Register() {
    const {ecommerce} = useParams()
    const { login } = useContext(AuthContext);

    const navigate = useNavigate()

    const { register, watch, handleSubmit, formState: { errors }, setError } = useForm()
    const selected = watch("select")

    const [showEcommerce, setShowEcommerce] = useState(false)
    const [visible, setVisible] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (selected === "e-commerce(tienda)") {
            setShowEcommerce(true);
            setTimeout(() => setVisible(true), 200);
        } else {
            setVisible(false);
            setTimeout(() => setShowEcommerce(false), 50);
        }
    }, [selected]);
    function registrationRequest(data) {
        axios.post("/api/register.php", data)
            .then((res) => {
                const token = res.data.token
                const expiration = res.data.expiration
                login(token, expiration);
                const userType = data["select"] === "e-commerce(tienda)" ? "ecommerce" : data["select"] === "Vendedor" ? "vendedor_particular" : "cliente"
                const urls = {
                    ecommerce: ecommerce ? `/${ecommerce}/ecommerce_dashboard` : "/ecommerce_dashboard",
                    vendedor_particular: ecommerce ? `/${ecommerce}/seller_dashboard` : "/seller_dashboard",
                    cliente: ecommerce ? `/${ecommerce}/` : "/"

                }
                navigate(urls[userType])
                console.log(res)
            })
            .catch((err) => {
                setError("user", {
                    type: "manual",
                    message: err.response.data.message
                })
            })
    }
        

    return (
        <form 
        onSubmit={handleSubmit(registrationRequest)} 
        className="w-85 mb-52 m-auto mt-5 bg-white p-3 shadow rounded-xl">
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>Registro</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">Completá el formulario para crear tu cuenta.</p>
            </div>

            <Input
                icon={<FaUserCircle />}
                type={"text"}
                name={"user"}
                placeholder={"Usuario"}
                required={true}
                minLength={3}
                maxLength={15}
                label={"Usuario"}
                register={register}
                errors={errors}
                watch={watch}
            />
            <Input
                icon={<HiMail />}
                label={"Email"}
                type={"text"}
                name={"email"}
                placeholder={"Correo electrónico"}
                required={true}
                register={register}
                errors={errors}
                watch={watch}
                pattern={{
                    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo electrónico inválido"
                }}
            />
            <Input
                icon={
                    <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                        {showPassword ? <HiEye/> : <HiEyeOff />}
                    </div>
                }
                label={"Contraseña"}
                type={showPassword ? "text" : "password"}
                name={"password"}
                placeholder={"Contraseña"}
                required={true}
                minLength={8}
                maxLength={15}
                register={register}
                errors={errors}
                watch={watch}
                pattern={{
                    regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
                    message: "La contraseña debe tener al menos una letra mayúscula, un número y un símbolo"
                }}
            />
            <Input
                icon={<HiLockClosed />}
                label={"Repetir contraseña"}
                type={"password"}
                name={"repeatPassword"}
                placeholder={"Repetir contraseña"}
                required={true}
                errors={errors}
                watch={watch}
                register={register}
                validate={(value, watch) => {
                    if (value === watch("password")) {
                        return true
                    } else {
                        return "Las contraseñas no coinciden"
                    }
                }}
            />
            <Input
                type={"select"}
                required={"true"}
                label={"Tipo de cuenta"}
                register={register}
                errors={errors}
                watch={watch}
                options={[
                    "Cliente",
                    "Vendedor",
                    "e-commerce(tienda)"
                ]}
                name={"select"}
            />

            {showEcommerce && (
                <div className={`transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
                    <Input
                        type={"text"}
                        name={"nameEcommerce"}
                        placeholder={"Nombre del e-commerce"}
                        required={true}
                        minLength={3}
                        errors={errors}
                        watch={watch}
                        maxLength={25}
                        label={"Nombre del e-commerce(Tienda)"}
                        register={register}
                    />
                </div>
            )}

            <Button className={"w-50"} color={"blue"} size={"md"} text={"Crear cuenta"} />

            <div className="flex flex-col items-center justify-center mt-3">
                <span>O ingresa por:</span>
                <FcGoogle className="text-4xl mt-2 mb-3 hover:scale-120 transition-transform ease-in-out duration-200" />
            </div>
        </form>
    )
}
