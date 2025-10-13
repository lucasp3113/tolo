import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import logoToloBlue from '../assets/logoToloBlue.png'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export default function Login() {
    const {ecommerce} = useParams()
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [message, setMessage] = useState(null);

    const { register, handleSubmit, formState: { errors }, setError } = useForm()

    function loginRequest(data) {
        axios.post("/api/login.php", data)
            .then((res) => {
                console.log(res)
                const token = res.data.token
                const expiration = res.data.expiration
                const userType = res.data.user_type
                login(token, expiration);
                const urls = {
                    ecommerce: ecommerce ? `/${ecommerce}/ecommerce_dashboard` : "/ecommerce_dashboard",
                    vendedor_particular: ecommerce ? `/${ecommerce}/seller_dashboard` : "/seller_dashboard",
                    cliente: ecommerce ? `/${ecommerce}/` : "/",
                    admin: ecommerce ? `/${ecommerce}/admin_panel` : "/admin_panel"

                }
                navigate(urls[userType])
                
            })
            .catch((err) => {
                console.log(err)
                setMessage([err.response.data.message, err.response.data.success])
                message && message[1] ? undefined: setError(err.response.data.input, {
                    type: "manual",
                    message: err.response.data.message
                }) 
            })
    }
    return (
        <form
            onSubmit={handleSubmit(loginRequest)}
            className="w-85 mb-52 m-auto mt-5 bg-white p-3 shadow rounded-xl">
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>Login</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">Completá el formulario para iniciar sesión.</p>
            </div>
            <Input
                icon={<FaUserCircle />}
                type={"text"}
                name={"user"}
                placeholder={"Usuario"}
                required={true}
                label={"Usuario"}
                register={register}
                errors={errors}
            />
            <Input
                icon={
                    <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                        {showPassword ? <HiEye /> : <HiEyeOff />}
                    </div>
                }
                label={"Contraseña"}
                type={showPassword ? "text" : "password"}
                name={"password"}
                placeholder={"Contraseña"}
                required={true}
                register={register}
                errors={errors}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Iniciar sesión"} />

            <div className="flex flex-col items-center justify-center mt-3">
                <span>O ingresa por:</span>
                <FcGoogle className="text-4xl mt-2 mb-3 hover:scale-120 transition-transform ease-in-out duration-200" />
            </div>
        </form>
    )
}
