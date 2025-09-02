import axios from "axios";
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
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // FIX 1: Mover axios dentro de useEffect
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.post("/api/product.php", {
  //         idProducto: 1
  //       });

  //       if (response.data.success) {
  //         setData(response.data.data);
  //         console.log("Datos del producto:", response.data.data);
  //       } else {
  //         setError(response.data.message);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching product:", err);
  //       setError("Error al cargar el producto");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, []); // Solo ejecuta una vez al montar el componente
  const stock = 100;
  const caract = "Marca";
  const valor = "Yamaha";

  const items = [
    `${caract}: ${valor}`,
    "Modelo: PSR-EW310",
    "Teclas: 88",
    "Consumo: 8W",
    "Entrada de cable: USB",
    "Estuche: Sí",
    "Inalámbrico: Sí",
  ];

  const availableColors = ["Blanco", "Negro", "Rojo"];
  const [selectedColor, setSelectedColor] = useState(availableColors[0]); // Default value
  const availableSizes = ["XL", "M", "S"];
  const [selectedSize, setSelectedSize] = useState(null);
  const showSizes = false;

  // FIX 2: Crear colorImages de forma segura
  const getColorImages = () => {
    // if (!data) return {};

    return {
      // FIX 3: Manejar imagen de BD correctamente
      // Blanco: data.imagen?.ruta_imagen ? [`/api/${data.imagen.ruta_imagen}`] : [image],
      Blanco: [
        "https://m.media-amazon.com/images/I/31bCPm6G7EL._AC_.jpg",
        "https://m.media-amazon.com/images/I/21AfSg2p9mL._AC_.jpg",
        "https://m.media-amazon.com/images/I/31WDLQ34cfL._AC_.jpg",
        "https://m.media-amazon.com/images/I/71FbHNM-JbL._AC_SL1500_.jpg",
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
      Rojo: [
        "https://http2.mlstatic.com/D_NQ_NP_638458-MLA82191983612_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_835517-MLA82192156920_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_757803-MLA82191964650_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_809364-MLA82192127900_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_879207-MLA82191964658_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_811094-MLA82191973680_022025-O.webp",
        "https://http2.mlstatic.com/D_NQ_NP_2X_920028-MLA82191964674_022025-F.webp",
      ],
    };
  };

  const colorImages = getColorImages();

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

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

  // FIX 4: Mostrar loading/error states
  // if (loading) {
  //   return (
  //     <div className="w-[90%] lg:w-[70%] rounded-md flex justify-center bg-white shadow-xl mt-10 p-5 mx-auto">
  //       <p>Cargando producto...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="w-[90%] lg:w-[70%] rounded-md flex justify-center bg-white shadow-xl mt-10 p-5 mx-auto">
  //       <p className="text-red-500">Error: {error}</p>
  //     </div>
  //   );
  // }

  // if (!data) {
  //   return (
  //     <div className="w-[90%] lg:w-[70%] rounded-md flex justify-center bg-white shadow-xl mt-10 p-5 mx-auto">
  //       <p>No se encontraron datos del producto</p>
  //     </div>
  //   );
  // }

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });

  return (
    <section>
      {width >= 500 ? (
        <article
          className={`${
            width < 500 ? "w-full" : "w-100 m-auto"
          } w-[90%] lg:w-[70%] rounded-md flex justify-between bg-white shadow-xl mt-10 p-5 mx-auto text-left`}
        >
          {/* Columna izquierda (Carrusel + descripción) */}
          <div className="flex flex-col mr-7 w-full md:w-[60%] lg:w-[65%]">
            <div className="flex justify-center border-b border-gray-200">
              <Carrusel
                autoPlay={false}
                productData={false}
                showProductInfo={false}
                className="w-2xl"
                images={colorImages[selectedColor] || ["Blanco", "Negro"]}
              />
            </div>
            <section className="text-gray-700 p-3 border-b border-gray-200">
              <h1 className="text-3xl mb-5">Descripción</h1>
              <p className="font-semibold text-gray-500 text-xl">
                Piano Portátil de Teclado Dual Plegable de 88 Teclas - Teclado
                Electrónico Inteligente con Pedal de Sostenido, Cable de Carga
                USB, Soporte de Música y Estuche de Transporte - Negro/Blanco
              </p>
            </section>
            <section className="p-3 border-b border-gray-200 flex flex-col">
              <h1 className="text-3xl mb-5 text-gray-700">
                Detalles del Producto
              </h1>
              <ul className="[column-count:2] [column-gap:2rem] list-none p-0 m-0">
                {items.map((item, index) => (
                  <div
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#f0ecec]"
                    }`}
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
                  className="w-160! shadow-none!"
                  fields={[
                    <Rating
                      key="rating"
                      id="user-rating"
                      name="rating"
                      initialRating={ratings.userRating}
                      onRatingChange={handleRatingChange}
                      showValue={true}
                      className="ml-4"
                    />,
                    <Input
                      key="input"
                      name="comentarios"
                      type="textarea"
                      placeholder="Haz una opinión..."
                      required={true}
                      minLength={5}
                      maxLength={300}
                      className="h-30 w-[44rem]! -translate-x-9"
                    />,
                  ]}
                  // onSubmit={(data) => console.log(data)}
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
          </div>

          {/* Columna derecha (info + botones) */}
          <div className="flex flex-col items-start w-full md:w-[400px] lg:w-[30%] ml-auto border border-gray-200 rounded-md p-3">
            <h1 className="text-4xl font-semibold">
              {/* {data.producto?.nombre_producto ||  */}"Teclado Electrónico
              Portátil"{/*}}*/}
            </h1>
            <h2 className="text-4xl mt-6">
              {/* $ {data.producto?.precio || */}"5.093"{/*}}*/}
            </h2>
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

            {availableColors.length > 1 && (
              <div className="flex items-center gap-2 my-6 w-full ml-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedColor === color ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <img
                      src={colorImages[color]?.[0] || image}
                      alt={color}
                      className="w-10 h-10 object-cover"
                    />
                    {selectedColor === color && (
                      <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showSizes === true && (
              <div className="flex items-center gap-2 my-6 w-full ml-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 my-6 w-full ml-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
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
                  stock={55}
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
                <p className="text-sm text-gray-500">
                  {/*data.producto?.stock ||*/} 100 disponibles
                </p>
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
      ) : (
        <article className="rounded-md flex flex-col justify-between bg-white shadow-xl p-5 mx-auto text-left w-full max-w-full overflow-hidden sm:p-5">
          {/* Columna izquierda (Carrusel + descripción) */}
          <div className="flex flex-col mr-7 w-[50%]">
            <div className="flex items-center gap-2 w-full justify-between mb-2">
              <Rating
                id="product-average"
                value={4.5}
                readonly={true}
                showValue={true}
                size="sm"
                text="text-sm!"
              />
              <p className="text-sm font-semibold text-gray-400">+50 ventas</p>
            </div>
            <h1 className="text-lg font-semibold self-center">
              {/* {data.producto?.nombre_producto ||  */}Teclado Electrónico
              Portátil CON TODA LA MANDOLE DEL MUHNDO AYHI CON TUCO{/*}}*/}
            </h1>
            <div className="flex justify-center">
              <Carrusel
                autoPlay={false}
                productData={false}
                showProductInfo={false}
                draggable={true}
                showArrows={true}
                className="w-2xl"
                images={colorImages[selectedColor] || [image]}
              />
            </div>
            <div className="flex flex-col items-start w-full md:w-[40%] lg:w-[30%] ml-auto rounded-md p-3">
              <h2 className="text-2xl mt-6">
                {/* $ {data.producto?.precio || */}"5.093"{/*}}*/}
              </h2>

              {availableColors.length > 1 && (
                <div className="flex items-center gap-2 my-6 w-full ml-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedColor === color ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <img
                        src={colorImages[color]?.[0] || image}
                        alt={color}
                        className="w-10 h-10 object-cover"
                      />
                      {selectedColor === color && (
                        <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showSizes === true && (
                <div className="flex items-center gap-2 my-6 w-full ml-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 my-6 w-full ml-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center w-full my-2">
                <div className="flex w-full">
                  <p className="mt-[0.46rem] mr-2 ml-4">Cantidad:</p>
                  <Dropdown
                    showSelectedAsTitle={true}
                    hoverActivation={false}
                    border={true}
                    defaultSelectedIndex={0}
                    max={stock}
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
                  <p className="text-sm text-gray-500">
                    {/*data.producto?.stock ||*/} {stock} disponibles
                  </p>
                </div>
              </div>

              <ProtectedComponent>
                <Button
                  color="sky"
                  text="Comprar ahora"
                  className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold w-full h-[3rem]"
                />
              </ProtectedComponent>

              <ProtectedComponent>
                <Button
                  color="sky"
                  onClick={() => navigate("/")}
                  theme="blue"
                  text="Añadir al carrito"
                  className="bg-[#e8ecfc]! text-[#3884fc]! hover:bg-[#e0e4fc]! rounded-md! transition-colors duration-300 font-semibold w-full h-[3rem] mt-2"
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
            <section className="text-gray-700 p-3 border-b border-gray-200">
              <h1 className="text-2xl mb-5">Descripción</h1>
              <p className="font-semibold text-gray-500 text-md">
                Piano Portátil de Teclado Dual Plegable de 88 Teclas - Teclado
                Electrónico Inteligente con Pedal de Sostenido, Cable de Carga
                USB, Soporte de Música y Estuche de Transporte - Negro/Blanco
              </p>
            </section>
            <section className="p-3 border-b border-gray-200 flex flex-col">
              <h1 className="text-2xl mb-5 text-gray-700">
                Detalles del Producto
              </h1>
              <ul className="[column-count:2] [column-gap:2rem] list-none p-0 m-0">
                {items.map((item, index) => (
                  <div
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#f0ecec]"
                    }`}
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
            <section className="text-gray-700 p-3 w-full">
              <h1 className="text-2xl mb-5">Comentarios</h1>
              <div className="p-3 rounded-md mb-15 w-full">
                <Form
                  className="w-[400px] -translate-x-10 p-0 shadow-none!"
                  fields={[
                    <Rating
                      key="rating"
                      id="user-rating"
                      name="rating"
                      initialRating={ratings.userRating}
                      onRatingChange={handleRatingChange}
                      showValue={true}
                      className="ml-4"
                    />,
                    <Input
                      key="input"
                      name="comentarios"
                      type="textarea"
                      placeholder="Haz una opinión..."
                      required={true}
                      minLength={5}
                      maxLength={300}
                      className="h-15 w-full!"
                    />,
                  ]}
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
          </div>
        </article>
      )}
    </section>
  );
}
