import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';

import logoTolo from "../assets/logoTolo.png";
import Menu from './Menu';
import Input from './Input';
import Form from './Form';

export default function HeaderNav() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-sky-800 relative h-20 shadow-2xl sm:h-12 md:h-20 lg:h-32 flex items-center justify-between">
      <img
        src={logoTolo}
        alt="Logo Tolo"
        className="w-25 md:w-25 lg:w-30"
        onClick={() => navigate("/")}
        style={{ cursor: 'pointer' }}
      />
      {windowWidth >= 500 ? (
        <>
          <Form
            className="!bg-transparent !shadow-none !rounded-none p-0 m-0 !outline-none !border-none w-100 absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 "
            fields={[
              <Input
                key="search"
                type="text"
                name="search"
                className="pr-10 bg-white h-9 mb-3"
                icon={<IoSearch className="text-2xl text-gray-600 -translate-y-[75%]" />}
                placeholder="Buscar"
              />
            ]}
          />
          <nav>
            <Menu
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
        </>
      ) : null}
    </header>
  );
}
