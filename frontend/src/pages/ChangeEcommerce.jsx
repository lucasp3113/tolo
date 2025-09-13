import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'

export default function ChangeEcommerce() {
    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }
    function changeEcommerceExecute(data) {
        axios.post("/api/change_ecommerce.php", {
            passwordCurrent: data["passwordCurrent"],
            ecommerceNew: data["ecommerceNew"],
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
            onSubmit={handleSubmit(changeEcommerceExecute)}
            className="w-85 mb-52 m-auto mt-12 bg-white p-4 shadow rounded-xl">
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-quicksand text-2xl font-bold'>Cambiar nombre de ecommerce</h2>
                <p className="text-sm text-gray-600">Completá el formulario para cambiar el nombre de tu ecommerce.</p>
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
                label={"Ecommerce nuevo"}
                name={"ecommerceNew"}
                placeholder={"Ecommerce nuevo"}
                required={true}
                register={register}
                errors={errors}
                maxLength={25}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
        </form>
    )
}
