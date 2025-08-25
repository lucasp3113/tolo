import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home({ searchData }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    setAnimation(false)
    if (searchData) {
      setTimeout(() => setAnimation(true), 300)
    }
  }, [searchData])

  return (
    <section className='flex items-center flex-col justify-center'>
      {windowWidth < 500 ? (
        //celu
        <>
          <section key={JSON.stringify(searchData)} className={`flex flex-col w-full mb-20 items-center justify-center transition-opacity ease-in-out ${animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"}`}>
            {searchData ? searchData.map(i => (
              <ProductCard
                key={i.id || i.nombre_producto}
                name={i["nombre_producto"]}
                price={i["precio"]}
                image={`/api/${i["ruta_imagen"]}`}
                stock={i["stock"]}
                freeShipping={true}
                phone={true}
              />
            )) : null}
          </section>
        </>
      ) : //compu 
        <section className={`flex mb-20 w-full items-center justify-center transition-opacity ease-in-out ${animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"}`}>
          {searchData ? searchData.map(i => (
            <ProductCard
              key={i.id || i.nombre_producto}
              name={i["nombre_producto"]}
              price={i["precio"]}
              image={`/api/${i["ruta_imagen"]}`}
              stock={i["stock"]}
              freeShipping={true}
              phone={false}
            />
          )) : null}

        </section>}


    </section>
  )
}
