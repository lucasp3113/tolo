import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CreateProduct from "../pages/CreateProduct";
import AnimationScroll from "../components/AnimationScroll";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ProductCRUD({ isAdmin, setProductCrud = null }) {
  function showProducts(data) {
    console.log(data);
    const jsx = [];

    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);

      jsx.push(
        <AnimationScroll key={chunk[0].id_producto}>
          <section className="flex items-center">
            {chunk.map((producto) => (
              <ProductCard
                isAdmin={isAdmin}
                key={producto.id_producto}
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={true}
                phone={false}
                client={false}
                onDelete={() => deleteProduct(producto.id_producto)}
                onUpdate={() => handleEdit(producto.id_producto)}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }

    return jsx;
  }

  function showProductsMobile(data) {
    const jsx = [];

    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2);

      jsx.push(
        <AnimationScroll key={chunk[0].id_producto}>
          <section className="flex flex-wrap items-start justify-start w-full">
            {chunk.map((producto) => (
              <ProductCard
                isAdmin={isAdmin}
                key={producto.id_producto}
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={true}
                phone={true}
                client={false}
                onDelete={() => deleteProduct(producto.id_producto)}
                onUpdate={() => handleEdit(producto.id_producto)}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }

    return jsx;
  }

  let user = null;
  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    user = payload.user;
    userId = payload.id_usuario;
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function deleteProduct(id) {
    axios
      .post("/api/delete_product.php", {
        id: id,
      })
      .then((res) => {
        setProductos((prevProductos) =>
          prevProductos.filter((p) => p && p.id_producto !== id)
        );
        axios.post("/api/create_notifications.php", {
          userId: userId,
          message: "Producto eliminado exitosamente",
        });
      })
      .catch((err) => console.log(err));
  }

  const [update, setUpdate] = useState(false);
  const [productData, setProductData] = useState(null);

  function handleEdit(id) {
    axios
      .post("/api/show_product.php", {
        idProducto: id,
      })
      .then((res) => {
        if (res.data.success) {
          setProductData(res.data.data);
          setUpdate([true, id]);
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("/api/read_product.php", {
        username: isAdmin ? isAdmin : user,
      })
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  return (
    <div
      className={`mb-20 ${
        windowWidth >= 500 ? "flex flex-wrap justify-center gap-4" : ""
      }`}
    >
      {user === "admin" && (
        <div
          onClick={() => setProductCrud(false)}
          className="flex absolute z-50 cursor-pointer left-6 top-28 justify-start -translate-y-6 -translate-x-6 hover:scale-110 transition-transform duration-300"
        >
          <IoReturnUpBack className={`w-18 z-50 mr-2 text-[40px]`} />
        </div>
      )}
      {!update ? (
        windowWidth >= 500 ? (
          productos.length > 1 ? showProducts(productos) : productos.map((producto) => (
            <AnimationScroll key={producto.id_producto}>
              <ProductCard
                isAdmin={isAdmin}
                key={producto.id_producto}
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={true}
                phone={false}
                client={false}
                onDelete={() => deleteProduct(producto.id_producto)}
                onUpdate={() => handleEdit(producto.id_producto)}
              />
            </AnimationScroll>
          ))
        ) : (
          showProductsMobile(productos)
        )
      ) : (
        <CreateProduct
          edit={true}
          onCancel={() => {
            setUpdate(false);
            setProductData(null);
          }}
          id={update[1]}
          productData={productData}
        />
      )}
    </div>
  );
}