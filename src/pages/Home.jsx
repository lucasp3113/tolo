import React from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { IoSearch } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <Form
        className={"!bg-transparent !shadow-none !border-none !rounded-none"}
        fields={[
          <Input
            type={"text"}
            name={"search"}
            icon={<IoSearch className="text-2xl text-gray-600" />}
            placeholder={"Buscar"}
          />,
        ]}
      />
      <Dropdown
        text=""
        cnhamburger="h-10" /*características adicionales del hamburger (tamaño maximo: h-10)*/
        cndiv="ml-6"
        theme="" /*hay solo dos hamburger: uno blanco (white) y uno negro (black, que es el predeterminado)*/
        options={[
          /*opciones del dropdown*/ { label: "Iniciar Sesión", to: "/Login" },
          {
            label: "Tuquearse",
            onClick: () => alert("Te tuqueaste tarao!"),
          },
          {
            label: "Cachimbearse",
            onClick: () => alert("Te cachimbeaste tarao!"),
          },
        ]}
      />
    </div>
  );
}
