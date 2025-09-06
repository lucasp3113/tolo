/*
📝 Input — Campo de entrada versátil con soporte para validación, íconos y múltiples tipos

🧩 Uso:
   Se utiliza para renderizar un campo de entrada adaptable que funciona con 
   formularios controlados por React Hook Form. Admite distintos tipos como 
   texto, contraseña, email, checkbox, textarea, select y carga de archivos 
   (con validación de imágenes). Incluye manejo automático de errores con 
   vibración y mensajes de validación, así como soporte para íconos y estilos dinámicos.

🔧 Props:
  - register: función de React Hook Form para registrar el campo.
  - errors: objeto de errores proporcionado por React Hook Form.
  - watch: función de React Hook Form para observar valores en tiempo real.
  - type: tipo de input. Valores posibles:
      • "text", "password", "email", "checkbox", "textarea", "select", "file"
  - name: nombre único del campo.
  - value: valor actual del campo (no aplicable a "file" o "select").
  - required: booleano que indica si el campo es obligatorio.
  - minLength: número mínimo de caracteres permitidos.
  - maxLength: número máximo de caracteres permitidos.
  - validate: función de validación personalizada.
  - pattern: objeto con { regex, message } para validar con expresiones regulares.
  - onChange: función que se ejecuta al cambiar el valor.
  - placeholder: texto de ayuda dentro del campo.
  - label: etiqueta visible asociada al campo.
  - icon: ícono a mostrar dentro del campo.
  - options: array de opciones (solo para type="select").
  - className: clases adicionales de TailwindCSS.
  - multiple: booleano que habilita selección múltiple (en type="file" o "select").

📌 Ejemplo de uso:

<Input
  name="email"
  type="email"
  label="Correo electrónico"
  placeholder="ejemplo@correo.com"
  required={true}
  minLength={5}
  maxLength={50}
  register={register}
  errors={errors}
  watch={watch}
  icon={<MailIcon />}
  className="mb-4"
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
  multiple = false
}) {
  const Component = type === "select" ? "select" : type === "textarea" ? "textarea" : "input"

  const errorActual = errors?.[name];

  useEffect(() => {
    if (errorActual && 'vibrate' in navigator) {
      navigator.vibrate(300);
    }
  }, [errorActual]);

  // Función para validar archivos de imagen
  const validateImageFiles = (files) => {
    if (!files || files.length === 0) return true; // Si no hay archivos, pasa la validación
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        return `El archivo "${file.name}" no es una imagen válida. Solo se permiten: JPG y PNG`;
      }
      
      // Validar tamaño
      if (file.size > maxSize) {
        return `El archivo "${file.name}" es demasiado grande. Máximo 5MB`;
      }
    }
    
    return true;
  };

  return (
    <div className={type === "checkbox" ? "flex items-center gap-2 m-3" : "flex flex-col-reverse m-3 relative items-start"}>
      {errors?.[name] && <span className='text-red-600 text-xs'>{errors[name].message}</span>}

      {type === "checkbox" ? undefined : type === "textarea" ? (
        <span className={errors[name]
          ? "absolute text-2xl -translate-1/3 right-1 bottom-[65px] text-gray-400"
          : "absolute text-2xl right-3 bottom-[65px] text-gray-400"}>
          {icon}
        </span>
      ) : type === "file" ? undefined : (
        <span className={errors[name]
          ? "absolute text-2xl -translate-1/3 right-1 top-1/2 text-gray-400"
          : "absolute text-2xl right-3 top-1/2 text-gray-400"}>
          {icon}
        </span>
      )}

      {type === "file" ? (
        <div className="relative w-full">
          <input
            type="file"
            name={name}
            id={name}
            multiple={multiple}
            accept="image/jpeg,image/jpg,image/png" 
            {...register(`${name}`, {
              required: {
                value: required,
                message: "Campo requerido"
              },
              validate: {
                imageFiles: validateImageFiles,
                ...(validate ? { custom: (value) => validate(value, watch) } : {})
              },
            })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`
            w-full px-3 py-2 rounded-lg cursor-pointer
            flex items-center justify-center gap-2
            ${errors?.[name]
              ? 'border-2 border-red-600 bg-red-50 text-red-700'
              : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600'
            }
            transition-colors duration-200
          `}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-medium">
              {multiple ? 'Seleccionar imágenes' : 'Seleccionar imagen'}
            </span>
          </div>
          {/* Mostrar archivos seleccionados */}
          {watch && watch(name) && watch(name).length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium">Archivos seleccionados:</p>
              {Array.from(watch(name)).map((file, index) => (
                <p key={index} className="truncate">• {file.name}</p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Component
          {...(type !== "select" ? { type } : {})}
          name={name}
          id={name}
          {...(type !== 'file' && type !== 'select' ? { value } : {})}
          multiple={multiple}
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
      )}

      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
}