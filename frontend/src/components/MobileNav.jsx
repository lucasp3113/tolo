import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Menu from "./Menu";
import { MdSpaceDashboard } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { IoSettings } from "react-icons/io5";
import axios from "axios";
import Dropdown from "./Dropdown";
import ClipLoader from "react-spinners/ClipLoader";
import { TiShoppingCart } from "react-icons/ti";
import { PiCrownSimpleFill } from "react-icons/pi";


export default function MovileNav({ color }) {
  const navigate = useNavigate();

  const [goodContrast, setGoodContrast] = useState(true);
  function hasGoodContrast(color1, color2, threshold = 1.1) {
    if (!color1 || !color2) return true;

    const getLuminance = (hex) => {
      if (!hex || !hex.startsWith("#")) return 0;

      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map((c) => {
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
    if (color) {
      setGoodContrast(hasGoodContrast("#f87171", color, 1.45));
    }
  }, [color]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { ecommerce: ecommerceName } = useParams();
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
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user = payload.user;
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }

    axios
      .post("/api/type_user.php", { usuario: user })
      .then((res) => {
        setUserType(res.data.user_type?.toLowerCase());
      })
      .catch((err) => {
        console.error("Error al obtener datos del usuario:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-sky-900 flex justify-center items-center h-20">
        <ClipLoader size={40} color="#fff" />
      </div>
    );
  }

  return (
    <nav className={`${windowWidth < 400 ? "h-16" : "h-22"} fixed bottom-0 left-0 right-0 z-50 bg-sky-800 flex items-center justify-between w-full px-4`}>
      <Menu
        className="w-full max-w-md flex justify-center"
        model3d={[]}
        elements={[
          {
            title: "Inicio",
            url: "/",
            icon: {
              name: (
                <FaHome className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () =>
              ecommerceName ? navigate(`/${ecommerceName}/`) : navigate("/"),
          },
          !isLoggedIn && {
            title: "Iniciar Sesión",
            url: "/login",
            icon: {
              name: (
                <FaUserCircle className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () =>
              ecommerceName
                ? navigate(`/${ecommerceName}/login/`)
                : navigate("/login"),
          },
          !isLoggedIn && {
            title: "Crear cuenta",
            url: "/register",
            icon: {
              name: (
                <FaUserPlus className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[30px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () =>
              ecommerceName
                ? navigate(`/${ecommerceName}/register/`)
                : navigate("/register"),
          },
          isLoggedIn &&
            userType && {
              title:
                userType === "ecommerce" || 
                userType === "admin" ||
                userType === "vendedor_particular"
                  ? "Panel de control"
                  : "Carrito",
              icon: {
                    name:
                      userType === "admin" ? (
                        <PiCrownSimpleFill className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />
                      ) : userType === "ecommerce" ||
                        userType === "vendedor_particular" ? (
                        <MdSpaceDashboard className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />
                      ) : (
                        <TiShoppingCart className="text-white text-[30px] sm:text-[20px] md:text-[30px] lg:text-[35px]" />
                      ),
                    expand: true,
                  },
              animation: false,
             onClick: () => {
                    if (userType === "ecommerce")
                      nameEcommerce
                        ? navigate(`/${nameEcommerce}/ecommerce_dashboard/`)
                        : navigate("/ecommerce_dashboard/");
                    else if (userType === "cliente")
                      nameEcommerce
                        ? navigate(`/${nameEcommerce}/shopping_cart/`)
                        : navigate("/shopping_cart/");
                    else if (userType === "admin")
                      navigate("/admin_panel/")
                    else
                      nameEcommerce
                        ? navigate(`/${nameEcommerce}/seller_dashboard/`)
                        : navigate("/seller_dashboard/");
                  },
            },
          isLoggedIn && {
            title: "Ajustes",
            icon: {
              name: (
                <IoSettings className="text-white text-[30px] sm:text-[20px] md:text-[25px] lg:text-[35px]" />
              ),
              expand: true,
            },
            animation: false,
            onClick: () =>
              ecommerceName
                ? navigate(`/${ecommerceName}/settings/`)
                : navigate("/settings/"),
          },
          isLoggedIn && {
            title: "Cerrar sesión",
            icon: {
              name: (
                <BiLogOut
                  className={`${
                    !goodContrast ? "text-white" : "text-red-400"
                  } text-[35px] sm:text-[20px] md:text-[30px] lg:text-[35px]`}
                />
              ),
              expand: true,
            },
            animation: false,
            onClick: () => {
              localStorage.removeItem("token");
              localStorage.removeItem("token_expiration");
              logout();
              ecommerceName ? navigate(`/${ecommerceName}/`) : navigate("/");
            },
          },
        ].filter(Boolean)}
      />
    </nav>
  );
}
