import React from 'react'
import logoTolo from "../assets/logoTolo.png"
import Menu from './Menu'
import { FaHome } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";

export default function HeaderNav() {
  return (
    <header className='bg-sky-800 h-20 shadow-2xl sm:h-12 md:h-20 lg:h-32 flex items-center justify-between'>
      <img src={logoTolo} alt="Logo Tolo" className='w-10 h-10 sm:w-12 sm:h-12 md:w-32 md:h-36 lg:w-40 lg:h-40' />
      <Menu elements={[
        {
          "title": "Inicio",
          "icon": {
            "name": <FaHome className='text-white sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => console.log("hola")

        },
        {
          "title": "Iniciar Sesión",
          "icon": {
            "name": <FaUserCircle className='text-white sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => console.log("hola")
        },
        {
          "title": "Crear cuenta",
          "icon": {
            "name": <FaUserPlus className='text-white sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
            "expand": true
          },
          "animation": false,
          "onClick": () => console.log("chau")
        },
      ]}></Menu>
    </header>
  )
}
