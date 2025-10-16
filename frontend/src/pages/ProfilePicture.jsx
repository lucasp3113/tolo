import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import axios from 'axios'
import { FaCircleUser } from "react-icons/fa6";
import Button from '../components/Button';

export default function ProfilePicture() {
    const [profilePicture, setProfilePicture] = useState(null)
    const [preview, setPreview] = useState(null)

    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }
    useEffect(() => {
        axios.post("/api/show_profile_picture.php", { user })
            .then((res) => {
                setProfilePicture(res.data.logo.logo)
                console.log(res)
            })
            .catch((err) => console.log(err))
    }, [user])

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const watchedFile = watch("profilePicture")
    useEffect(() => {
        if (watchedFile && watchedFile[0]) {
            const file = watchedFile[0]
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [watchedFile])

    function submitProfilePicture(data) {
        const formData = new FormData()
        if (data.profilePicture && data.profilePicture[0]) {
            formData.append("profilePicture", data.profilePicture[0])
            formData.append("user", user)

            axios.post("/api/upload_profile_picture.php", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res => {
                setProfilePicture(res.data.logo.logo)
                console.log(res)
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <section>
            <h2 className='font-quicksand font-semibold text-3xl mt-3'>Foto de perfil</h2>
            <div className="my-4">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full m-auto" />
                ) : profilePicture ? (
                    <img src={`/api/${profilePicture}`} alt="Perfil" className="w-32 h-32 object-cover rounded-full m-auto" />
                ) : (
                    <FaCircleUser className='text-8xl m-auto mt-4 text-gray-500' />
                )}
            </div>
            <form 
                onSubmit={handleSubmit(submitProfilePicture)}
                className='w-85 mb-100 m-auto mt-8 bg-white p-3 shadow rounded-xl'>
                <div className="flex flex-col mt-3 ml-3 items-start">
                    <h2 className='font-quicksand text-2xl font-bold'>Agregar/cambiar foto de perfil</h2>
                    <p className="text-sm text-gray-600">Completá el formulario para agregar/cambiar tu foto de perfil.</p>
                </div>
                <Input
                    type="file"
                    name="profilePicture"
                    label="Foto de perfil"
                    register={register}
                    errors={errors}
                    multiple={false}
                    required={true}
                    accept=".png,.jpg,.jpeg"
                />
                <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
            </form>
        </section>
    )
}
