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
import { useNavigate } from 'react-router-dom';

export default function Settings() {
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

    return (
        <Card className={`${width < 500 ? "w-full" : "w-100 m-auto"} !shadow-none !border-none !rounded-none`}>
            <h1 className='text-3xl mb-5 font-quicksand text-gray-900  font-semibold'>
                Ajustes
            </h1>
            <ul className='flex flex-col items-start justify-start'>
                <li onClick={() => navigate("/change_password/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <FaUser className="text-amber-400 mr-2 text-[30px]" />
                        <h2>Perfil</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>

                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <IoNotifications className="text-sky-800 -translate-x-1 mr-2 text-[35px]" />
                        <h2>Notificaciones</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>
                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <FaRegCreditCard className="text-red-700 mr-2 text-[30px]" />
                        <h2>Métodos de pago</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>
                <li onClick={() => navigate("/")} className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[22px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <FaHome className="text-amber-700 -translate-x-1 mr-2 text-[35px]" />
                        <h2>Home</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>

                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center">
                        <IoMoon className="text-violet-600 mr-2 text-[35px]" />
                        <h2>Modo oscuro</h2>
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
                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <IoBagHandleSharp className="text-green-500 -translate-x-1 mr-2 text-[35px]" />
                        <h2>Tus compras</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>
                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <FaHeadset className="text-red-400 -translate-x-1 mr-2 text-[35px]" />
                        <h2>Contáctanos</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>
                <li className='flex cursor-pointer items-center justify-between mt-2 w-full mb-5 font-quicksand font-semibold text-[20px] text-gray-900 '>
                    <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <FaInfoCircle className="text-gray-400 -translate-x-1 mr-2 text-[35px]" />
                        <h2>Politica de privacidad</h2>
                    </div>
                    <p><IoIosArrowForward /></p>
                </li>
            </ul>
        </Card>
    );
}