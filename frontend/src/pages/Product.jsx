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
import Form from "../components/Form";

export default function Product() {
  const caract = "Marca";
  const valor = "Yamaha";

  const items = [
    `${caract}: ${valor}`,
    "Modelo: PSR-EW310",
    "Teclas: 88",
    "Consumo: 8W",
    "Entrada de cable: USB",
    "Estuche: Sí",
  ];
  const availableColors = ["Blanco", "Negro"];
  const [selectedColor, setSelectedColor] = useState(null);

  // Diccionario: cada color tiene sus imágenes
  const colorImages = {
    Blanco: [
      "https://http2.mlstatic.com/D_NQ_NP_763537-MLU73335304666_122023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_808568-MLU72748503475_112023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_765812-MLU72748589977_112023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_658411-MLU72748570563_112023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_813811-MLU72748503491_112023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_983973-MLU72748618455_112023-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_662338-MLU74959621979_032024-O.webp",
    ],
    Negro: [
      "https://http2.mlstatic.com/D_NQ_NP_638458-MLA82191983612_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_835517-MLA82192156920_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_757803-MLA82191964650_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_809364-MLA82192127900_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_879207-MLA82191964658_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_811094-MLA82191973680_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_2X_920028-MLA82191964674_022025-F.webp",
    ],
  };

  // Imágenes default si no hay color elegido
  const defaultImages = [
      "https://http2.mlstatic.com/D_NQ_NP_638458-MLA82191983612_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_835517-MLA82192156920_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_757803-MLA82191964650_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_809364-MLA82192127900_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_879207-MLA82191964658_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_811094-MLA82191973680_022025-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_2X_920028-MLA82191964674_022025-F.webp",
  ];

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
            images={selectedColor ? colorImages[selectedColor] : defaultImages}
          />
        </div>
        <section className="text-gray-700 p-3 border-b border-gray-200">
          <h1 className="text-3xl mb-5">Descripción</h1>
          <p className="font-semibold text-gray-500 text-xl">
            Piano Portátil de Teclado Dual Plegable de 88 Teclas - Teclado
            Electrónico Inteligente con Pedal de Sostenido, Cable de Carga USB,
            Soporte de Música y Estuche de Transporte - Negro/Blanco
          </p>
        </section>
        <section className="p-3 border-b border-gray-200 flex flex-col">
          <h1 className="text-3xl mb-5 text-gray-700">Detalles del Producto</h1>
          <ul className="[column-count:2] [column-gap:2rem] list-none p-0 m-0">
            {items.map((item, index) => (
              <div
                className={`${index % 2 === 0 ? "bg-white" : "bg-[#f0ecec]"}`}
                key={index}
              >
                <li
                  className={`mb-0 h-12 break-inside-avoid-column flex items-center ml-5`}
                >
                  {item}
                </li>
              </div>
            ))}
          </ul>
        </section>
        <section className="text-gray-700 p-3">
          <h1 className="text-3xl mb-5">Comentarios</h1>
          <div className="p-3 rounded-md">
            <Form
              fields={[
                <Rating
                  id="user-rating"
                  name="rating"
                  initialRating={ratings.userRating}
                  onRatingChange={handleRatingChange}
                  showValue={true}
                  className="ml-4"
                />,
                <Input
                  name="comentarios"
                  type="textarea"
                  placeholder="Haz una opinión..."
                  required={true}
                  minLength={5}
                  maxLength={300}
                  className="h-30 w-150!"
                />,
              ]}
              onSubmit={(data) => console.log(data)}
              button={
                <ProtectedComponent>
                  <Button
                    color="sky"
                    text="Publicar"
                    size="md"
                    className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold ml-4!"
                  />
                </ProtectedComponent>
              }
            />
          </div>
        </section>
        <section className="p-3"></section>
      </div>

      {/*}============================================================================================================================================*/}

      {/* Columna derecha (info + botones) */}
      <div className="flex flex-col items-start w-full md:w-[40%] lg:w-[30%] ml-auto border border-gray-200 rounded-md p-3">
        <h1 className="text-4xl font-semibold ">
          Teclado Electrónico Portátil
        </h1>
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

        <div className="flex items-center gap-2 my-6 w-full ml-3">
          {availableColors.map((color) => (
            <button
              key={color}
              className={`relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedColor === color ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedColor(color)} // solo cambia el color seleccionado
            >
              <img
                src={colorImages[color][0]} // muestra la primera imagen del color
                alt={color}
                className="w-10 h-10 object-cover"
              />
              {selectedColor === color && (
                <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center w-full my-2">
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
