import React from "react";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import image from "../assets/auris.jpg";
import ProtectedComponent from "../components/ProtectedComponent";
import Rating from "../components/Rating";
import { useNavigate } from "react-router-dom";
import Carrusel from "../components/Carrusel";

export default function Product() {
  const navigate = useNavigate();

  return (
    <div className="flex w-[60%] rounded-md bg-white shadow-xl mt-10 mx-auto text-left">
      <div className="flex justify-start">
        {/*aca va el carrusel a la burger*/}
        <div>
          <Carrusel/>
        </div>
        {/* Imágen del producto */}
        <div className="flex min-w-[70%] m-7 mr-7 mx-auto">
          <div>
            <img src={image} alt="" className="min-w-90" />
          </div>

          {/* Datos del producto */}
          <div className="mx-auto max-w-[21.25rem] text-start">
            <h1 className="text-2xl font-semibold">
              Auriculares Gamer Inalambricos Bluetooth Flex Kotion G2000bt Color
              Negro
            </h1>
            <ProtectedComponent>
              <Rating className={"max-w-[0rem]"} />
            </ProtectedComponent>
            <div>
              {/* Acá se pondría una posible oferta (ej:  ̶̶5̶0̶0̶0̶ ) */}
              <h2 className="text-4xl mt-6">$4000</h2>
            </div>
          </div>

          {/* Descripción/compra */}
          <div className="flex-col max-w-[30%]">
            <div className="">
              <div className="mb-[1rem]">
                <p>
                  Auriculares geimer chetardos epicardovich para viciar al pro
                  soccer y cachimbearse un poquito, marca phoinkas (creo q dice
                  eso), medio berretas pero tienen luces chetas y pamba
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="mt-[0.46rem] mr-2">Cantidad:</p>
              <Dropdown
                text="Cantidad"
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

            <div>
              <div className="flex-col mt-[20px]">
                <div className="">
                  <ProtectedComponent>
                    <Button
                      color="sky"
                      text="Comprar ahora"
                      className="transform-[1] bg-[#3884fc] hover:bg-[#306ccc] text-white rounded transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
                    />
                  </ProtectedComponent>
                </div>
                <div className="">
                  <ProtectedComponent>
                    <Button
                      color="sky"
                      onClick={() => navigate("/")}
                      theme="blue"
                      text="Añadir al carrito"
                      className="! bg-[#e8ecfc]! text-[#3884fc]! hover:bg-[#e0e4fc]! transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
                    />
                  </ProtectedComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
