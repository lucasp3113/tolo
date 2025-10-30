import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import image from "../assets/auris.jpg";
import ProtectedComponent from "../components/ProtectedComponent";
import Rating from "../components/Rating";
import { useNavigate } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import { useParams } from "react-router-dom";
import CommentsSection from "../components/Comments";


export default function Product(productId) {
  const { ecommerce } = useParams();

  const [stats, setStats] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  let userId = null
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userId = payload.id_usuario
  }

  function handleAddToCart() {
    axios.post("/api/add_to_cart.php", {
      id_client: userId,
      id_product: id,
      amount: quantity,
      price: data.precio
    })
      .then((res) => {
        sessionStorage.setItem('addToCartSuccess', 'success')
        navigate(ecommerce ? `/${ecommerce}/shopping_cart/` : "/shopping_cart/")
      })
      .catch((res) => console.log(res))

  }

  useEffect(() => {
    axios
      .post("/api/show_product.php", {
        idProducto: id,
      })
      .then((res) => {
        setData(res.data.data);
        (res);
        console.log
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    axios.get(`/api/show_comments.php?productId=${id}`)
      .then((res) => {
        console.log(res.data.stats.promedio_rating)
        setStats(res.data.stats.promedio_rating)
      })
      .catch((res) => console.log(res))
  }, [id]);

  const [logoEcommerce, setLogoEcommerce] = useState(null);

  useEffect(() => {
    if (!data?.nombre_ecommerce) return;
    console.log(data.nombre_ecommerce)
    axios.post("/api/show_profile_picture.php", {
      nameEcommerce: data.nombre_ecommerce
    })
      .then(res => {
        setLogoEcommerce(res.data.logo.logo);
      })
      .catch(err => console.error(err));
  }, [data]);



  const getAvailableColors = () => {
    if (!data) return [];
    if (data.colores) {
      if (Array.isArray(data.colores)) {
        return data.colores.map(color => color.nombre);
      } else {
        return Object.keys(data.colores);
      }
    }
    return [];
  };

  const getAvailableSizes = () => {
    if (!data || !data.colores) return [];
    if (Array.isArray(data.colores)) return [];

    const firstColor = Object.keys(data.colores)[0];
    if (firstColor && data.colores[firstColor].talles) {
      return data.colores[firstColor].talles.map(talle => talle.talle);
    }
    return [];
  };

  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors]);

  const showSizes = availableSizes.length > 0;

  const getColorImages = () => {
    if (!data) return {};

    if (data.imagenes && Array.isArray(data.imagenes)) {
      return {
        default: data.imagenes.map(img => `/api/uploads/products/${img}`)
      };
    }

    if (data.colores) {
      const images = {};
      if (Array.isArray(data.colores)) {
        data.colores.forEach(color => {
          images[color.nombre] = color.imagenes ?
            color.imagenes.map(img => `/api/uploads/products/${img}`) : [image];
        });
      } else {
        Object.keys(data.colores).forEach(colorName => {
          images[colorName] = data.colores[colorName].imagenes ?
            data.colores[colorName].imagenes.map(img => `/api/uploads/products/${img}`) : [image];
        });
      }
      return images;
    }

    return { default: [image] };
  };

  const colorImages = getColorImages();

  const getCurrentStock = () => {
    if (!data) return 0;

    if (data.stock !== undefined) {
      return data.stock;
    }

    if (data.colores && selectedColor) {
      if (Array.isArray(data.colores)) {
        const colorData = data.colores.find(color => color.nombre === selectedColor);
        return colorData?.stock || 0;
      } else if (data.colores[selectedColor]) {
        if (selectedSize && data.colores[selectedColor].talles) {
          const talleData = data.colores[selectedColor].talles.find(talle => talle.talle === selectedSize);
          return talleData?.stock || 0;
        }
        return data.colores[selectedColor].stock || 0;
      }
    }

    return 0;
  };

  const stock = getCurrentStock();

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const [ratings, setRatings] = useState({
    userRating: 0,
    productAverage: 4.0,
  });

  const handleRatingChange = (newRating, ratingId) => {
    setRatings((prev) => ({
      ...prev,
      [ratingId]: newRating,
    }));
  };

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });

  const generateQuantityOptions = () => {
    const maxQuantity = Math.min(stock, 10);
    const options = [];
    for (let i = 1; i <= maxQuantity; i++) {
      options.push({
        label: i.toString(),
        onClick: () => setQuantity(i)
      });
    }
    return options;
  };

  const getCurrentImages = () => {

    if (availableColors.length > 0 && selectedColor) {
      const images = colorImages[selectedColor] || [image];
      return images;
    }

    if (data?.imagenes && Array.isArray(data.imagenes)) {
      const directImages = data.imagenes.map(img =>
        img.startsWith('uploads/') ? `/api/${img}` : `/api/uploads/products/${img}`
      );
      return directImages;
    }

    const defaultImages = colorImages.default || [image];
    return defaultImages;
  };

  if (loading) return <div className="flex justify-center font-quicksand items-center p-10">Cargando...</div>;
  if (error) return <div className="flex justify-center items-center p-10 text-red-500">Error al cargar el producto</div>;
  if (!data) return <div className="flex justify-center items-center p-10">No se encontró el producto</div>;

  return (
    <section className="">
      {width >= 500 ? (
        <article className="w-full max-w-[90%] rounded-md flex justify-between bg-white shadow-xl mt-10 p-6 mx-auto text-left gap-8">
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div className="flex justify-center border-b border-gray-200 mb-6">
              <Carrusel
                autoPlay={false}
                productData={false}
                showProductInfo={false}
                className="w-full max-w-2xl"
                images={getCurrentImages()}
              />
            </div>
            <section className="text-gray-700  p-4 border-b border-gray-200">
              <h1 className="text-3xl mb-5">Descripción</h1>
              <p className="font-semibold text-gray-500 text-xl">
                {data.descripcion}
              </p>
            </section>
            <section className="p-4 border-b border-gray-200 flex flex-col">
              <h1 className="text-3xl mb-5 text-gray-700">
                Detalles del Producto
              </h1>
              <ul className="[column-count:2] [column-gap:2rem] list-none p-0 m-0">
                {data.caracteristicas?.map((caracteristica, index) => (
                  <div
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#f0ecec]"
                      }`}
                    key={index}
                  >
                    <li
                      className={`mb-0 h-12 break-inside-avoid-column break-words overflow-hidden flex items-center pl-5`}
                    >
                      {caracteristica}
                    </li>
                  </div>
                ))}
              </ul>
            </section>

            <CommentsSection
              productId={id}
              currentUser={JSON.parse(
                localStorage.getItem("user_data") || "null"
              )}
            />
          </div>

          <div className="flex flex-col items-start w-full max-w-[320px] min-w-[280px] border border-gray-200 rounded-md p-6">
            <h1 className="text-4xl font-quicksand font-black mb-4">
              {data.nombre_producto}
            </h1>
            <div className="flex items-center gap-4 mt-2 mb-6 w-full">
              <h2 className="text-4xl whitespace-nowrap">{"$ " + data.precio}</h2>
              <div className="h-6 w-px bg-gray-300"></div>
              <p className="text-sm font-semibold whitespace-nowrap">0 ventas</p>
            </div>

            {availableColors.length > 0 && (
              <div className="flex items-center gap-3 my-6 w-full">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedColor === color ? "ring-2 ring-blue-500" : ""
                      }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <img
                      src={colorImages[color]?.[0] || image}
                      alt={color}
                      className="w-12 h-12 object-cover"
                    />
                    {selectedColor === color && (
                      <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showSizes && (
              <div className="flex items-center gap-3 my-6 w-full flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size
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

            <div className="flex justify-between items-center w-full my-4">
              <div className="flex items-center gap-3">
                <p className="text-base">Cantidad:</p>
                <Dropdown
                  showSelectedAsTitle={true}
                  hoverActivation={false}
                  border={true}
                  defaultSelectedIndex={0}
                  stock={stock}
                  options={generateQuantityOptions()}
                />
              </div>
              <div>
                <p className="text-sm ml-0.5 text-gray-500 whitespace-nowrap">
                  {stock + " disponibles"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full mt-6">
              <ProtectedComponent>
                <Button
                  color="sky"
                  text="Comprar ahora"
                  className="bg-[#3884fc] hover:bg-[#306ccc] hover:scale-none! text-white rounded-md! transition-colors! duration-100! font-semibold w-full h-[3rem] m-auto"
                />
              </ProtectedComponent>

              <ProtectedComponent>
                <Button
                  color="sky"
                  onClick={() => handleAddToCart()}
                  theme="blue"
                  text="Añadir al carrito"
                  className="bg-[#e8ecfc]! text-[#3884fc]! hover:bg-[#e0e4fc]! hover:scale-none! rounded-md! transition-colors! duration-100! font-semibold w-full h-[3rem] m-auto"
                />
              </ProtectedComponent>
            </div>

            <section className="flex items-center justify-center mt-6 w-full">
              <div className="flex items-center gap-4">
                <img src={`/api/${logoEcommerce}`} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                  <span className="font-quicksand font-medium">
                    Vendido por:{" "}
                    <button
                      className="cursor-pointer font-semibold text-sky-600"
                      onClick={() => navigate(`/${data.nombre_ecommerce}`)}
                    >
                      {data.nombre_ecommerce}
                    </button>{" "}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </article>
      ) : (
        <article className="rounded-md flex flex-col justify-between bg-white shadow-xl p-5 mx-auto text-left w-full max-w-full overflow-hidden">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 w-full justify-between mb-4">
              <Rating
                id="product-average"
                value={stats}
                readonly={true}
                showValue={true}
                size="sm"
                text="text-sm!"
              />
              <p className="text-sm font-semibold text-gray-400">+50 ventas</p>
            </div>
            <h1 className="text-2xl font-black font-quicksand text-center mb-4">
              {data.nombre_producto}
            </h1>
            <div className="flex justify-center mb-6">
              <Carrusel
                autoPlay={false}
                productData={false}
                showProductInfo={false}
                draggable={true}
                showArrows={true}
                className="w-full"
                images={getCurrentImages()}
              />
            </div>
            <div className="flex flex-col items-start w-full p-4 border border-gray-200 rounded-md">
              <h2 className="text-2xl font-semibold mb-4">{"$ " + data.precio}</h2>

              {availableColors.length > 0 && (
                <div className="flex items-center gap-3 my-4 w-full">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedColor === color ? "ring-2 ring-blue-500" : ""
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

              {showSizes && (
                <div className="flex items-center gap-2 my-4 w-full flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${selectedSize === size
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

              <div className="flex justify-between items-center w-full my-4">
                <div className="flex items-center gap-3">
                  <p className="text-base">Cantidad:</p>
                  <Dropdown
                    showSelectedAsTitle={true}
                    hoverActivation={false}
                    border={true}
                    defaultSelectedIndex={0}
                    max={stock}
                    options={generateQuantityOptions()}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stock} disponibles</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                <ProtectedComponent>
                  <Button
                    color="sky"
                    text="Comprar ahora"
                    className="bg-[#3884fc] hover:bg-[#306ccc] text-white rounded-md! transition-colors duration-300 font-semibold w-full h-[3rem] m-auto"
                  />
                </ProtectedComponent>

                <ProtectedComponent>
                  <Button
                    color="sky"
                    onClick={() => handleAddToCart()}
                    theme="blue"
                    text="Añadir al carrito"
                    className="bg-[#e8ecfc]! text-[#3884fc]! hover:bg-[#e0e4fc]! rounded-md! transition-colors duration-300 font-semibold w-full h-[3rem] m-auto"
                  />
                </ProtectedComponent>
              </div>

              <section className="flex items-center justify-center mt-5 w-full">
                <div className="flex items-center gap-4">
                  <img src={`/api/${logoEcommerce}`} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-quicksand font-medium">
                      Vendido por:{" "}
                      <button
                        className="cursor-pointer font-semibold text-sky-600"
                        onClick={() => navigate(`/${data.nombre_ecommerce}`)}
                      >
                        {data.nombre_ecommerce}
                      </button>{" "}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <section className="text-gray-700 p-4 border-b border-gray-200 mt-6">
              <h1 className="text-2xl mb-5">Descripción</h1>
              <p className="font-semibold max-w-84 break-words text-gray-500 text-md">
                {data.descripcion}
              </p>
            </section>
            <section className="p-4 border-b border-gray-200 flex flex-col">
              <h1 className="text-2xl mb-5 text-gray-700">
                Detalles del Producto
              </h1>
              <ul className="[column-count:2] [column-gap:2rem] list-none p-0 m-0">
                {data.caracteristicas?.map((caracteristica, index) => (
                  <div
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#f0ecec]"
                      }`}
                    key={index}
                  >
                    <li
                      className={`mb-0 h-12 break-inside-avoid-column flex items-center pl-5`}
                    >
                      {caracteristica}
                    </li>
                  </div>
                ))}
              </ul>
            </section>

            <CommentsSection productId={id} currentUserId={userId} />
          </div>
        </article>
      )}
    </section>
  );
}