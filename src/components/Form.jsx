/*
📄 Form — Componente de formulario reutilizable con integración de validaciones, imagen y campos dinámicos

🧩 Uso:
   Se utiliza para renderizar formularios personalizables con validación integrada mediante React Hook Form. 
   Permite incluir un logo, título, descripción, campos generados dinámicamente y un botón personalizado.

🔧 Props:
  - fields: array de componentes <Input> que se renderizan dentro del formulario. 
            Cada uno recibe automáticamente las props: register, errors y watch.
  - onSubmit: función que se ejecuta al enviar el formulario, recibe los datos del formulario y la función watch.
  - button: elemento React que se muestra al final del formulario (generalmente un botón).
  - title: cadena que representa el título del formulario.
  - description: cadena que representa una breve descripción o instrucción del formulario.
  - logo: booleano que indica si se debe mostrar el logo en la parte superior.
  - className: cadena con clases CSS adicionales para personalizar el estilo del formulario.

📌 Ejemplo de uso:

<Form
  fields={[
    <Input name="email" type="email" label="Correo" required />,
    <Input name="password" type="password" label="Contraseña" required />
  ]}
  onSubmit={(data) => console.log(data)}
  button={<Button text="Enviar" color="blue" />}
  title="Registro"
  description="Por favor, completá tus datos"
  logo={true}
/>
*/


import React from 'react'
import { useForm } from 'react-hook-form'
import logoToloBlue from "../assets/logoToloBlue.png"

export default function Form({ fields, onSubmit, button, title, description, logo, className }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    return (
        <form action="" onSubmit={handleSubmit((data) => onSubmit(data, watch))} className={`w-75 bg-white m-auto p-3 shadow rounded-xl ${className}`}>
            {logo ? <img src={logoToloBlue} className='w-16 h-10 object-contain'></img> : ""}
            <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            {fields.map((input, index) => React.cloneElement(input, { register, errors, watch, key: index }))}
            {button}
        </form>
    )
}