import React from 'react';
import logoTolo from "../assets/logoTolo.png"
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import Model3D from '../components/Model3D';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';

export default function HeaderNav() {
  const navigate = useNavigate();

  return (
    <header className="bg-sky-800 h-20 shadow-2xl sm:h-12 md:h-20 lg:h-32 flex items-center justify-between">
      <img src={logoTolo} onClick={() => navigate("/")}/>
      <Menu
        model3d={[]}
        elements={[
          {
            title: 'Inicio',
            icon: {
              name: (
                <FaHome className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />
              ),
              
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/'),
          },
          {
            title: 'Iniciar Sesión',
            icon: {
              name: (
                <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/login'),
          },
          {
            title: 'Crear cuenta',
            icon: {
              name: (
                <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () => navigate('/register'),
          },
        ]}
      />
    </header>
  );
}
