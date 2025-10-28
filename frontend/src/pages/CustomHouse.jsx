import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import axios from 'axios'
import Button from '../components/Button'

export default function CustomHouse() {
    const [imageHome, setImageHome] = useState(null)
    const [preview, setPreview] = useState(null)

    let user = null
    const token = localStorage.getItem("token")
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        user = payload.user
    }

    useEffect(() => {
        axios.post("/api/show_image_home.php", { user })
            .then((res) => {
                setImageHome(res.data.img.home)
                console.log(res)
            })
            .catch((err) => console.log(err))
    }, [user])

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const watchedFile = watch("imageHome")
    useEffect(() => {
        if (watchedFile && watchedFile[0]) {
            const file = watchedFile[0]
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [watchedFile])

    function submitImageHome(data) {
        const formData = new FormData()
        if (data.imageHome && data.imageHome[0]) {
            formData.append("imageHome", data.imageHome[0])
            formData.append("user", user)
            axios.post("/api/upload_image_home.php", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => setImageHome(res.data.home))
                .catch(err => console.log(err))
        }
    }

    return (
        <section className='relative w-screen min-h-screen flex flex-col items-center justify-start bg-whiteoverflow-hidden'>
            <h2 className='font-quicksand font-bold text-xl md:text-3xl text-center text-black mb-8 drop-shadow-lg max-w-2xl mt-8'>
                    Agregar/cambiar foto que se muestra en el inicio del sitio web (Home)
                </h2>
            <div className="">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-62 h-62 object-cover rounded-full m-auto" />
                ) : imageHome ? (
                    <img src={`/api/${imageHome}`} alt="Perfil" className="w-62 h-62 object-cover rounded-full m-auto" />
                ) : null}
            </div>

            <div className='relative z-50 flex md:translate-y-0 flex-col items-center w-full mt-4 px-4'>

                <form
                    onSubmit={handleSubmit(submitImageHome)}
                    className='w-full p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white flex flex-col items-center'
                >
                    <Input
                        type="file"
                        name="imageHome"
                        label="Seleccionar Imagen"
                        register={register}
                        errors={errors}
                        multiple={false}
                        required={true}
                        accept=".png,.jpg,.jpeg,.webp"
                    />
                    <Button className="w-62 mt-6" color="blue" size="md" text="Guardar" />
                </form>
            </div>
        </section>
    )
}
