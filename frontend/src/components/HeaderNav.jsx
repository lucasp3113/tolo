import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import { IoSearch } from 'react-icons/io5';
import { MdSpaceDashboard } from 'react-icons/md';
import axios from 'axios';
import { IoSettings } from "react-icons/io5";
import logoTolo from "../assets/logoTolo.png";
import Menu from './Menu';
import Input from './Input';
import Form from './Form';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button'

export default function HeaderNav({search, setSearchData}) {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = payload.user;
    }
    axios.post("/api/type_user.php", {
      usuario: user
    })
      .then((res) => {
        setUserType(res.data.user_type);
      })
      .catch((err) => {
        console.error("Error al obtener datos del ecommerce:", err);
      });
  }, []);

  const [userType, setUserType] = useState(null);

  function functionSearch(data) {
  axios.post("/api/search.php", data)
    .then(res => {
      setSearchData(res.data.data)
      console.log(res.data.data)
    })
    .catch(err => console.log(err.response.data.message))
}

  return (
    <header className="bg-sky-800 relative h-20 shadow-2xl sm:h-12 md:h-20 lg:h-20 flex items-center justify-between">
      <img
        src={logoTolo}
        alt="Logo Tolo"
        className="w-25 md:w-25 lg:w-30"
        onClick={() => navigate("/")}
        style={{ cursor: 'pointer' }}
      />

      {search ? (
        <Form
        onSubmit={functionSearch}
        className={`!bg-transparent !shadow-none !rounded-none p-0 m-0 !outline-none !border-none  ${windowWidth < 500 ? "w-[400px]" : "w-100 absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2"}`}
        fields={[
          <Input
            key="search"
            type="text"
            name="search"
            className="pr-10 bg-white h-9 mb-3"
            icon={<Button type='submit' className={"bg-transparent -translate-y-2 translate-x-2"} text={<IoSearch className="text-2xl text-gray-600 -translate-y-[75%]" />} />}
            placeholder="Buscar"
          />
        ]}
      />
      ) : null}

      {windowWidth >= 500 && (
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
              !isLoggedIn && {
                title: 'Iniciar Sesión',
                icon: {
                  name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
                  expand: true,
                },
                animation: false,
                onClick: () => navigate('/login'),
              },
              !isLoggedIn && {
                title: 'Crear cuenta',
                icon: {
                  name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />,
                  expand: true,
                },
                animation: false,
                onClick: () => navigate('/register'),
              },
              isLoggedIn && {
                title: 'Panel',
                icon: {
                  name: <MdSpaceDashboard className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[35px]" />,
                  expand: true,
                },
                animation: false,
                onClick: () => navigate(userType === "ecommerce" ? "/ecommerce_dashboard/" : "/seller_dashboard/"),
              },
              isLoggedIn && {
                title: '',
                icon: {
                  name: <BiLogOut className="text-red-400 text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px] transition-transform ease-in-out duration-300 hover:scale-125" />,
                  expand: true,
                },
                animation: false,
                onClick: () => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("token_expiration");
                  logout();
                  navigate('/');
                },
              },
              isLoggedIn && {
                title: "",
                icon: {
                  name: <IoSettings className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[35px] transition-transform hover:scale-125 ease-in-out duration-300" />,
                  expand: false,
                },
                animation: false,
                onClick: () => navigate('/settings/'),
              },
            ].filter(Boolean)}
          />
        </nav>
      )}
    </header>
  );
}
