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

import React, { useEffect } from 'react';

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
  icon,
  options = [],
  className = '',
}) {
  const Component = type === "select" ? "select" : type === "textarea" ? "textarea" : "input"

  const errorActual = errors?.[name];

  useEffect(() => {
    if (errorActual && 'vibrate' in navigator) {
      navigator.vibrate(300);
    }
  }, [errorActual]);

  return (
    <div className={type === "checkbox" ? "flex items-center gap-2 m-3" : "flex flex-col-reverse m-3 relative items-start"}>
      {errors?.[name] && <span className='text-red-600 text-xs'>{errors[name].message}</span>}

      {type === "checkbox" ? undefined : type === "textarea" ? (
        <span className={errors[name]
          ? "absolute text-2xl -translate-1/3 right-1 bottom-[65px] text-gray-400"
          : "absolute text-2xl right-3 bottom-[65px] text-gray-400"}>
          {icon}
        </span>
      ) : (
        <span className={errors[name]
          ? "absolute text-2xl -translate-1/3 right-1 top-1/2 text-gray-400"
          : "absolute text-2xl right-3 top-1/2 text-gray-400"}>
          {icon}
        </span>
      )}

      <Component
        {...(type !== "select" ? { type } : {})}
        name={name}
        id={name}
        {...(type !== 'file' ? { value } : {})}
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
        className={`
  ${type === "textarea" ? "h-24" : ""}
  w-full px-3 py-2 rounded-lg
  ${type === "checkbox"
            ? "focus:outline-none focus:ring-0 focus:border-transparent"
            : errors?.[name]
              ? 'border-2 border-red-600 animation-shake focus:ring-0 focus:border-red-600'
              : 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }
  ${className}
`}

      >
        {type === "select" ? options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        )) : undefined}
      </Component>

      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
}
