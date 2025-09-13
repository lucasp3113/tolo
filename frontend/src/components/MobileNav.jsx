import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import Menu from './Menu';
import { MdSpaceDashboard } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import { IoSettings } from "react-icons/io5";
import axios from 'axios';
import Dropdown from './Dropdown';
import ClipLoader from "react-spinners/ClipLoader";
import { TiShoppingCart } from "react-icons/ti";

export default function MovileNav() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    let user = null;
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user;
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }

    axios.post('/api/type_user.php', { usuario: user })
      .then((res) => {
        setUserType(res.data.user_type?.toLowerCase());
      })
      .catch((err) => {
        console.error('Error al obtener datos del usuario:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-sky-800 flex justify-center items-center h-20">
        <ClipLoader size={40} color="#fff" />
      </div>
    );
  }

  return (
    <nav className="fixed h-22 bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-between w-full px-4">
      <Menu
        className="w-full max-w-md flex justify-center"
        model3d={[]}
        elements={[
          {
            title: 'Inicio',
            url: '/',
            icon: {
              name: <FaHome className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/'),
          },
          !isLoggedIn && {
            title: 'Iniciar Sesión',
            url: '/login',
            icon: {
              name: <FaUserCircle className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/login'),
          },
          !isLoggedIn && {
            title: 'Crear cuenta',
            url: '/register',
            icon: {
              name: <FaUserPlus className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/register'),
          },
          isLoggedIn && userType && {
            title: userType === 'ecommerce' || userType === 'vendedor_particular' ? 'Panel de control' : "Carrito",
            icon: {
              name: userType === 'ecommerce' || userType === 'vendedor_particular' ? <MdSpaceDashboard className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" /> : <TiShoppingCart className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => {
              if (userType === 'ecommerce') {
                navigate('/ecommerce_dashboard/');
              } else if (userType === 'cliente') {
                navigate('/shopping_cart/');
              } else {
                navigate('/seller_dashboard/');
              }
            },
          },
          isLoggedIn && {
            title: 'Ajustes',
            icon: {
              name: <IoSettings className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[35px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/settings/'),
          },
          isLoggedIn && {
            title: 'Cerrar sesión',
            icon: {
              name: <BiLogOut className="text-red-400 text-[35px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('token_expiration');
              logout();
              navigate('/');
            },
          },
        ].filter(Boolean)}
      />
    </nav>
  );
}
