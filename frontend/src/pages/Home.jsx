import React from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import pelota from "../assets/pelota.png";
import auris from "../assets/auris.jpg";
import Rating from "../components/Rating";
import ProtectedComponent from "../components/ProtectedComponent";

export default function Home() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section className="flex items-center flex-col justify-center">
        <ProtectedComponent>
        <Rating/>
        </ProtectedComponent>
      {windowWidth < 500 ? (
        <>
          <section className="flex flex-col w-full mb-20 items-center justify-center">
            <ProductCard
              name={"Vaca holando"}
              price={3000}
              image={"/api/uploads/products/6898014a29918_1754792266.jpg"}
              stock={0}
              freeShipping={true}
              phone={true}
            />
            <ProductCard
              name={"Auto audi a5"}
              price={3000}
              image={"/api/uploads/products/6897e4d6dbab3_1754784982.jpg"}
              stock={10}
              freeShipping={true}
              phone={true}
            />
            <ProductCard
              name={"Pelota nike"}
              price={3000}
              image={pelota}
              stock={101}
              freeShipping={true}
              phone={true}
            />
            <ProductCard
              name={"Pelota nike"}
              price={3000}
              image={pelota}
              stock={30}
              freeShipping={true}
              phone={true}
            />
          </section>
        </>
      ) : (
        <section className="flex mb-20 w-full items-center justify-center">
          <ProductCard
            name={"Auriculares Gamer"}
            price={3000}
            image={auris}
            stock={10}
            freeShipping={true}
            onClick={() => navigate(`/product`)}
          />
          <ProductCard
            name={"Pelota Nike"}
            price={3000}
            image={pelota}
            stock={10}
            freeShipping={true}
          />
          <ProductCard
            name={"Pelota Nike"}
            price={3000}
            image={pelota}
            stock={10}
            freeShipping={true}
          />
        </section>
      )}
    </section>
  );
}
