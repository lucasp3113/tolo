import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import Menu from './Menu';
import { MdSpaceDashboard } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function MovileNav() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    let user = null;
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = payload.user;
    }

    axios.post('/api/type_user.php', { usuario: user })
      .then((res) => {
        setUserType(res.data.user_type);
        console.log(res);
      })
      .catch((err) => {
        console.error('Error al obtener datos del ecommerce:', err);
      });
  }, []);

  return (
    <nav className="fixed h-22 bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-center w-full">
      <Menu
        className="w-75"
        model3d={[]}
        elements={[
          {
            title: 'Inicio',
            url: '/',
            icon: {
              name: <FaHome className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/'),
          },
          !isLoggedIn && {
            title: 'Iniciar Sesión',
            url: '/login',
            icon: {
              name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/login'),
          },
          !isLoggedIn && {
            title: 'Crear cuenta',
            url: '/register',
            icon: {
              name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/register'),
          },
          isLoggedIn && {
            title: 'Panel de control',
            icon: {
              name: <MdSpaceDashboard className="text-white text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px]" />,
              expand: true,
            },
            animation: false,
            onClick: () => {
              navigate(userType === 'ecommerce' ? '/ecommerce_dashboard/' : '/seller_dashboard/');
            },
          },
          isLoggedIn && {
            title: 'Cerrar sesión',
            icon: {
              name: <BiLogOut className="text-red-400 text-[35px] sm:text-[15px] md:text-[30px] lg:text-[35px]" />,
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
