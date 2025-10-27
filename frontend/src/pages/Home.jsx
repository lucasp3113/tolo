import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AnimationScroll from '../components/AnimationScroll';
import { useNavigate } from 'react-router-dom';
import { CiSliderHorizontal } from "react-icons/ci";
import Button from '../components/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { LuSearchX } from "react-icons/lu";
import { TypeAnimation } from 'react-type-animation';
import Carrusel from '../components/Carrusel'
import carrusel1 from '../assets/carrusel1.webp'
import carrusel2 from '../assets/carrusel2.webp'

export default function Home({ searchData, userType, setSearchData, loading = false }) {
  const { ecommerce } = useParams();

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
  }

  const navigate = useNavigate();

  const uniqueProducts = searchData && Array.isArray(searchData)
    ? Array.from(new Map(searchData.map(item => [item.id_producto, item])).values())
    : [];

  // Verificar si hay error o array vacío (búsqueda sin resultados)
  const noResults = searchData === "error" || (Array.isArray(searchData) && searchData.length === 0);

  function showProducts(data) {
    const jsx = [];
    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);

      jsx.push(
        <AnimationScroll key={chunk[0].id_producto}>
          <section className='flex items-center w-full justify-center'>
            {chunk.map((producto) => (
              <ProductCard
                key={producto.id_producto}
                name={producto.nombre_producto}
                rating={producto.rating}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={true}
                phone={false}
                onDelete={() => handleDeleteProduct(producto.id_producto)}
                admin={userType}
                onClick={() => ecommerce ? navigate(`product/${producto.id_producto}`) : navigate(`/product/${producto.id_producto}`)}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }
    return jsx;
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function handleDeleteProduct(id) {
    axios.post("/api/delete_product.php", {
      "id": id
    })
      .then((res) => {
        setSearchData(prevSearchData =>
          prevSearchData.filter(p => p && p.id_producto !== id)
        );
        console.log(res)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    setSearchData(null)
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [animation, setAnimation] = useState(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setAnimation(false);
    if (uniqueProducts.length > 0) {
      setTimeout(() => setAnimation(true), 300);
    }
  }, [uniqueProducts]);

  const NoResultsMessage = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold whitespace-nowrap font-quicksand text-gray-800 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-500 font-semibold font-quicksand">
          Intenta con otra búsqueda o verifica la ortografía
        </p>
        <LuSearchX className='text-gray-500 text-4xl m-auto mt-3' />
      </div>
    </div>
  );

  return (
    <section className={`${searchData ? "bg-white" : "bg-sky-800"} flex h-full items-center flex-col justify-between`}>
      {!searchData ? (
        <section className='flex flex-col items-center h-full md:justify-between justify-start w-full'>
          <h2 className="text-white mt-4 md:mt-0 font-semibold text-2xl md:text-4xl lg:text-4xl h-18 font-montserrat w-3/4 text-center">
            <TypeAnimation
              sequence={[
                'Tu ecommerce listo en un par de clics. Compra, vende y crece.',
              ]}
              speed={55}
              cursor={true}
              wrapper="span"
              repeat={0}
            />
          </h2>
          <button
            onClick={() => ecommerce ? navigate(`/${ecommerce}/register/`) : navigate("/register/")}
            className="md:w-46 w-46 mt-18 mb-15 md:mt-6 md:mb-6 md:p-2 p-3 bg-sky-700 transition-colors hover:bg-white hover:text-sky-700 cursor-pointer text-white font-semibold rounded-3xl duration-500 whitespace-nowrap !shadow-none text-lg font-quicksand flex items-center justify-center"
          >Crear cuenta</button>
          <section className='w-[90%] flex items-center justify-center'>
            <Carrusel
              home={true}
              autoPlay={false}
              productData={false}
              showProductInfo={false}
              className="w-full -translate-x-0.5 max-w-md rounded-3xl"
              images={[carrusel1, carrusel2]}
            />
          </section>
        </section>
      ) : (
        !loading ? (
          noResults ? (
            <NoResultsMessage />
          ) : windowWidth < 500 ? (
            <section
              key={JSON.stringify(uniqueProducts)}
              className={`flex flex-col w-full mb-20 items-center justify-center transition-opacity ease-in-out ${animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"}`}
            >
              {uniqueProducts.map(i => {
                return ((
                  <AnimationScroll key={i.id_producto}>
                    <ProductCard
                      onDelete={() => handleDeleteProduct(i.id_producto)}
                      admin={userType}
                      rating={i.rating}
                      name={i.nombre_producto}
                      price={i["precio"]}
                      image={`/api/${i["ruta_imagen"]}`}
                      stock={i["stock"]}
                      freeShipping={true}
                      phone={true}
                      onClick={() => !userType && ecommerce ? navigate(`product/${i["id_producto"]}`) : navigate(`/product/${i["id_producto"]}`)}
                    />
                  </AnimationScroll>
                ))
              })}
            </section>
          ) : (
            <section className={`flex flex-col mb-20 w-full items-center justify-center transition-opacity ease-in-out ${animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"}`}>
              {uniqueProducts.length > 1 && windowWidth > 500 ? showProducts(uniqueProducts) : uniqueProducts.map((producto) => (
                <AnimationScroll key={producto.id_producto}>
                  <ProductCard
                    key={producto.id_producto}
                    name={producto.nombre_producto}
                    rating={producto.rating}
                    price={producto.precio}
                    image={`/api/${producto.ruta_imagen}`}
                    stock={producto.stock}
                    freeShipping={true}
                    phone={windowWidth >= 500 ? false : true}
                    onDelete={() => handleDeleteProduct(producto.id_producto)}
                    admin={userType}
                    onClick={() => ecommerce ? navigate(`product/${producto.id_producto}`) : navigate(`/product/${producto.id_producto}`)}
                  />
                </AnimationScroll>
              ))}
            </section>
          )
        ) : (
          <div className="fixed bottom-1/2 left-0 right-0 z-50 flex justify-center items-center h-20">
            <ClipLoader size={60} color="#00000" />
          </div>
        )
      )}
    </section>
  );
}