import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function MovileNav({color}) {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { ecommerce: ecommerceName } = useParams()
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(isLoggedIn);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    <nav style={{ backgroundColor: color || "#075985" }} className={`${windowWidth < 400 ? "h-16" : "h-22"} fixed bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-between w-full px-4`}>
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
            onClick: () => ecommerceName ? navigate(`/${ecommerceName}/`) : navigate("/")
          },
          !isLoggedIn && {
            title: 'Iniciar Sesión',
            url: '/login',
            icon: {
              name: <FaUserCircle className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => ecommerceName ? navigate(`/${ecommerceName}/login/`) : navigate('/login')
          },
          !isLoggedIn && {
            title: 'Crear cuenta',
            url: '/register',
            icon: {
              name: <FaUserPlus className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => ecommerceName ? navigate(`/${ecommerceName}/register/`) : navigate('/register'),
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
                ecommerceName ? navigate(`/${ecommerceName}/ecommerce_dashboard/`) : navigate('/ecommerce_dashboard/');
              } else if (userType === 'cliente') {
                ecommerceName ? navigate(`/${ecommerceName}/shopping_cart/`) : navigate('/shopping_cart/');
              } else {
                ecommerceName ? navigate(`/${ecommerceName}/seller_dashboard/`) : navigate('/seller_dashboard/');
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
            onClick: () => ecommerceName ? navigate(`/${ecommerceName}/settings/`) : navigate('/settings/')
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
              ecommerceName ? navigate(`/${ecommerceName}/`) : navigate('/');
            },
          },
        ].filter(Boolean)}
      />
    </nav>
  );
}
