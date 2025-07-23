import React from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
    return (
        <div className="flex items-center justify-center m-5">
            <Form google={true} remember={true} logo={true} button={<Button className={"w-50"} color={"blue"} size={"md"} text={"Iniciar sesión"} />} className={" "} title={"Login"} description={"Completá el formulario para iniciar sesion."} fields={[
                <Input
                    type={"text"}
                    name={"user"}
                    placeholder={"Usuario"}
                    required={true}
                    label={"Usuario"}
                />,
                <Input
                    label={"Contraseña"}
                    type={"password"}
                    name={"password"}
                    placeholder={"Contraseña"}
                    required={true}
                />,

            ]} />
        </div>
    )
}
