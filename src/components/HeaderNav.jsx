import React from 'react'
import logoTolo from "../assets/logoTolo.png"
import Menu from './Menu'
import { FaHome } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Carrito3d from '../components/Model3D'

export default function HeaderNav() {
  const navigate = useNavigate();
  return (
    <header className='bg-sky-800 h-20 shadow-2xl sm:h-12 md:h-20 lg:h-32 flex items-center justify-between'>
      <img src={logoTolo} alt="Logo Tolo" className='w-26 h-36 sm:w-12 sm:h-12 md:w-32 md:h-36 lg:w-34 lg:h-40' />
      <Menu model3d={<Carrito3d src={"/carrito.glb"} className={"w-[100px] h-[60px] cursor-pointer"} cameraOrbit={"90deg 75deg auto"} onClick={() => navigate("")}/>} elements={[
        {
          "title": "Inicio",
          "icon": {
            "name": <FaHome className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => navigate('/')

        },
        {
          "title": "Iniciar Sesión",
          "icon": {
            "name": <FaUserCircle className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => navigate("/login")
        },
        {
          "title": "Crear cuenta",
          "icon": {
            "name": <FaUserPlus className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => navigate("/register")
        },
      ]}></Menu>
    </header>
  )
}
