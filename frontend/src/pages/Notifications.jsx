import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { IoNotifications } from "react-icons/io5";
import { IoNotificationsOffSharp } from "react-icons/io5";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";

export default function Notifications() {
    function remove(id) {
        axios.post("/api/delete_notification.php", {
            idNotificacion: id
        })
        setNotifications(prevNotificactions => prevNotificactions.filter(n => n.id_notificacion !== id));
    }

    const [notifications, setNotifications] = useState([]);
    let userId = null
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id_usuario
    }

    // Estilos según tipo de notificación
    const typeStyles = {
        success: "border-green-300 bg-green-50 text-green-800",
        info: "border-blue-300 bg-blue-50 text-blue-800",
        warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
        default: "border-gray-300 bg-gray-50 text-gray-800"
    };

    // Traer notificaciones desde PHP
    useEffect(() => {
        axios
            .get(`/api/notifications.php?id_usuario=${userId}`)
            .then((res) => {
                setNotifications(res.data.notificaciones);
                console.log(res)
            })
            .catch((err) => {
                console.error("Error al traer notificaciones:", err);
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-center">
                <IoNotifications className="text-amber-400 font-quicksand text-3xl" />
                Notificaciones
            </h2>

            {notifications.length > 0 ? (
                <div className="w-full md:w-1/2 lg:w-1/2 space-y-4">
                    {notifications.map((n, i) => (
                        <Card
                            key={n.id || i}
                            className={`flex !rounded-lg items-center !m-0 gap-3 border hover:shadow-lg`}
                        >
                            <IoNotifications className="text-xl mt-1 flex-shrink-0" />
                            <div className="flex w-full items-center justify-between">
                                <p className="text-md font-quicksand font-semibold">{n.mensaje}</p>
                                <FaRegTrashCan onClick={() => remove(n.id_notificacion)} className='text-red-600 text-2xl transition-transform duration-300 ease-in-out hover:scale-120' />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-start m-auto h-full -translate-y-34">
                    <IoNotificationsOffSharp className="text-6xl text-gray-300 mb-4" />
                    <p className="text-gray-400 text-xl font-semibold text-center">
                        No tienes notificaciones
                    </p>
                </div>
            )}
        </div>
    );
}