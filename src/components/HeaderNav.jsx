import React from 'react'
// import logoTolo from "../assets/logoTolo.png"
import Menu from './Menu'
import { useNavigate } from 'react-router-dom';
import Model3D from '../components/Model3D'

export default function HeaderNav() {
  const navigate = useNavigate();
  return (
    <header className='bg-sky-800 h-20 shadow-2xl sm:h-12 md:h-20 lg:h-32 flex items-center justify-between'>
      <Model3D
        src={"/tolo3D.glb"}
        className={"w-[70px] h-full cursor-pointer scale-110"}
        cameraOrbit="10deg 85deg auto"
        onClick={() => navigate("")}
      />

      <Menu
        model3d={[
          <Model3D
            src={"/home.glb"}
            className={"w-[60px] h-[50px] cursor-pointer scale-70"}
            cameraOrbit="0deg 90deg auto"
            onClick={() => navigate("/")}
          />,
          <Model3D
            src={"/addUser.glb"}
            className={"w-[70px] h-[50px] cursor-pointer scale-70"}
            cameraOrbit="180deg 90deg auto"
            onClick={() => navigate("/")}
          />,
          <Model3D
            src={"/login.glb"}
            className={"w-[70px] h-[50px] cursor-pointer scale-70"}
            cameraOrbit="0deg 90deg auto"
            onClick={() => navigate("/")}
          />,
          <Model3D
            src={"/carrito.glb"}
            className={"w-[70px] h-[50px] cursor-pointer scale-90"}
            cameraOrbit="90deg 90deg auto"
            onClick={() => navigate("/login/")}
          />
        ]}
        elements={[
          // {
        //   "title": "Inicio",
        //   "icon": {
        //     "name": <FaHome className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
        //     "expand": true
        //   },
        //   "animation": false,
        //   "onClick": () => navigate('/')

        // },
        // {
        //   "title": "Iniciar Sesión",
        //   "icon": {
        //     "name": <FaUserCircle className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
        //     "expand": true
        //   },
        //   "animation": false,
        //   "onClick": () => navigate("/login")
        // },
        // {
        //   "title": "Crear cuenta",
        //   "icon": {
        //     "name": <FaUserPlus className='text-white text-[30px] sm:text-[15px] md:text-[25px] lg:text-[30px]' />,
        //     "expand": true
        //   },
        //   "animation": false,
        //   "onClick": () => navigate("/register")
        // },
        ]}
      />
    </header>
  )
}
