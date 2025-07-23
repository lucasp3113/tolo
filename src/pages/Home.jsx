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
        size="30" /*tamaño del icono*/
        text=""
        cnhamburger="" /*características adicionales del icono hamburger*/
        cndiv="ml-15" /*Características del dropdown*/
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
