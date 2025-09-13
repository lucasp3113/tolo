import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'

export default function ChangeUser() {
    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }
    function changeUserExecute(data) {
        axios.post("/api/change_user.php", {
            passwordCurrent: data["passwordCurrent"],
            userNew: data["userNew"],
            userCurrent: user
        })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                const message = err.response.data.message
                if (message === "Contraseña incorrecta") {
                    setError("passwordCurrent", {
                        type: "manual",
                        message: message
                    })
                }
            })
    }
    const { register, handleSubmit, formState: { errors }, setError } = useForm()
    return (
        <form
            onSubmit={handleSubmit(changeUserExecute)}
            className="w-85 mb-52 m-auto mt-12 bg-white p-4 shadow rounded-xl">
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-quicksand text-2xl font-bold'>Cambiar nombre de usuario</h2>
                <p className="text-sm text-gray-600">Completá el formulario para cambiar tu nombre de usuario.</p>
            </div>
            <Input
                key="passwordCurrent"
                type="password"
                name="passwordCurrent"
                placeholder="Contraseña"
                required={true}
                register={register}
                errors={errors}
                label={"Contraseña"}
            />
            <Input
                label={"Usuario nuevo"}
                name={"userNew"}
                placeholder={"Usuario nuevo"}
                required={true}
                register={register}
                errors={errors}
                minLength={3}
                maxLength={15}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
        </form>
    )
}
