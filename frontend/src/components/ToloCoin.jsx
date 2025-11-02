import React, { useEffect, useState } from "react";
import axios from "axios";
import ToloCoinLogo from "../assets/ToloCoin.webp";

export default function ToloCoin({goodContrast}) {
  const [coins, setCoins] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      user = payload.id_usuario;
    }

    if (!user) return;

 
    axios
      .post(`/api/coins.php`, {
        id: user
      })
      .then((res) => {
        console.log(res)
        if (res.data.tolo_coins !== undefined) {
          setCoins(res.data.tolo_coins);
        }
      })
      .catch((err) => console.error("Error al obtener ToloCoins:", err));

    const totalAfterToloCoins = localStorage.getItem("totalAfterToloCoins"); 
    if (totalAfterToloCoins) {
      const tolo_coins_ganados = totalAfterToloCoins * 0.01;

      axios
        .post("/api/update_tolo_coins.php", {
          id_usuario: user,
          tolo_coins_usados: 0, 
          tolo_coins_ganados: tolo_coins_ganados,
        })
        .then((res) => {
          console.log("ToloCoins actualizados:", res.data.nuevos_tolo_coins);
          setCoins(res.data.nuevos_tolo_coins);
        })
        .catch((err) => console.error("Error al actualizar ToloCoins:", err));
    }
  }, []);

  return (
    <section className="flex items-center w-full ml-4 px-3 py-1 font-semibold text-sm">
      <div className="w-auto h-9 rounded-full hover:scale-115 transition-transform duration-200 overflow-hidden scale-105 blur-[0.3px]">
        <img
          src={ToloCoinLogo}
          alt="ToloCoin"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {windowWidth >= 500 ? (
        <span className={`ml-1 text-xl font-quicksand ${goodContrast ? "text-white" : "text-black"}`}>ToloCoins:</span>
      ) : null}

      <span className="ml-2 text-lg font-bold text-yellow-400">{coins}</span>
    </section>
  );
}