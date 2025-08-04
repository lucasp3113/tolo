import React from 'react'
import Form from '../components/Form';
import Input from '../components/Input'
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import pelota from '../assets/pelota.png'

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className='flex items-center flex-col justify-center'>
      {windowWidth < 500 ? (
        <Form className={"!bg-transparent !shadow-none !border-none !rounded-none"} fields={[
          <Input type={"text"}
            name={"search"} className='pr-10' icon={<IoSearch className='-translate-y-1/2 text-2xl text-gray-600' />} placeholder={"Buscar"} />
        ]} />
      ) : undefined}
      <div className="flex w-full items-center justify-center">
        <ProductCard name={"Pelota nike"} price={3000} image={pelota} stock={10} freeShipping={true} />
        
      </div>

    </div>
  )
}
