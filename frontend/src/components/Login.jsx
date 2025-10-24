import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import logoToloBlue from '../assets/logoToloBlue.png'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ pc }) {
    const { ecommerce } = useParams()
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState(null);

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

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
                    cliente: ecommerce ? `/${ecommerce}/` : "/"
                }
                sessionStorage.setItem('loginSuccess', 'success')
                navigate(urls[userType])
            })
            .catch((err) => {
                sessionStorage.setItem('loginSuccess', 'error')
                window.dispatchEvent(new CustomEvent('loginError'))
                setMessage([err.response.data.message, err.response.data.success])
                message && message[1] ? undefined : setError(err.response.data.input, {
                    type: "manual",
                    message: err.response.data.message
                })
            })
    }

    function handleGoogleLogin(credentialResponse) {
        axios.post("/api/google_login.php", {
            credential: credentialResponse.credential
        })
            .then((res) => {
                const token = res.data.token;
                const expiration = res.data.expiration;
                const userType = res.data.user_type;
                login(token, expiration);

                const urls = {
                    ecommerce: ecommerce ? `/${ecommerce}/ecommerce_dashboard` : "/ecommerce_dashboard",
                    vendedor_particular: ecommerce ? `/${ecommerce}/seller_dashboard` : "/seller_dashboard",
                    cliente: ecommerce ? `/${ecommerce}/` : "/"
                };

                sessionStorage.setItem('loginSuccess', 'success');
                navigate(urls[userType]);
            })
            .catch((err) => {
                console.error('Error con Google login:', err);
                sessionStorage.setItem('loginSuccess', 'error');
                window.dispatchEvent(new CustomEvent('loginError'));
            });
    }

    return (
        <form
            onSubmit={handleSubmit(loginRequest)}
            className={`${pc ? "bg-transparent" : "bg-white"} w-85 mb-52 md:mb-0 m-auto mt-16 md:mt-0 p-3 rounded-xl`}>
            {/* {!ecommerce && (
                <img src={logoToloBlue} loading='lazy' className=' translate-x-1 w-18 h-10 object-contain' alt="Logo" />
            )} */}
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className={`${pc && "text-white"} -translate-y-1 text-3xl font-medium `}>Login</h2>
                {/* <p className="text-sm translate-y-1.5 whitespace-nowrap text-gray-600">Completá el formulario para iniciar sesión.</p> */}
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
                account={pc}
            />
            <Input
                icon={
                    <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                        {showPassword ? <HiEye /> : <HiEyeOff />}
                    </div>
                }
                label={"Contraseña"}
                account={pc}
                type={showPassword ? "text" : "password"}
                name={"password"}
                placeholder={"Contraseña"}
                required={true}
                register={register}
                errors={errors}
            />
            <Button className={"w-50 !text-lg md:p2 hover:bg-white hover:text-sky-800 hover:!scale-100 !transition-all !ease-in-out !duration-500"} color={"blue"} size={"md"} text={"Iniciar sesión"} />

            <div className="flex flex-col font-quicksand font-semibold items-center justify-center mt-3">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log('Error')}
                />
            </div>
        </form>
    )
}