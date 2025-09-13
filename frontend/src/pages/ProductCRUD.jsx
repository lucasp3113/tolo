import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import CreateProduct from '../pages/CreateProduct'
import AnimationScroll from '../components/AnimationScroll'

export default function ProductCRUD() {
  function showProducts(data) {
    console.log(data)
    const jsx = [];

    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);

      jsx.push(
        <AnimationScroll key={chunk[0].id_producto}>
          <section className='flex items-center'>
            {chunk.map((producto) => (
              <ProductCard
                key={producto.id_producto}
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={true}
                phone={false}
                client={false}
                onDelete={() => deleteProduct(producto.id_producto)}
                onUpdate={() => setUpdate([true, producto.id_producto])}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }

    return jsx;
  }

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function deleteProduct(id) {
    axios.post("/api/delete_product.php", {
      "id": id
    })
      .then((res) => {
        setProductos(prevProductos =>
          prevProductos.filter(p => p && p.id_producto !== id)
        );
        console.log(res)
      })
      .catch((err) => console.log(err))

  }

  const [update, setUpdate] = useState(false)

  // function updateProduct(id) {
  //   axios.post("/api/updateProduct.php", {

  //   })
  // }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.post("/api/read_product.php", {
      "username": user
    })
      .then((res) => {
        setProductos(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [user])

  return (
    <div className={`mb-20  ${windowWidth >= 500 ? "flex flex-wrap justify-center gap-4" : ""}`}>
      {!update ? (
        productos.length > 2 && windowWidth > 500 ? showProducts(productos) : productos.map((producto) => (
          <AnimationScroll>
            <ProductCard
              key={producto.id_producto}
              name={producto.nombre_producto}
              price={producto.precio}
              image={`/api/${producto.ruta_imagen}`}
              stock={producto.stock} freeShipping={true}
              phone={windowWidth >= 500 ? false : true}
              client={false}
              onDelete={() => deleteProduct(producto.id_producto)}
              onUpdate={() => setUpdate([true, producto.id_producto])}
            />
          </AnimationScroll>

        ))
      ) : (
        <CreateProduct edit={true} onCancel={() => setUpdate(false)} id={update[1]} />
      )}
    </div>
  )

}
