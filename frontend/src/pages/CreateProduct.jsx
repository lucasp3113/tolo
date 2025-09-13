import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import logoToloBlue from '../assets/logoToloBlue.png'
import { FaBoxOpen } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import Dropdown from '../components/Dropdown';
import axios from 'axios'
import DropdownCategories from '../components/DropdownCategories'

export default function CreateProduct({ edit = false, onCancel, id }) {
    const [isMobile, setIsMobile] = useState(false);

    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    function addProduct(data) {
        console.log(data);

        const { shipping, ...restData } = data;

        const filteredArray = [];
        const categoryList = [];
        const valuesData = Object.entries(restData);

        valuesData.forEach((v) => {
            if (v[1]) {
                if (v[1] === true) {
                    categoryList.push(v); 
                } else {
                    filteredArray.push(v); 
                }
            }
        });

        const cleanData = Object.fromEntries(filteredArray);
        const formData = new FormData();

        for (const key in cleanData) {
            formData.append(key, cleanData[key]);
        }
        formData.append("shipping", shipping ? 1 : 0);

        formData.append("username", user);
        formData.append("categories", JSON.stringify(categoryList));
        if (watchedFiles && watchedFiles.length > 0) {
            Array.from(watchedFiles).forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append("imageCount", watchedFiles.length);
        }
        axios.post("/api/create_product.php", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }


    function updateProduct(data, productId) {
        const filteredArray = [];
        const categoryList = [];
        const valuesData = Object.entries(data);

        valuesData.forEach((v) => {
            if (v[1]) {
                if (v[1] === true) {
                    categoryList.push(v);
                } else {
                    filteredArray.push(v);
                }
            }
        });

        const cleanData = Object.fromEntries(filteredArray);
        const formData = new FormData();

        for (const key in cleanData) {
            formData.append(key, cleanData[key]);
        }

        formData.append("username", user);
        formData.append("categories", JSON.stringify(categoryList));
        formData.append("id_publicacion", productId); // Agregado el id_publicacion

        if (watchedFiles && watchedFiles.length > 0) {
            Array.from(watchedFiles).forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append("imageCount", watchedFiles.length);
        }

        axios.post("/api/update_product.php", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const watchedFiles = watch("images");
    const selectedFiles = watchedFiles ? Array.from(watchedFiles) : [];

    const [visible, setVisible] = useState(false)
    const [sizes, setSize] = useState(null)

    //Categorias q necesitan talle o color
    const men = watch("Ropa hombre");
    const women = watch("Ropa mujer");
    const boy = watch("Ropa niño");
    const girl = watch("Ropa niña");
    const unisex = watch("Ropa unisex");
    const footwear = watch("Calzado");
    const baby = watch("Bebés y niños")
    useEffect(() => {
        if (men || women || boy || girl || unisex || footwear || baby) {
            setSize(true);
            setTimeout(() => setVisible(true), 200);
        } else {
            setVisible(false);
            setTimeout(() => setSize(false), 50);
        }
    }, [men, women, boy, girl, unisex, footwear, baby])
    return (
        <form onSubmit={handleSubmit(!edit ? addProduct : (data) => updateProduct(data, id))} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>{edit ? "Editar publicación" : "Crear publicación"}</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">{edit ? "Completá el formulario para editar la publicación." : "Completá el formulario para crear una publicación."}</p>
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
            <DropdownCategories watch={watch} register={register} errors={errors} direction={"b"} />
            {sizes && (
                <div className={`transition-opacity "w-full m-auto px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800 flex-col duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
                    <label className='font-quicksand font-semibold text-sm' htmlFor="sizes">Seleccione los talles posibles del producto</label>
                    <Dropdown
                        className='sizes m-auto'
                        text="Talles"
                        cndiv="px-3"
                        direction={"d"}
                        options={[{
                            type: "custom",
                            content: (
                                <fieldset className='flex flex-col items-start justify-center'>
                                    <Input type="checkbox" name="xs" label="Electrónica" register={register} watch={watch} errors={errors} className='!flex-row' />
                                    <Input type="checkbox" name="Computación" label="Computación" register={register} watch={watch} errors={errors} className='!flex-row' />
                                    <Input type="checkbox" name="Celulares y accesorios" label="Celulares y accesorios" register={register} watch={watch} errors={errors} className='!flex-row' />
                                    <Input type="checkbox" name="Videojuegos" label="Videojuegos" register={register} watch={watch} errors={errors} className='!flex-row' />
                                </fieldset>
                            )
                        }]}
                    />
                </div>
            )}
            <Input
                type="file"
                name="images"
                label="Imágenes del producto"
                register={register}
                errors={errors}
                multiple={true}
                required={true}
            />

            {selectedFiles.length > 0 && (
                <div className="m-3">
                    <p className="text-sm text-gray-600 mb-2">
                        {selectedFiles.length} imagen(es) seleccionada(s):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedFiles.map((file, index) => {

                            const imageUrl = URL.createObjectURL(file);

                            return (
                                <div key={index} className="relative">
                                    <img
                                        src={imageUrl}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        onLoad={() => URL.revokeObjectURL(imageUrl)}
                                    />
                                    <div className="mt-1">
                                        <span className="text-xs text-gray-500 block truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <Input
                type={"textarea"}
                name={"productDescription"}
                label={"Descripción del  producto"}
                placeholder={"Descripción del producto"}
                register={register}
                errors={errors}
                maxLength={2000}
            />
            <Input
                type={"checkbox"}
                name={"shipping"}
                label={"Envío gratis"}
                placeholder={"Envío gratis"}
                register={register}
                errors={errors}
                required={false}
                className='flex-col-reverse'
            />
            {edit ? (
                <section className='flex items-center justify-center'>
                    <Button className={"w-50"} color={"green"} size={"md"} text={"Editar producto"} />
                    <Button className={"w-50"} color={"blue"} size={"md"} type='button' text={"Cancelar"} onClick={() => onCancel()} />
                </section>
            ) : (<Button className={"w-50"} color={"blue"} size={"md"} text={"Añadir producto"} />)}

        </form>
    )
}