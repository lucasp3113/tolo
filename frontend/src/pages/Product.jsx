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

        <div className="flex-col justify-center">
          <div className="">
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
          </div>

          <div>
            <div className="flex justify-center mt-[1rem]">
              <p className="mr-[1rem]">Cantidad:</p>
              <Dropdown
                text="Número"
                border={true}
                hoverActivation={false}
                defaultSelectedIndex={0}
                showSelectedAsTitle={true}
                options={[
                  { label: "1", onClick: () => console.log("1") },
                  { label: "2", onClick: () => console.log("2") },
                  { label: "3", onClick: () => console.log("3") },
                  { label: "4", onClick: () => console.log("4") },
                  { label: "5", onClick: () => console.log("5") },
                  { label: "6", onClick: () => console.log("6") },
                ]}
              />
            </div>
            <div>
              <div className="flex justify-center">
                <Button
                  color="sky"
                  text="Comprar ahora"
                  className="transform-[1] bg-[#3884fc] hover:bg-[#306ccc] text-white rounded transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  color="sky"
                  text="Añadir al carrito"
                  className="text-blue-500! bg-[#e8ecfc]! hover:bg-[#e0e4fc]! transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
