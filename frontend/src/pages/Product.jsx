import React from "react";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import image from "../assets/auris.jpg";

export default function Product() {
  return (
    <div className="flex w-[70%] bg-white shadow-xl mt-10 mx-auto text-left">
      <div className="flex min-w-[70%] m-7 mr-7 mx-auto">
        <div>
          <img src={image} alt="" className="min-w-90" />
        </div>

        <div className="mx-auto max-w-[40%] text-left">
          <h1 className="text-2xl font-semibold">
            Auriculares Gamer Inalambricos Bluetooth Flex Kotion G2000bt Color
            Negro
          </h1>
        </div>
        <div>
          <div className="mb-[1rem]">
            <p className="text-green-600">Envío gratis a todo el país </p>
            <p>Conoce los tiempos y las formas de envío.</p>
            <p className="text-sky-600">Calcular cuándo llega</p>
          </div>
          <div>
            <p className="text-green-600">Devolución gratis</p>
            <p>Tienes 30 días desde que lo recibes.</p>
            <p className="text-sky-600">Conocer más</p>
          </div>
          <div className="justify-start flex items-center">
            <Button
              color="sky"
              text="Comprar ahora"
              className="transform-[1] hover:bg-[#306ccc] text-white rounded transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
            />
            <Button
              color="sky"
              text="Añadir al carrito"
              className="text-blue-500 bg-sky-50 hover:bg-sky-100 transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
