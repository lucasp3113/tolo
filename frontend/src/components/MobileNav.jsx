import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import Menu from './Menu';
import { MdSpaceDashboard } from "react-icons/md";


export default function MovileNav() {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem("token_expiration");
    const now = Math.floor(Date.now() / 1000);

    if (!expirationTime || now > parseInt(expirationTime)) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      setIsTokenValid(false);
    } else {
      setIsTokenValid(true);
    }
  }, []);

  const elements = [
    {
      title: 'Inicio',
      url: "/",
      icon: {
        name: <FaHome className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => navigate('/')
    },
    !isTokenValid && {
      title: 'Iniciar Sesión',
      url: "/login",
      icon: {
        name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => navigate('/login'),
    },
    !isTokenValid && {
      title: 'Crear cuenta',
      url: "/register",
      icon: {
        name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => navigate('/register'),
    },
    isTokenValid && {
      title: 'Penel de control',
      icon: {
        name: <MdSpaceDashboard className="text-white text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => {
        navigate('/seller_dashboard');
      }
    },
    isTokenValid && {
      title: 'Cerrar sesión',
      icon: {
        name: <BiLogOut className="text-white text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiration");
        setIsTokenValid(false);
        navigate('/');
      }
    },
  ].filter(Boolean);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-center w-full">
      <Menu className="w-75" model3d={[]} elements={elements} />
    </nav>
  );
}
