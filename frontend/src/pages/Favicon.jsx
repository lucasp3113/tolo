import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import axios from 'axios'
import Button from '../components/Button'

export default function CustomHouse() {
    const [favicon, setFavicon] = useState(null)
    const [preview, setPreview] = useState(null)

    let user = null
    const token = localStorage.getItem("token")
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        user = payload.user
    }

    useEffect(() => {
        axios.post("/api/show_favicon.php", { user })
            .then((res) => {
                setFavicon(res.data.img.favicon)
                console.log(res)
            })
            .catch((err) => console.log(err))
    }, [user])

    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm()
    const watchedFile = watch("favicon")
    useEffect(() => {
        if (watchedFile && watchedFile[0]) {
            const file = watchedFile[0]
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [watchedFile])

    function submitImageFavicon(data) {
        const formData = new FormData();
        if (data.favicon && data.favicon[0]) {
            formData.append("favicon", data.favicon[0]);
            formData.append("user", user);
            axios.post("/api/upload_favicon.php", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => {
                    setFavicon(res.data.favicon);
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.message) {
                        setError("favicon", { type: "manual", message: err.response.data.message });
                    } else {
                        setError("favicon", { type: "manual", message: "Error al subir el archivo" });
                    }
                    console.log(err);
                })
        }
    }


    return (
        <section className='relative w-screen min-h-screen flex flex-col items-center justify-start bg-whiteoverflow-hidden'>
            <h2 className='font-quicksand font-bold text-xl md:text-3xl text-center text-black drop-shadow-lg max-w-2xl mt-8'>
                Agregar/cambiar Favicon
            </h2>
            <p className='text-md font-medium font-quicksand text-gray-600'>Recuerda subir un archivo con extensión ico</p>
            <div className="">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-62 h-62 object-cover rounded-full m-auto" />
                ) : favicon ? (
                    <img src={`/api/${favicon}`} alt="Perfil" className="w-32 h-32 object-cover rounded-full m-auto" />
                ) : null}
            </div>

            <div className='relative z-50 flex md:translate-y-0 flex-col items-center w-full mt-4 px-4'>

                <form
                    onSubmit={handleSubmit(submitImageFavicon)}
                    className='w-full p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white flex flex-col items-center'
                >
                    <Input
                        type="file"
                        name="favicon"
                        label="Seleccionar Imagen"
                        register={register}
                        errors={errors}
                        multiple={false}
                        required={true}
                    />
                    <Button className="w-62 mt-6" color="blue" size="md" text="Guardar" />
                </form>
            </div>
        </section>
    )
}
