import React from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Home() {
  return (
    <>
      <Form logo={true} button={<Button className={"w-50"} color={"blue"} size={"md"} text={"Crear cuenta"}/>} className={"mt-3"} title={"Registro"} description={"Completá el formulario para crear tu cuenta."} fields={[
        <Input
          type={"text"}
          name={"user"}
          placeholder={"Usuario"}
          required={true}
          minLength={5}
          maxLength={15}
          label={"Usuario"}
        />,
        <Input
          label={"Email"}
          type={"text"}
          name={"email"}
          placeholder={"Correo electrónico"}
          required={true}
          pattern={{
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Corre electrónico inválido"
          }}
        />,

        <Input
        label={"Contraseña"}
          type={"password"}
          name={"password"}
          placeholder={"Contraseña"}
          required={true}
          minLength={8}
          maxLength={15}
          pattern={{
            regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
            message: "La contraseña debe tener al menos una letra mayúscula, un número y un símbolo"
          }}

        />,
        <Input
        label={"Repetir contraseña"}
          type={"password"}
          name={"repeatPassword"}
          placeholder={"Repetir contraseña"}
          required={true}
          validate={(value, watch) => {
            if (value === watch("password")) {
              return true
            } else {
              return "Las contraseñas no coinciden"
            }
          }}
        />
      ]} />
    </>
  )
}
