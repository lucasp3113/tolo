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