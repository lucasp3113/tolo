import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import AnimationScroll from "../components/AnimationScroll";
import { LuStarOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Favorites({ userType }) {
  const [favorites, setFavorites] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [animation, setAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id_usuario
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  const fetchFavorites = () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .post("/api/show_favorites.php", { idUsuario: userId })
      .then((res) => {
        console.log(res);

        if (res.data && res.data.success && res.data.favorites) {
         
          const favoritesData = res.data.favorites;
          
          if (Array.isArray(favoritesData) && favoritesData.length > 0) {
            
            setFavorites(favoritesData);
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setFavorites([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    setAnimation(false);
    if (favorites.length > 0) {
      setTimeout(() => setAnimation(true), 300);
    }
  }, [favorites]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleDeleteFavorite = (id_producto) => {
    if (!user) return;

    axios
      .post("/api/remove_favorite.php", {
        idUsuario: userId,
        idProducto: id_producto,
      })
      .then(() => {
        console.log("Favorito eliminado correctamente");
        fetchFavorites();
      })
      .catch((err) => console.error("Error al eliminar favorito:", err));
  };
    
  // Chunk de 3 productos para desktop
  const showProducts = (data) => {
    const jsx = [];
    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);
      jsx.push(
        <AnimationScroll key={`chunk-${i}`}>
          <section className="flex items-center w-full justify-center">
            {chunk.map((producto) => (
              <ProductCard
                key={producto.id_producto}
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={producto.envio_gratis}
                phone={false}
                client={true}
                onDelete={() => handleDeleteFavorite(producto.id_producto)}
                admin={userType}
                onClick={() => navigate(`/product/${producto.id_producto}`)}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }
    return jsx;
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <section className="flex items-center justify-center w-full min-h-[400px]">
        <p className="text-gray-500">Cargando favoritos...</p>
      </section>
    );
  }


  // Mostrar mensaje si no hay favoritos
  if (favorites.length === 0) {
    return (
     <section className='w-full h-full flex justify-center items-center flex-col'><LuStarOff className=' -translate-y-14 text-gray-500 text-6xl' /> 
     <span className='text-gray 500 text-2xl font-quicksand font-semibold -translate-y-14'>No tienes favoritos</span>
     </section>
    );
  }
  return (
    
    <section className="flex flex-col items-center justify-center w-full">
        <h1 className='text-3xl mb-5 mt-5 font-quicksand text-gray-900 font-semibold'>
      Favoritos
    </h1>
      {windowWidth < 500 ? (
        <section
        
          className={`flex flex-col w-full mb-20 items-center justify-center transition-opacity ease-in-out ${
            animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"
          }`}
        >
          {favorites.map((producto) => (
            <AnimationScroll key={producto.id_producto}>
              <ProductCard
                name={producto.nombre_producto}
                price={producto.precio}
                image={`/api/${producto.ruta_imagen}`}
                stock={producto.stock}
                freeShipping={producto.envio_gratis}
                phone={true}
                client={true}
                onDelete={() => handleDeleteFavorite(producto.id_producto)}
                admin={userType}
                onClick={() => navigate(`/product/${producto.id_producto}`)}
              />
            </AnimationScroll>
          ))}
        </section>
      ) : (
        <section
          className={`flex flex-col mb-20 w-full items-center justify-center transition-opacity ease-in-out ${
            animation ? "opacity-100 duration-1000" : "opacity-0 duration-0"
          }`}
        >
          {favorites.length > 1 ? (
            showProducts(favorites)
          ) : (
            favorites.map((producto) => (
              <AnimationScroll key={producto.id_producto}>
                <ProductCard
                  name={producto.nombre_producto}
                  price={producto.precio}
                  image={`/api/${producto.ruta_imagen}`}
                  stock={producto.stock}
                  freeShipping={producto.envio_gratis}
                  phone={false}
                  client={true}
                  onDelete={() => handleDeleteFavorite(producto.id_producto)}
                  admin={userType}
                  onClick={() => navigate(`/product/${producto.id_producto}`)}
                />
              </AnimationScroll>
            ))
          )}
        </section>
      )}
    </section>
  );
}