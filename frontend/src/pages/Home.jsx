import React from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import pelota from '../assets/pelota.png'
import Button from '../components/Button';
import Rating from '../components/Rating'


export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section className='flex items-center flex-col justify-center'>
      
      <Dropdown
  text="Selecciona una opción"
  showSelectedAsTitle={true}
  options={[
    { label: "Opción 1", onClick: () => console.log("Opción 1") },
    { label: "Opción 2", onClick: () => console.log("Opción 2") },
    { label: "Opción 3", onClick: () => console.log("Opción 3") },
  ]}
  onSelectionChange={(selectedOption) => console.log("Seleccionado:", selectedOption)}
/>
      <Rating/>
      {windowWidth < 500 ? (
        <>
          <section className="flex flex-col w-full mb-20 items-center justify-center">
            <ProductCard name={"Vaca holando"} price={3000} image={"/api/uploads/products/6898014a29918_1754792266.jpg"} stock={0} freeShipping={true} phone={true} />
            <ProductCard name={"Auto audi a5"} price={3000} image={"/api/uploads/products/6897e4d6dbab3_1754784982.jpg"} stock={10} freeShipping={true} phone={true} />
            <ProductCard name={"Pelota nike"} price={3000} image={pelota} stock={101} freeShipping={true} phone={true} />
            <ProductCard name={"Pelota nike"} price={3000} image={pelota} stock={30} freeShipping={true} phone={true} />
          </section>
        </>
      ) : <section className="flex mb-20 w-full items-center justify-center">
        <ProductCard name={"Pelota Nike"} price={3000} image={pelota} stock={10} freeShipping={true} />
        <ProductCard name={"Pelota Nike"} price={3000} image={pelota} stock={10} freeShipping={true} />
        <ProductCard name={"Pelota Nike"} price={3000} image={pelota} stock={10} freeShipping={true} />
      </section>}

    </section>
  )
}
