import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import image from "../assets/auris.jpg";
import ProtectedComponent from "../components/ProtectedComponent";
import Rating from "../components/Rating";
import { useNavigate } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import lauta from "../assets/lautaro.jpeg";
import silvano from "../assets/silvano.jpg";
import matias from "../assets/matias.jpg";

export default function Product() {
  const navigate = useNavigate();

  // // Detectar tamaño de pantalla
  //   useEffect(() => {
  //     const checkScreenSize = () => {
  //       setIsMobile(window.innerWidth < 768);
  //     };
  //     checkScreenSize();
  //     window.addEventListener("resize", checkScreenSize);
  //     return () => window.removeEventListener("resize", checkScreenSize);
  //   }, []);

  return (
    <article className="w-[90%] rounded-md flex justify-start bg-white shadow-xl mt-10 p-5 mx-auto text-left">
      {/*  */}
      <div className="flex flex-col min-w-[70%] mr-7 mx-auto">
        <Carrusel
          autoPlay={false}
          productData={false}
          showProductInfo={false}
          className="w-2xl"
        />
        <section>
          <div className="ml-7 mb-[1rem]">
            <p>
              Auriculares geimer chetardos epicardovich para viciar al pro
              soccer y cachimbearse un poquito, marca phoinkas (creo q dice
              eso), medio berretas pero tienen luces chetas y pamba
            </p>
          </div>
        </section>
      </div>

      {/* Datos del producto */}
      <section className="flex flex-col mx-auto w-full text-start">
        <h1 className="text-xl font-semibold">Matías Santeador Alfareador</h1>
        <ProtectedComponent>
          <Rating className={"w-0"} />
        </ProtectedComponent>
        <div>
          {/* Acá se pondría una posible oferta (ej:  ̶̶5̶0̶0̶0̶ ) */}
          <h2 className="text-4xl mt-6">$4000</h2>
        </div>
        

        <div className="flex flex-col mt-22 w-1/3">
          <div className="flex">
          <p className="mt-[0.46rem] mr-2">Cantidad:</p>
          <Dropdown
            showSelectedAsTitle={true}
            hoverActivation={false}
            border={true}
            defaultSelectedIndex={0}
            options={[
              { label: "1", onClick: () => console.log("Opción 1") },
              { label: "2", onClick: () => console.log("Opción 2") },
              { label: "3", onClick: () => console.log("Opción 3") },
              { label: "4", onClick: () => console.log("Opción 4") },
              { label: "5", onClick: () => console.log("Opción 5") },
              { label: "6", onClick: () => console.log("Opción 6") },
            ]}
            onSelectionChange={(selectedOption) =>
              console.log("Seleccionado:", selectedOption)
            }
          />
          </div>

          <ProtectedComponent>
            <Button
              color="sky"
              text="Comprar ahora"
              className="transform-[1] bg-[#3884fc] hover:bg-[#306ccc] text-white rounded transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
            />
          </ProtectedComponent>
          <ProtectedComponent>
            <Button
              color="sky"
              onClick={() => navigate("/")}
              theme="blue"
              text="Añadir al carrito"
              className="! bg-[#e8ecfc]! !text-[#3884fc] hover:bg-[#e0e4fc]! transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
            />
          </ProtectedComponent>
        </div>
      </section>

      <div className="flex-col">
        <div></div>
      </div>
      <div className=""></div>
    </article>
  );
}
