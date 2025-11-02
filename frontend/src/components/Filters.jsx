import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import { BiSortAlt2 } from "react-icons/bi";
import { FaTruck, FaTag } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Button from './Button';
import Dropdown from './Dropdown';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Filters({ setPanelFilter, dataCategories, word, setSearchData }) {
    const { register, watch, handleSubmit, formState: { errors } } = useForm();
    const [visible, setVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const {ecommerce: nameEcommerce} = useParams()

    function filter(data) {
        data["search"] = word
        data["nameEcommerce"] = nameEcommerce
        console.log(data)
        axios.post("/api/search.php", data)
            .then((res) => {
                setSearchData(res.data.data)
                console.log(res)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setPanelFilter(false), 500);
    };

    return (
        <div
            className={`fixed z-50 inset-0 w-full h-full flex items-end justify-center bg-black/80 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <form onSubmit={handleSubmit(filter)} className="fixed bottom-0 w-full">
                <section className='flex w-full flex-col items-end'>
                    <IoClose
                        onClick={handleClose}
                        className='text-4xl text-white z-60 cursor-pointer'
                    />
                    <section className={`bg-white z-55 w-full flex flex-col items-center justify-start p-8 px-4 h-[65vh] max-h-[90vh] overflow-auto transition-transform duration-500 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
                        <h2 className='font-quicksand text-3xl mb-5 font-semibold'>Filtros de búsqueda</h2>
                        <section className={`${windowWidth < 500 ?"justify-around" : "justify-center"} flex items-start w-full pb-3`}>
                            <section className={`${windowWidth > 500 && "mr-12"} flex flex-col items-start`}>
                                <h3 className='font-quicksand text-xl font-semibold flex items-center justify-center mb-1'>
                                    <BiSortAlt2 className='text-orange-500 mr-1' />Ordenar por
                                </h3>
                                <Input register={register} errors={errors} watch={watch} value={"lowerPrice"} label="Menor precio" key="lowerPrice" type="radio" name="orderBy" />
                                <Input register={register} errors={errors} watch={watch} value={"higherPrice"} label="Mayor precio" key="higherPrice" type="radio" name="orderBy" />
                            </section>
                            <section className={`${windowWidth > 500 && "ml-12"} flex flex-col items-start`}>
                                <h3 className='font-quicksand text-xl font-semibold flex items-center justify-center mb-1'>
                                    <FaTag className='text-sky-600 mr-1' />Condición
                                </h3>
                                <Input register={register} errors={errors} watch={watch} label="Nuevo" value={"new"} key="new" type="radio" name="condition" />
                                <Input register={register} errors={errors} watch={watch} value={"used"} label="Usado" key="used" type="radio" name="condition" />
                            </section>
                        </section>
                        <section className='flex flex-col items-center mt-1 border-b-2 border-gray-500 w-full'>
                            <h3 className='font-quicksand text-xl font-semibold flex items-center justify-center'>
                                <FaTruck className='text-green-600 mr-1' />Envío Gratis
                            </h3>
                            <Input register={register} errors={errors} watch={watch} label={<span>Activar</span>} key="freeShipping" type="checkbox" name="freeShipping" />
                        </section>
                        <Dropdown
                            cndiv='px-3 rounded-3xl border-2 mt-7 !border-2 p-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800'
                            text="Categorías"
                            direction="u"
                            options={[
                                {
                                    type: "custom",
                                    content: (
                                        <fieldset className='flex flex-col items-start justify-center'>
                                            {dataCategories.map(e => (
                                                <Input key={e} type="radio" name="categorie" label={e} register={register} value={e} errors={errors} />
                                            ))}
                                        </fieldset>
                                    )
                                }
                            ]}
                        />
                        <Button className="w-38 mt-7 !rounded-lg" color="purple" size="md" text="Aplicar filtros" />
                    </section>
                </section>
            </form>
        </div>
    );
}