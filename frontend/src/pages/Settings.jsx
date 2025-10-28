import React, { useState, useContext, useEffect } from 'react';
import Card from '../components/Card';
import { FaUser, FaSun } from "react-icons/fa";
import { IoMoon, IoNotifications } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { DarkModeContext } from '../context/DarkModeContext';
import { FaInfoCircle } from "react-icons/fa";
import { FaHeadset } from "react-icons/fa6";
import { IoBagHandleSharp } from "react-icons/io5";
import { FaHome } from 'react-icons/fa';
import { FaRegCreditCard } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaOpencart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { IoColorPalette } from "react-icons/io5";
import { SiGo, SiGooglemaps } from "react-icons/si";
import axios from 'axios';


export default function Settings() {
    const { ecommerce } = useParams()
    const [width, setWidth] = useState(window.innerWidth)

    const navigate = useNavigate()
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth)
        })
    })

    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [isOn, setIsOn] = useState(isDarkMode);

    const toggleSwitch = () => {
        setIsOn(!isOn);
        toggleDarkMode();
    };

    const [perfil, setPerfil] = useState(false)
    const [custom, setCustom] = useState(false)
    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }

    const [typeUser, setTypeUser] = useState(null)
    const [isItAGoogleAccount, setIsItAGoogleAccount] = useState(null)

    useEffect(() => {
        axios.post("/api/is_it_a_google_account.php", {
            usuario: user
        })
            .then((res) => {
                setIsItAGoogleAccount(res.data.is);
            })
            .catch((err) => console.log(err))

        axios.post("/api/type_user.php", {
            usuario: user
        })
            .then((res) => {
                console.log(res)
                setTypeUser(res.data.user_type);
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <Card className={`${width < 500 ? "w-full" : "w-122 m-auto"} !shadow-none !border-none !rounded-none`}>
            <h1 className='text-3xl mb-5 font-quicksand text-gray-900  font-semibold'>
                Ajustes
            </h1>
            {(perfil || custom) && (
                <div
                    onClick={() => {
                        if (custom) {
                            setCustom(false);
                        } else if (perfil) {
                            setPerfil(false);
                        }
                    }}
                    className="flex items-center justify-start -translate-y-6 -translate-x-6"
                >
                    <IoReturnUpBack className="w-18 mr-2 text-[40px]" />
                </div>
            )}

            <ul className={`${perfil && "-translate-y-5"} mb-22
                 flex flex-col items-start justify-start`}>
                {perfil ? (
                    <>
                        {!isItAGoogleAccount && (
                            <>
                                <li onClick={() => ecommerce ? navigate(`/${ecommerce}/change_user/`) : navigate("/change_user/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <FaUser className="text-green-600 mr-2 text-[30px]" />
                                        <h2 className="text-[20px]">Cambiar nombre de usuario</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                                <li onClick={() => ecommerce ? navigate(`/${ecommerce}/change_password/`) : navigate("/change_password/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <FaLock className="text-amber-400 mr-2 text-[30px]" />
                                        <h2 className="text-[20px]">Cambiar contraseña</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                            </>
                        )}
                        {typeUser === 'ecommerce' && (
                            <>
                                <li onClick={() => {
                                    setCustom(true)
                                    setPerfil(false)
                                }} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <IoColorPalette className="text-red-600 mr-2 text-[30px]" />
                                        <h2 className="text-[20px]">Personalizar tienda</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                                <li onClick={() => ecommerce ? navigate(`/${ecommerce}/profile_picture/`) : navigate("/profile_picture/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <FaUserCircle className="text-indigo-500 mr-2 text-[30px]" />
                                        <h2 className="text-[20px]">Añadir/Cambiar foto de perfil</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                                <li onClick={() => ecommerce ? navigate(`/${ecommerce}/maps/`) : navigate("/maps/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <SiGooglemaps className="text-sky-400 mr-2 text-[30px]" />
                                        <h2 className="text-[20px]">Agregar ubicación de la tienda</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                                <li onClick={() => ecommerce ? navigate(`/${ecommerce}/change_ecommerce/`) : navigate("/change_ecommerce/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                    <div className="flex items-center justify-center ">
                                        <FaOpencart className="text-red-500 mr-3 ml-2 text-[20px] scale-150" />
                                        <h2 className='text-[20px] whitespace-nowrap'>Cambiar nombre de la tienda</h2>
                                    </div>
                                    <p><IoIosArrowForward /></p>
                                </li>
                            </>
                        )}
                    </>
                ) : custom ? (
                    <>
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}/customize_home/`) : navigate("/customize_home/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <FaHome className="text-black mr-2 text-[30px]" />
                                <h2 className="text-[20px]">Personalizar Inicio</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}/customize_store/`) : navigate("/customize_store/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <IoColorPalette className="text-red-600 mr-2 text-[30px]" />
                                <h2 className="text-[20px]">Personalizar colores</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                    </>
                ) : (
                    <>
                        {isItAGoogleAccount && typeUser !== 'ecommerce' ? (
                            null
                        ) : (
                            <li onClick={() => setPerfil(true)} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                                <div className="flex items-center justify-center ">
                                    <FaUser className="text-amber-400 mr-2 text-[30px]" />
                                    <h2 className="text-[20px]">Perfil</h2>
                                </div>
                                <p><IoIosArrowForward /></p>
                            </li>
                        )}
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}/shopping_cart/`) : navigate("/shopping_cart/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <TiShoppingCart className="text-indigo-500 mr-2 text-[30px] scale-130" />
                                <h2 className="text-[20px]">Carrito</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}/notifications/`) : navigate("/notifications/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <IoNotifications className="text-sky-800 -translate-x-1 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Notificaciones</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}`) : navigate("/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[22px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <FaHome className="text-amber-700 -translate-x-1 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Home</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>

                        <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center">
                                <IoMoon className="text-violet-600 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Modo oscuro</h2>
                            </div>
                            <button
                                onClick={toggleSwitch}
                                className={`
                            relative inline-flex items-center h-8 w-16 rounded-full transition-transform duration-300 ease-in-out
                            ${isOn ? 'bg-blue-900 shadow-lg shadow-blue-900/50' : 'bg-yellow-400 shadow-lg shadow-yellow-400/50'}
                        `}
                            >
                                <span
                                    className={`
                                h-7 w-7  rounded-full bg-white transition-transform duration-300 ease-in-out
                                flex items-center justify-center shadow-md
                                ${isOn ? 'translate-x-8' : 'translate-x-1'}
                            `}
                                >
                                    {isOn ? (
                                        <IoMoon className="h-5 w-8 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-900 transition-all duration-300" />
                                    ) : (
                                        <FaSun className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500 transition-all duration-300" />
                                    )}
                                </span>
                            </button>
                        </li>
                        <li onClick={() => ecommerce ? navigate(`/${ecommerce}/payments_history/`) : navigate("/payments_history/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <IoBagHandleSharp className="text-green-500 -translate-x-1 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Tus compras</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                        <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <FaHeadset className="text-red-400 -translate-x-1 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Contáctanos</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                        <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                            <div className="flex items-center justify-center ">
                                <FaInfoCircle className="text-gray-400 -translate-x-1 mr-2 text-[35px]" />
                                <h2 className="text-[20px]">Politica de privacidad</h2>
                            </div>
                            <p><IoIosArrowForward /></p>
                        </li>
                    </>
                )}
            </ul>
        </Card >
    );
}