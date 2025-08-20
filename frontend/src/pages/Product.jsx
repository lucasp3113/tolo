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
import Input from "../components/Input";
import { FaComment } from "react-icons/fa";
import Form from "../components/Form";

export default function Product() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  let rating = 3;

  const [ratings, setRatings] = useState({
    userRating: 0,
    productAverage: 4.5,
  });

  const handleRatingChange = (newRating, ratingId) => {
    setRatings((prev) => ({
      ...prev,
      [ratingId]: newRating,
    }));
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    <article className="w-[90%] lg:w-[70%] rounded-md flex justify-between bg-white shadow-xl mt-10 p-5 mx-auto text-left">
      {/* Columna izquierda (Carrusel + descripción) */}
      <div className="flex flex-col mr-7 w-full md:w-[60%] lg:w-[65%]">
        <div className="flex justify-center border-b border-gray-200">
          <Carrusel
            autoPlay={false}
            productData={false}
            showProductInfo={false}
            className="w-2xl"
            images={[
              "https://img.kwcdn.com/product/fancy/8eb6d5e4-fcb1-4ea6-adc3-7a7d6e814c73.jpg?imageView2/2/w/800/q/70/format/webp",
              "https://img.kwcdn.com/product/fancy/ef691fed-8d80-42ec-87d9-bea38c625706.jpg?imageView2/2/w/800/q/70/format/webp",
              "https://img.kwcdn.com/product/fancy/5856bdf4-40bd-4e8f-a811-b97d68bf212a.jpg?imageView2/2/w/800/q/70/format/webp",
              "https://img.kwcdn.com/product/fancy/5856bdf4-40bd-4e8f-a811-b97d68bf212a.jpg?imageView2/2/w/800/q/70/format/webp",
              "https://img.kwcdn.com/product/fancy/110ad3c1-7415-4124-92e6-91fdc7c8f8b8.jpg?imageView2/2/w/800/q/70/format/webp",
            ]}
          />
        </div>
        <section className="text-gray-700 p-3 border-b border-gray-200">
          <h1 className="text-3xl mb-5">Descripción</h1>
          <p>
            Piano Portátil de Teclado Dual Plegable de 88 Teclas - Teclado
            Electrónico Inteligente con Pedal de Sostenido, Cable de Carga USB,
            Soporte de Música y Estuche de Transporte - Negro/Blanco
          </p>
        </section>
        <section className="p-3 border-b border-gray-200 flex flex-col">
          <h1 className="text-3xl mb-5 text-gray-700">Detalles del Producto</h1>
          <span>Marca: Yamaha</span>
          <span>Modelo: PSR-EW310</span>
          <span></span>
          <span></span>
          <span>Teclas: 88</span>
          <span>Consumo: 8W</span>
          <span>Entrada de cable: USB</span>
          <span>Estuche: Sí</span>
        </section>
        <section className="text-gray-700 p-3 border border-gray-200">
          <h1 className="text-3xl mb-5 border-b border-gray-200">
            Calificación
          </h1>
          <div className="border border-gray-300 p-3 rounded-md ml-1">
              <Form
                fields={[
                  <Rating
                    id="user-rating"
                    name="rating"
                    initialRating={ratings.userRating}
                    onRatingChange={handleRatingChange}
                    showValue={true}
                  />,
                  <Input
                    name="comentarios"
                    type="text"
                    placeholder="Haz una opinión..."
                    required={true}
                    minLength={5}
                    maxLength={300}
                    icon={<FaComment className="-translate-y-3" />}
                    className=""
                  />,
                ]}
                onSubmit={(data) => console.log(data)}
                button={
                  <Button
                    color="sky"
                    text="Publicar"
                    size="md"
                    className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold"
                  />
                }
              />
          </div>
          <div className="flex justify-end">
            <Button
              color="sky"
              text="Publicar"
              size="md"
              className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold"
            />
          </div>
        </section>
        <section className="p-3"></section>
      </div>

      {/* Columna derecha (info + botones) */}
      <div className="flex flex-col items-start w-full md:w-[40%] lg:w-[30%] ml-auto border border-gray-200 rounded-md p-3">
        <h1 className="text-4xl font-semibold">Teclado Electrónico Portátil</h1>
        <h2 className="text-4xl mt-6">$ 5.093</h2>
        <div className="flex items-center gap-2">
          <Rating
            id="product-average"
            value={4.5}
            readonly={true}
            showValue={true}
            size="lg"
          />
          <div className="h-5 w-px bg-gray-300 mx-4"></div>
          <p className="text-sm font-semibold">+50 ventas</p>
        </div>

        <div className="flex justify-between items-center w-full my-7">
          <div className="flex w-full">
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
          {/* STOCK */}
          <div>
            <p className="text-sm text-gray-500">+100 disponibles</p>
          </div>
        </div>

        <ProtectedComponent>
          <Button
            color="sky"
            text="Comprar ahora"
            className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold w-[15rem] h-[3rem]"
          />
        </ProtectedComponent>

        <ProtectedComponent>
          <Button
            color="sky"
            onClick={() => navigate("/")}
            theme="blue"
            text="Añadir al carrito"
            className="bg-[#e8ecfc]! text-[#3884fc]! hover:bg-[#e0e4fc]! rounded-md! transition-colors duration-300 font-semibold w-[15rem] h-[3rem] mt-2"
          />
        </ProtectedComponent>
        <section className="flex justify-center mt-5">
          <div>
            <img src={matias} alt="" className="mr-6 w-10 rounded-full" />
          </div>
          <div className="flex flex-col">
            <span>
              Vendido por:{" "}
              <button
                className="cursor-pointer text-sky-600"
                onClick={() => navigate("/seller_dashboard/")}
              >
                El Letra
              </button>{" "}
            </span>
          </div>
        </section>
      </div>
    </article>
  );
}
