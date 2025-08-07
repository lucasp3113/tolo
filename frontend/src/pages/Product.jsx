import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import logoToloBlue from '../assets/logoToloBlue.png'
import { FaBoxOpen } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import Dropdown from '../components/Dropdown';


export default function Product() {
    function addProduct(data) {
        console.log(data)
    }
    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <form onSubmit={handleSubmit(addProduct)} className='w-85 mb-52 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>Crear publicación</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">Completá el formulario para crear una publicación.</p>
            </div>
            <Input
                name={"nameProduct"}
                label={"Nombre del producto"}
                placeholder={"Nombre del producto"}
                register={register}
                errors={errors}
                required={true}
                minLength={3}
                maxLength={25}
                icon={<FaBoxOpen />}
            />
            <Input
                type={"number"}
                name={"productPrice"}
                label={"Precio del producto"}
                placeholder={"Precio del producto"}
                register={register}
                errors={errors}
                required={true}
                icon={<FaDollarSign />}
                maxLength={20}
                validate={value => Number(value) > 0 || "El precio no puede ser negativo ni 0"}
            />
            <Input
                type={"number"}
                name={"productStock"}
                label={"Stock del producto"}
                placeholder={"Stock del producto"}
                register={register}
                errors={errors}
                required={true}
                icon={<FaBoxes />}
                validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
            />
            <Dropdown
                text="Categorias"
                cndiv="m-3"
                className="w-full m-auto px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800"
                options={[
                    {
                        type: "custom",
                        content: (
                            <fieldset className='flex flex-col items-start justify-center'>
                                <Dropdown
                                    text="Ropa"
                                    cndiv="m-3"
                                    direction='r'
                                    options={[
                                        {
                                            type: "custom",
                                            content: (
                                                <fieldset className='flex flex-col items-start justify-center'>
                                                    <Input
                                                        type="checkbox"
                                                        name="menClothes"
                                                        label="Ropa de hombre"
                                                        register={register}
                                                        errors={errors}
                                                        required={true}
                                                        maxLength={20}
                                                        className='!flex-row'
                                                    />
                                                    <Input
                                                        type="checkbox"
                                                        name="womenClothes"
                                                        label="Ropa de mujer"
                                                        register={register}
                                                        errors={errors}
                                                        required={true}
                                                        maxLength={20}
                                                        className='!flex-row'
                                                    />
                                                    <Input
                                                        type="checkbox"
                                                        name="unisexClothes"
                                                        label="Ropa unisex"
                                                        register={register}
                                                        errors={errors}
                                                        required={true}
                                                        maxLength={20}
                                                        className='!flex-row'
                                                    />
                                                    <Input
                                                        type="checkbox"
                                                        name="boyClothes"
                                                        label="Ropa de niño"
                                                        register={register}
                                                        errors={errors}
                                                        required={true}
                                                        maxLength={20}
                                                        className='!flex-row'
                                                    />
                                                    <Input
                                                        type="checkbox"
                                                        name="girlClothes"
                                                        label="Ropa de niña"
                                                        register={register}
                                                        errors={errors}
                                                        required={true}
                                                        maxLength={20}
                                                        className='!flex-row'
                                                    />
                                                </fieldset>
                                            )
                                        }
                                    ]}
                                />
                                <Input
                                    type="checkbox"
                                    name="Mascotas"
                                    label="Mascotas"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                    maxLength={20}
                                />
                                <Input
                                    type="checkbox"
                                    name="Tecnología"
                                    label="Tecnlogia"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                    maxLength={20}
                                />
                            </fieldset>
                        )
                    }
                ]}
            />

            <Input
                type={"textarea"}
                name={"productDescription"}
                label={"Descripción del  producto"}
                placeholder={"Descripción del producto"}
                register={register}
                errors={errors}
                maxLength={2000}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Añadir producto"} />

        </form>
    )
}
