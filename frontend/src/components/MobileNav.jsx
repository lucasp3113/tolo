import React from 'react'
import Menu from './Menu'
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

export default function MovileNav() {
    const navigate = useNavigate()
    return (
        <nav className='fixed bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-center w-full'>
            <Menu
            className='w-75'
            model3d={[]}
            elements={[
                {
                    title: 'Inicio',
                    icon: {
                        name: <FaHome className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
                        expand: true,
                    },
                    animation: false,
                    onClick: () => navigate('/'),
                },
                {
                    title: 'Iniciar Sesión',
                    icon: {
                        name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
                        expand: true,
                    },
                    animation: false,
                    onClick: () => navigate('/login'),
                },
                {
                    title: 'Crear cuenta',
                    icon: {
                        name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
                        expand: true,
                    },
                    animation: false,
                    onClick: () => navigate('/register'),
                },
            ]}
        />
        </nav>
    )
}
