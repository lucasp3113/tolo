import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AnimationScroll from '../components/AnimationScroll';
import { useNavigate } from 'react-router-dom';
import { CiSliderHorizontal } from "react-icons/ci";
import Button from '../components/Button';

export default function Home({ searchData }) {
  const navigate = useNavigate();

  const uniqueProducts = searchData
    ? Array.from(new Map(searchData.map(item => [item.id_producto, item])).values())
    : [];

  function showProducts(data) {
    const jsx = [];
    for (let i = 0; i < data.length;) {
      jsx.push(
        <AnimationScroll key={`animation-${i}`}>
          <section key={data[i].id_producto} className='flex items-center w-full justify-center'>
            <ProductCard
              key={data[i].id_producto}
              name={data[i]["nombre_producto"]}
              price={data[i]["precio"]}
              image={`/api/${data[i]["ruta_imagen"]}`}
              stock={data[i]["stock"]}
              freeShipping={true}
              phone={false}
              onClick={() => navigate(`/product/${data[i]["id_producto"]}`)}
            />
            {data[i + 1] && (
              <ProductCard
                key={data[i + 1].id_producto}
                name={data[i + 1]["nombre_producto"]}
                price={data[i + 1]["precio"]}
                image={`/api/${data[i + 1]["ruta_imagen"]}`}
                stock={data[i + 1]["stock"]}
                freeShipping={true}
                phone={false}
                onClick={() => navigate(`/product/${data[i + 1]["id_producto"]}`)}
              />
            )}
            {data[i + 2] && (
              <ProductCard
                key={data[i + 2].id_producto}
                name={data[i + 2]["nombre_producto"]}
                price={data[i + 2]["precio"]}
                image={`/api/${data[i + 2]["ruta_imagen"]}`}
                stock={data[i + 2]["stock"]}
                freeShipping={true}
                phone={false}
                onClick={() => navigate(`/product/${data[i + 2]["id_producto"]}`)}
              />
            )}
          </section>
        </AnimationScroll>
      );
      i += 3;
    }
    return jsx;
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
          {uniqueProducts.map(i => (
            <AnimationScroll key={i.id_producto}>
              <ProductCard
                name={i["nombre_producto"]}
                price={i["precio"]}
                image={`/api/${i["ruta_imagen"]}`}
                stock={i["stock"]}
                freeShipping={true}
                phone={true}
                onClick={() => navigate(`/product/${i["id_producto"]}`)}
              />
            </AnimationScroll>
          ))}
        </section>
      ) : (
        <section className={`flex flex-col mb-20 w-full items-center justify-center transition-opacity ease-in-out ${animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"}`}>
          {showProducts(uniqueProducts)}
        </section>
      )}
    </section>
  );
}
