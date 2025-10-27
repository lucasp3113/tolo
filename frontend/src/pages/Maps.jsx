import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input';
import { FaLink } from "react-icons/fa6";
import Button from '../components/Button';
import axios from 'axios';

export default function Maps() {
    const [preview, setPreview] = useState(null);
    
    useEffect(() => {
        axios.post("/api/show_map.php", {user})
            .then(res => setPreview(res.data))
            .catch(res => console.log(res))
    }, [])

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.id_usuario;
    }

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    function save(input) {
        let clean;
        const htmlValue = input.map;
        const match = htmlValue.match(/src="([^"]+)"/);
        if (match && match[1]) {
            clean = match[1];
        } else {
            clean = input.map;
        }
        setPreview(clean)
        axios.post("/api/google_maps.php", {
            map: clean,
            user: user
        })
            .then(res => console.log(res))
            .catch(res => console.log(res))
    }

    return (
        <section className={`${width < 500 ? "flex-col" : "flex-row"} font-quicksand flex justify-start w-full items-start`}>
            <section className={`${width < 500 ? "w-full items-start justify-start" : "w-1/2 items-center justify-between"} flex flex-col p-2`}>
                <h2 className='text-xl m-auto md:text-3xl lg:text-3xl mt-3 font-semibold'>Agrega la ubicación de tu tienda</h2>
                <section className={`${width < 500 ? "w-full p-2" : "w-3/4"} flex flex-col m-auto items-start`}>
                    <p className={`text-gray-600 whitespace-nowrap mt-3 ${width < 500 ? "text-lg" : "text-xl"} font-semibold`}>
                        Paso 1: Abre Google Maps <strong className='text-gray-800'>en computadora</strong>
                    </p>
                    <p className={`text-gray-600 mt-1 ${width < 500 ? "text-lg whitespace-nowrap" : "text-xl"} font-semibold`}>
                        Paso 2: Busca la dirección de tu tienda
                    </p>
                    <p className={`text-gray-600 mt-1 ${width < 500 ? "text-lg" : "text-xl"} font-semibold`}>
                        Paso 3: Haz clic en "Compartir"
                    </p>
                    <p className={`text-gray-600 mt-1 ${width < 500 ? "text-lg whitespace-nowrap" : "text-xl"} font-semibold`}>
                        Paso 4: Selecciona "Incorporar un mapa"
                    </p>
                    <p className={`text-gray-600 mt-1 ${width < 500 ? "text-lg" : "text-xl"} font-semibold`}>
                        Paso 5: Haz clic en "Copiar HTML"
                    </p>
                    <p className={`text-gray-600 mt-1 ${width < 500 ? "text-lg" : "text-xl"} font-semibold`}>
                        Paso 6: Pégalo aquí debajo
                    </p>

                </section>
                <form className='m-auto' onSubmit={handleSubmit(save)}>
                    <Input
                        icon={<FaLink />}
                        type={"text"}
                        name={"map"}
                        className='!w-72 md:!w-100 lg:!w-100 !m-auto'
                        placeholder={"Pégalo aquí"}
                        required={true}
                        label={"HTML"}
                        register={register}
                        errors={errors}
                    />
                    <Button className={"w-50"} color={"blue"} size={"lg"} text={"Guardar"} />
                </form>
            </section>
            {preview && (
                <section className={`flex ${width < 500 ? "w-full mt-4" : "w-1/2"} flex-col mb-22`}>
                    <div className="mt-4 w-full h-[300px] md:h-[400px]">
                        <iframe
                            key={preview}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={preview}
                        ></iframe>
                    </div>
                </section>
            )}
            {!preview && width >= 500 && (
                <section className='w-1/2 flex mt-8 mr-1 m-auto border-1 border-black h-[300px]'>
                    <span className='m-auto text-2xl'>Vista previa</span>
                </section>
            )}
        </section>
    )
}
