import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import Menu from './Menu';
import { MdSpaceDashboard } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';


export default function MovileNav() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);


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
    !isLoggedIn && {
      title: 'Iniciar Sesión',
      url: "/login",
      icon: {
        name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => navigate('/login'),
    },
    !isLoggedIn && {
      title: 'Crear cuenta',
      url: "/register",
      icon: {
        name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => navigate('/register'),
    },
    isLoggedIn && {
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
    isLoggedIn && {
      title: 'Cerrar sesión',
      icon: {
        name: <BiLogOut className="text-red-400 text-[35px] sm:text-[15px] md:text-[30px] lg:text-[35px]" />,
        expand: true,
      },
      animation: false,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiration");
        logout()
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
