import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import CreateProduct from '../pages/CreateProduct'

export default function ProductCRUD() {
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
        setProductos(prevProductos => prevProductos.filter(p => p.id_producto !== id));
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
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [user])

  return (
    <div className={`mb-20  ${windowWidth >= 500 ? "flex items-center justify-center" : ""}`}>
      {!update ? (
        productos.map((producto) => (
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

        ))
      ) : (
        <CreateProduct edit={true} onCancel={() => setUpdate(false)} id={update[1]}/>
      )}
    </div>
  )

}
