/*
📝 Input — Campo de entrada de texto con validaciones integradas y estilos para mostrar errores

🧩 Uso:
   Componente para capturar datos en formularios que funcionan con React Hook Form. 
   Las funciones y estados de validación (`register`, `errors`, `watch`) se reciben 
   indirectamente desde el componente Form que envuelve este Input. Permite validar:
   campo obligatorio, longitud mínima y máxima, expresiones regulares y validaciones personalizadas.
   Muestra mensajes de error debajo del campo y cambia el estilo del borde si hay error.

🔧 Props:
  - type: tipo de input (text, email, password, etc).
  - name: identificador único del campo, usado para registro y errores.
  - value: valor actual del input.
  - required: booleano para indicar si es obligatorio.
  - minLength: longitud mínima requerida.
  - maxLength: longitud máxima permitida.
  - validate: función para validaciones personalizadas (recibe valor y watch).
  - pattern: objeto con `regex` (expresión regular) y `message` para validar formato.
  - onChange: función manejadora para el evento onChange.
  - placeholder: texto de ayuda que aparece dentro del input.
  - label: texto descriptivo que aparece arriba del input.
  - className: clases CSS adicionales para personalización de estilos.

📌 Ejemplo de uso dentro de un componente Form:

<Form
  fields={[
    <Input
      type="password"
      name="password"
      label="Contraseña"
      required={true}
      minLength={8}
      maxLength={20}
      placeholder="Ingresa tu contraseña"
      pattern={{
        regex: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
      }}
      validate={(value, watch) =>
        watch("repeatPassword") === value || "Las contraseñas no coinciden"
      }
    />
  ]}
  onSubmit={(data) => console.log(data)}
/>
*/

import React from 'react';

export default function Input({
  register,
  errors,
  watch,
  type,
  name,
  value,
  required,
  minLength,
  maxLength,
  validate,
  pattern,
  onChange,
  placeholder,
  label,
  className = '',
}) {

  return (
    <div className='flex flex-col m-3'>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...register(`${name}`, {
          required: {
            value: required,
            message: "Campo requerido"
          },
          minLength: {
            value: minLength,
            message: `Mínimo ${minLength} caracteres`
          },
          maxLength: {
            value: maxLength,
            message: `Máximo ${maxLength} caracteres`
          },
          validate: validate ? (value) => validate(value, watch) : undefined,
          pattern: pattern ? {
            value: pattern.regex,
            message: pattern.message
          } : undefined


        })}
        className={`${errors?.[name] && "border-red-600 border-2"} w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${className}`}
      />
      {errors?.[name] && <span className='text-red-600 text-xs'>{errors[name].message}</span>}
    </div>
  );
}
