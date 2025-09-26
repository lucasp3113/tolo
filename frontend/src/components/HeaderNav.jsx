import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Button from '../components/Button';
import { CiSliderHorizontal } from 'react-icons/ci';
import { TiShoppingCart } from "react-icons/ti";
import Model3D from '../components/Model3D';

export default function HeaderNav({ search, setSearchData, setPanelFilter, setDataCategories, setWord, logo = true, setUserTypeForAdmin }) {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [logoEcommerce, setLogoEcommerce] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoAspectRatio, setLogoAspectRatio] = useState(1);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const { ecommerce: nameEcommerce } = useParams();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload.user);
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!user) return;
    axios.post("/api/type_user.php", { usuario: user })
      .then((res) => {
        setUserType(res.data.user_type?.toLowerCase())
        setUserTypeForAdmin && setUserTypeForAdmin(res.data.user_type)
      })
  }, [user]);

  useEffect(() => {
    if (!nameEcommerce) return;
    axios.post("/api/show_profile_picture.php", { nameEcommerce })
      .then(res => {
        setLogoEcommerce(res.data.logo);
        console.log(res)
      })
      .catch(err => console.error(err));
  }, [nameEcommerce]);

  useEffect(() => {
    if (!logoEcommerce) return;
    const img = new Image();
    img.onload = () => {
      setLogoAspectRatio(img.width / img.height);
      setLogoLoaded(true);
    };
    img.src = `/api/${logoEcommerce}`;
  }, [logoEcommerce]);

  const [dataForm, setDataForm] = useState(null);
  useEffect(() => {
    if (!dataForm) return;
    dataForm["nameEcommerce"] = nameEcommerce || null;
    axios.post("/api/search.php", dataForm)
      .then(res => {
        setWord(dataForm.search);
        setSearchData(res.data.data);
        console.log(res)
        const categories = [];
        res.data.data?.forEach(e => {
          if (!categories.includes(e.nombre_categoria)) categories.push(e.nombre_categoria);
        });
        setShowFilter(true);
        setDataCategories(categories);
      })
      .catch(err => console.log(err));
  }, [dataForm]);

  return (
    <header className="bg-sky-800 relative h-20 sm:h-12 md:h-20 lg:h-20 flex items-center justify-between">
      {logo ? (
        <div
          className="flex items-center justify-center w-24 h-full sm:w-32 sm:h-16 md:w-25 lg:w-25 md:h-full cursor-pointer"
          onClick={() => nameEcommerce ? navigate(`/${nameEcommerce}/`) : navigate("/")}
        >
          {logoLoaded ? (
            <img
              src={logoEcommerce ? `/api/${logoEcommerce}` : logoTolo}
              alt="Logo"
              loading="lazy"
              className={`${!logoEcommerce && "scale-200"} ml-2 w-full h-full object-contain`}
            />
          ) : (
            <img src={logoTolo} alt="Logo" className="w-full scale-200 h-full object-contain" />
          )}
        </div>

      ) : (
        <section className={`flex items-center w-full ${windowWidth < 500 ? "justify-center" : "justify-start"}`}>
          <h1 className={`font-quicksand text-2xl text-white font-black ${windowWidth ? "ml-2" : ""}`}>Tu carrito</h1>
          <Model3D
            src="/models/carrito.glb"
            className="w-22 h-16"
            cameraOrbit="90deg 90deg 16m"
            autoRotate={true}
            onClick={() => console.log("clic en modelo 3D")}
          />
        </section>
      )}
      {search && (
        <>
          <Form
            onSubmit={(data) => setDataForm(data)}
            className={`!bg-transparent !shadow-none !rounded-none p-0 m-0 !outline-none !border-none  ${windowWidth < 500 ? `${showFilter ? "!w-[70vw]" : ""} -translate-x-3 max-w-[80vw]` : "w-100 absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2"}`}
            fields={[
              <Input
                key="search"
                type="text"
                name="search"
                className="pr-10 bg-white h-9 mb-3 focus:outline-none"
                icon={
                  <Button type='submit' className="bg-transparent -translate-y-2 translate-x-2 shadow-none" text={<IoSearch className="text-2xl text-gray-600 -translate-y-[75%]" />} />
                }
                placeholder="Buscar"
              />
            ]}
          />
          {showFilter && (
            <Button
              onClick={() => setPanelFilter(true)}
              type='text'
              color="blue"
              size="lg"
              className={`!bg-transparent ${windowWidth < 500 ? windowWidth < 400 ? "-translate-x-9" : "-translate-x-8" : "absolute top-[50%] left-1/2 -translate-x-58 -translate-y-1/2 "} !shadow-none !rounded-none !m-0 !text-2xl`}
              text={<CiSliderHorizontal className='text-4xl' />}
            />
          )}
        </>
      )}
      {windowWidth >= 500 && (
        <nav>
          <Menu
            model3d={[]}
            elements={[
              {
                title: 'Inicio',
                icon: { name: <FaHome className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />, expand: true },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/`) : navigate('/'),
              },
              !isLoggedIn && {
                title: 'Iniciar Sesión',
                icon: { name: <FaUserCircle className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />, expand: true },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/login/`) : navigate('/login'),
              },
              !isLoggedIn && {
                title: 'Crear cuenta',
                icon: { name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />, expand: true },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/register/`) : navigate('/register'),
              },
              isLoggedIn && userType && {
                title: userType === 'ecommerce' || userType === 'vendedor_particular' ? 'Panel de control' : "Carrito",
                icon: {
                  name: userType === 'ecommerce' || userType === 'vendedor_particular'
                    ? <MdSpaceDashboard className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />
                    : <TiShoppingCart className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />,
                  expand: true
                },
                animation: false,
                onClick: () => {
                  if (userType === "ecommerce") nameEcommerce ? navigate(`/${nameEcommerce}/ecommerce_dashboard/`) : navigate("/ecommerce_dashboard/");
                  else if (userType === "cliente") nameEcommerce ? navigate(`/${nameEcommerce}/shopping_cart/`) : navigate("/shopping_cart/");
                  else nameEcommerce ? navigate(`/${nameEcommerce}/seller_dashboard/`) : navigate("/seller_dashboard/");
                },
              },
              isLoggedIn && {
                title: '',
                icon: { name: <BiLogOut className="text-red-400 text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px] transition-transform ease-in-out duration-300 hover:scale-125" />, expand: true },
                animation: false,
                onClick: () => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("token_expiration");
                  logout();
                  nameEcommerce ? navigate(`/${nameEcommerce}/`) : navigate('/');
                },
              },
              isLoggedIn && {
                title: "",
                icon: { name: <IoSettings className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[35px] transition-transform hover:scale-125 ease-in-out duration-300" />, expand: false },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/settings/`) : navigate('/settings/'),
              },
            ].filter(Boolean)}
          />
        </nav>
      )}
    </header>
  );
}
