import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimationScroll from '../components/AnimationScroll';
import ProductCard from '../components/ProductCard';
import { TbRuler2 } from 'react-icons/tb';
import Button from '../components/Button';
import Card from '../components/Card';
import { FaOpencart } from "react-icons/fa";

export default function ShoppingCart() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [update, setUpdate] = useState(false);
  const [productos, setProductos] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [sellers, setSellers] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [categories, setCategories] = useState(null);
  const [priceShipping, setPriceShipping] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    selectedSeller && calculateShipping(categories[selectedSeller]);
  }, [selectedSeller]);

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
  }

  useEffect(() => {
    axios
      .post('/api/show_cart.php', { client: user })
      .then((res) => {
        const uniqueProducts = Array.from(
          new Map(
            res.data.data.map(item => [`${item.id_producto}-${item.vendedor}`, item])
          ).values()
        );

        setProductos(uniqueProducts);

        const dataSellers = Array.from(new Set(uniqueProducts.map(p => p.vendedor)));
        setSellers(dataSellers);
        setSelectedSeller(dataSellers[0]);

        const objectPrice = {};
        const objectCategories = {};
        dataSellers.forEach(seller => {
          objectPrice[seller] = 0;
          objectCategories[seller] = [];
        });

        uniqueProducts.forEach(p => {
          objectPrice[p.vendedor] += parseFloat(p.precio_unitario) * p.cantidad;
          if (!objectCategories[p.vendedor].includes(p.nombre_categoria) && !p.envio_gratis) {
            objectCategories[p.vendedor].push(p.nombre_categoria);
          }
        });

        setTotalPrice(objectPrice);
        setCategories(objectCategories);
      })
      .catch(err => console.log(err));
  }, []);

  function deleteProduct(id_producto) {
    axios.post('/api/delete_product.php', { id_producto })
      .then(() => {
        setProductos(prev => prev.filter(p => p.id_producto !== id_producto));
      })
      .catch(err => console.log(err));
  }

  function calculateShipping(categorias) {
    const preciosCategorias = {
      "Electrónica": 743,
      "Electrodomésticos": 743,
      "Hogar y Cocina": 712,
      "Ropa hombre": 263,
      "Ropa mujer": 263,
      "Ropa niño": 263,
      "Ropa niña": 263,
      "Rop unisex": 263,
      "Calzado": 263,
      "Accesorios": 263,
      "Libros": 263,
      "Juguetes": 263,
      "Salud y Belleza": 263,
      "Deportes y Aire libre": 330,
      "Herramientas y Ferretería": 330,
      "Videojuegos": 263,
      "Computación": 743,
      "Celulares y accesorios": 263,
      "Oficina y papelería": 263,
      "Automotriz": 804,
      "Música y Películas": 263,
      "Instrumentos Musicales": 763,
      "Alimentos y Bebidas": 263,
      "Motocicletas": 1400,
      "Náutica": 1400,
      "Repuestos y autopartes": 804,
      "Mascotas": 723,
      "Perros": 0,
      "Gatos": 0,
      "Ganado bovino": 0,
      "Ganado ovino": 0,
      "Ganado equino": 0,
      "Ganado caprino": 0,
      "Aves de corral": 0,
      "Inmuebles": 0,
      "Alquiler de campos": 0,
      "Alquiler de casas": 0,
      "Alquiler de herramientas": 330,
      "Jardín y exteriores": 850,
      "Muebles": 1215,
    };

    let maxPrecio = 0;
    categorias.forEach(cat => {
      const precio = preciosCategorias[cat] ?? 0;
      if (precio > maxPrecio) maxPrecio = precio;
    });

    let precioFinal = 0;
    if (maxPrecio > 0) {
      precioFinal = maxPrecio * 1.10 + 25;
    }
    setPriceShipping(parseInt(precioFinal));
  }

  function showProducts(data) {
    const filtered = data.filter(p => p.vendedor === selectedSeller);
    const jsx = [];

    for (let i = 0; i < filtered.length; i += 3) {
      const chunk = filtered.slice(i, i + 3);
      jsx.push(
        <AnimationScroll key={`chunk-${i}-${selectedSeller}`}>
          <section className="flex items-center justify-center gap-4">
            {chunk.map(producto => (
              <ProductCard
                key={`${producto.id_producto}-${producto.vendedor}`}
                id_compra={producto.id_compra}
                onDelete={(id) => {
                  setProductos(prev => prev.filter(p => p.id_compra !== id));
                }}
                cart={true}
                name={producto.nombre_producto}
                price={producto.precio_unitario}
                image={`/api/${producto.ruta_imagen}`}
                amount={producto.cantidad}
                stock={producto.stock}
                freeShipping={producto.envio_gratis === 1}
                phone={false}
                client={true}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }

    return jsx;
  }

  return (
    productos.filter(producto => producto.vendedor === selectedSeller).length > 0 ? (
      <div className={`mb-22 ${windowWidth >= 500 ? 'flex flex-wrap justify-center gap-4' : ''}`}>
      {sellers?.length > 1 && (
        <>
          <section className="w-full flex items-center justify-center">
            {sellers.map(seller => (
              <span
                key={seller}
                onClick={() => setSelectedSeller(seller)}
                className='m-3 select-none font-quicksand font-semibold text-lg bg-gray-300 hover:bg-gray-200 p-2 min-w-24 cursor-pointer rounded-3xl'
              >
                {seller}
              </span>
            ))}
          </section>
          <h2 className='font-quicksand font-semibold text-3xl mb-4'>
            Tu pedido en {selectedSeller}
          </h2>
        </>
      )}

      {!update ? (
        windowWidth > 500 ? (
          showProducts(productos)
        ) : (
          productos
            .filter(producto => producto.vendedor === selectedSeller)
            .map(producto => (
              <AnimationScroll key={`${producto.id_producto}-${producto.vendedor}`}>
                <ProductCard
                  cart={TbRuler2}
                  id_compra={producto.id_compra}
                  onDelete={(id) => {
                    setProductos(prev => prev.filter(p => p.id_compra !== id));
                  }}
                  name={producto.nombre_producto}
                  price={producto.precio_unitario}
                  image={`/api/${producto.ruta_imagen}`}
                  amount={producto.cantidad}
                  stock={producto.stock}
                  freeShipping={producto.envio_gratis === 1}
                  phone={true}
                  client={true}
                />
              </AnimationScroll>
            ))
        )
      ) : (
        <CreateProduct edit={true} onCancel={() => setUpdate(false)} id={update[1]} />
      )}

      {totalPrice && (
        <Card className={`${windowWidth < 500 ? "!w-88 m-auto" : "!w-[31rem]"} ${productos
          .filter(producto => producto.vendedor === selectedSeller).length > 1 ? "mt-4 mb-28" : "mt-12"} !shadow !bg-gray-50 !rounded-4xl`}>
          <h2 className='font-quicksand -translate-y-3 font-bold text-2xl'>Detalles de la compra</h2>
          <section className='flex items-center justify-between w-full'>
            <h2 className='font-quicksand ml-3 font-medium text-xl'>Subtotal</h2>
            <span className='font-quicksand font-medium text-xl'>${totalPrice[selectedSeller]}</span>
          </section>
          <section className='flex items-center justify-between w-full mt-4'>
            <h2 className='font-quicksand ml-3 font-medium text-xl'>Envio</h2>
            <span className='font-quicksand mr-1 font-medium text-xl'>${priceShipping}</span>
          </section>
          <section className='flex items-center justify-between w-full mt-4'>
            <h2 className='font-quicksand ml-3 font-bold text-xl'>Total</h2>
            <span className='font-quicksand font-bold text-xl'>
              ${priceShipping + totalPrice[selectedSeller]}
            </span>
          </section>
          <Button
            onClick={() => alert("Botón clickeado")}
            color="black"
            size="lg"
            text="Finalizar pedido"
            className={"!w-72 mr-3 mt-4 !rounded-2xl font-quicksand font-semibold"}
          />
        </Card>
      )}
    </div>
    ) : <section className='w-full h-full flex justify-center items-center flex-col'><FaOpencart className=' -translate-y-14 text-gray-500 text-6xl'/> <span className='text-gray 500 text-2xl -translate-y-14'>Agrega un producto a tu carrito</span></section>
  );
}
