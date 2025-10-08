import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AnimationScroll from '../components/AnimationScroll';
import { useNavigate } from 'react-router-dom';
import { CiSliderHorizontal } from "react-icons/ci";
import Button from '../components/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios'

export default function Home({ searchData, userType, setSearchData }) {
  const { ecommerce } = useParams();
  
  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
  }

  const navigate = useNavigate();

  const uniqueProducts = searchData
    ? Array.from(new Map(searchData.map(item => [item.id_producto, item])).values())
    : [];

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

  useEffect(() => {
    setAnimation(false);
    if (uniqueProducts.length > 0) {
      setTimeout(() => setAnimation(true), 300);
    }
  }, [uniqueProducts]);

  return (
    <section className='flex items-center flex-col justify-center'>
      {windowWidth < 500 ? (
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
      )}
    </section>
  );
}