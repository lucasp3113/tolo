import React from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import axios from 'axios'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)

    const [message, setMessage] = useState(null);

    function loginRequest(data) {
        axios.post("/api/login.php", data)
            .then((res) => {
                setMessage([res.data.message, res.data.success])
            })
            .catch((err) => setMessage([err.response.data.message, err.response.data.success]))
    }
    return (
        <div className="flex items-center justify-center m-5">
            <Form 
            onSubmit={loginRequest}
            google={true} 
            remember={true} 
            logo={true} 
            button={<Button className={"w-50"} 
            color={"blue"} 
            size={"md"} 
            text={"Iniciar sesión"} />} 
            className={" "} 
            title={"Login"} 
            description={"Completá el formulario para iniciar sesion."} 
            fields={[
                <Input
                    icon={<FaUserCircle/>}
                    type={"text"}
                    name={"user"}
                    placeholder={"Usuario"}
                    required={true}
                    label={"Usuario"}
                />,
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
                />,

            ]} />
        <span className={message && message[1] ? "text-green-600": "text-red-600"}>{message ? message[0]: undefined}</span>
        </div>
    )
}
