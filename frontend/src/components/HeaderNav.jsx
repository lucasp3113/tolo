import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHome, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import { IoSearch } from 'react-icons/io5';
import { MdSpaceDashboard } from 'react-icons/md';
import axios from 'axios';
import { IoSettings } from "react-icons/io5";
import logoTolo from "../assets/logoTolo.webp";
import Menu from './Menu';
import Input from './Input';
import Form from './Form';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { CiSliderHorizontal } from 'react-icons/ci';
import { TiShoppingCart } from "react-icons/ti";
import Model3D from '../components/Model3D';

export default function HeaderNav({ search, setSearchData, setPanelFilter, setDataCategories, setWord, logo = true, setUserTypeForAdmin, color, setLoading, fixed, setContextGoodContrast }) {
  const [goodContrast, setGoodContrast] = useState(true);
  const [goodContrast2, setGoodContrast2] = useState(true);
  function hasGoodContrast(color1, color2, threshold = 1.1) {
    if (!color1 || !color2) return true;

    const getLuminance = (hex) => {
      if (!hex || !hex.startsWith('#')) return 0;

      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const contrast = (brightest + 0.05) / (darkest + 0.05);

    return contrast >= threshold;
  }

  

  useEffect(() => {
    setContextGoodContrast(hasGoodContrast('#FFFFFF', color, 1.45))
    if (color) {
      setGoodContrast(hasGoodContrast('#f87171', color, 1.45));
      setGoodContrast2(hasGoodContrast('#FFFFFF', color, 1.45));
    }
  }, [color]);

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
    if (!nameEcommerce) {
      setLogoEcommerce(null); 
      setLogoLoaded(false);
      return;
    }

    axios.post("/api/show_profile_picture.php", { nameEcommerce })
      .then(res => {
        setLogoEcommerce(res.data.logo.logo);
      })
      .catch(err => {
        console.error(err);
        setLogoEcommerce(null);
      });
    return () => setLogoEcommerce(null);
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
    setLoading(true)
    dataForm["nameEcommerce"] = nameEcommerce || null;
    axios.post("/api/search.php", dataForm)
      .then(res => {
        setLoading(false)
        setWord(dataForm.search);
        if (res.data.data) {
          setSearchData(res.data.data);
        } else {
          setSearchData("error");
        }
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
    <header style={{ backgroundColor: color || "#075985" }} className={`bg-sky-800 w-full h-20 sm:h-12 md:h-20 lg:h-20 flex items-center ${fixed && "fixed mb-20"} z-50 justify-between`}>
      {logo ? (
        <div
          className="flex items-center justify-center w-22 h-full cursor-pointer"
          onClick={() => nameEcommerce ? navigate(`/${nameEcommerce}/`) : navigate("/")}
        >
          {logoLoaded ? (
            <img
              src={logoEcommerce ? `/api/${logoEcommerce}` : logoTolo}
              alt="Logo"
              loading="lazy"
              className={`${!logoEcommerce && ""} ml-3 h-[95%] w-full object-contain`}
            />
          ) : (
            <img src={logoTolo} alt="Logo" loading='lazy' className="w-full h-full object-cover" />
          )}
        </div>

      ) : (
        <section className={`flex items-center w-full ${windowWidth < 500 ? "justify-center" : "justify-start"}`}>
          <h1 className={`font-quicksand text-2xl ${goodContrast2 ? "text-white" : "text-black"} font-black ${windowWidth ? "ml-2" : ""}`}>Tu carrito</h1>
          <Model3D
            src="/models/carrito.glb"
            className={`w-22 h-16 ${!goodContrast2 && "invert"}`}
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
                className={`${goodContrast2 ?  "border-none" : "!bg-gray-200 !rounded-full placeholder:!text-gray-600 !p-5"} ${nameEcommerce ? "bg-white" : "!bg-sky-700 !text-white !rounded-2xl focus:outline-none autofill:!bg-sky-700 placeholder:!text-white caret-white autofill:!text-white autofill:shadow-[inset_0_0_0px_1000px_rgb(3,105,161)]  [&:-webkit-autofill]:[-webkit-text-fill-color:white!important]"} pr-10  h-9 mb-3  !font-semibold `}
                icon={
                  <Button type='submit' className="bg-transparent -translate-y-2 translate-x-2 shadow-none" text={<IoSearch className={`${nameEcommerce ? "text-gray-500" : "text-white "} text-2xl -translate-y-[75%]`} />} />
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
                title: goodContrast2 ? "Inicio" : <span className='text-gray-600'>Inicio</span>,
                icon: { name: <FaHome className={`${goodContrast2 ? "text-white" : "text-gray-500"} text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]`} />, expand: true },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/`) : navigate('/'),
              },
              !isLoggedIn && {
                title: '',
                icon: { name: <FaUserCircle className={`${goodContrast2 ? "text-white" : "text-gray-500"} text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px] transition-transform ease-in-out duration-300 hover:scale-125`} />, expand: true },
                animation: false,
                onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/account/`) : navigate('/account'),
              },
              // !isLoggedIn && {
              //   title: 'Crear cuenta',
              //   icon: { name: <FaUserPlus className="text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]" />, expand: true },
              //   animation: false,
              //   onClick: () => nameEcommerce ? navigate(`/${nameEcommerce}/register/`) : navigate('/register'),
              // },
              isLoggedIn && userType && {
                title: "",
                icon: {
                  name: userType === 'ecommerce' || userType === 'vendedor_particular'
                    ? <MdSpaceDashboard className={`${goodContrast2 ? "text-white" : "text-gray-500"} text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px] transition-transform ease-in-out duration-300 hover:scale-125`} />
                    : <TiShoppingCart className={`${goodContrast2 ? "text-white" : "text-gray-500"} text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px] transition-transform ease-in-out duration-300 hover:scale-125`} />,
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
                icon: { name: <BiLogOut className={`${!goodContrast ? "text-white" : "text-red-400"} text-[30px] sm:text-[15px] md:text-[30px] lg:text-[35px] transition-transform ease-in-out duration-300 hover:scale-125`} />, expand: true },
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
                icon: { name: <IoSettings className={`${goodContrast2 ? "text-white" : "text-gray-500"} text-[30px] sm:text-[15px] md:text-[25px] lg:text-[35px] transition-transform hover:scale-125 ease-in-out duration-300`} />, expand: false },
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
