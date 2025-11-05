import React from "react";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";

export default function DropdownCategories({
  register,
  errors,
  direction,
  watch,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const VestimentaDropdown = () => (
    <Dropdown
      text="Vestimenta"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Calzado"
                label="Calzado"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ropa hombre"
                label="Ropa hombre"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ropa mujer"
                label="Ropa mujer"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ropa unisex"
                label="Ropa unisex"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ropa niño"
                label="Ropa niño"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ropa niña"
                label="Ropa niña"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const TecnologiaDropdown = () => (
    <Dropdown
      text="Tecnología"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Electrónica"
                label="Electrónica"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Computación"
                label="Computación"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Celulares y accesorios"
                label="Celulares y accesorios"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Videojuegos"
                label="Videojuegos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const VehiclesDropdown = () => (
    <Dropdown
      text="Vehículos y Repuestos"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Vehículos"
                label="Vehículos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Repuestos y autopartes"
                label="Repuestos y autopartes"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Motocicletas"
                label="Motocicletas"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Náutica"
                label="Náutica"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const HogarDropdown = () => (
    <Dropdown
      text="Hogar y Herramientas"
      cndiv="ml-10 md:ml-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Electrodomésticos"
                label="Electrodomésticos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Hogar y Cocina"
                label="Hogar y Cocina"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Herramientas y Ferretería"
                label="Herramientas y Ferretería"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Jardín y exteriores"
                label="Jardín y exteriores"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const Rentals = () => (
    <Dropdown
      text="Alquileres"
      cndiv="mr-10"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Alquiler de campos"
                label="Alquiler de campos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Alquiler de casas"
                label="Alquiler de casas"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Alquiler de herramientas"
                label="Alquiler de herramientas"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const NinosDropdown = () => (
    <Dropdown
      text="Niños y Bebés"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Bebés y niños"
                label="Bebés y niños"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Juguetes"
                label="Juguetes"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const OficinaDropdown = () => (
    <Dropdown
      text="Oficina y Estudio"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Oficina y papelería"
                label="Oficina y papelería"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Libros"
                label="Libros"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const GanadoDropdown = () => (
    <Dropdown
      text="Ganado"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Ganado bovino"
                label="Ganado bovino"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ganado ovino"
                label="Ganado ovino"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ganado equino"
                label="Ganado equino"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Ganado caprino"
                label="Ganado caprino"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const MascotasDropdown = () => (
    <Dropdown
      text="Mascotas"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Perros"
                label="Perros"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Gatos"
                label="Gatos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Mascotas"
                label="Mascotas"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const AgroDropdown = () => (
    <Dropdown
      text="Agro"
      cndiv="px-3"
      direction={direction}
      options={[
        {
          type: "custom",
          content: (
            <fieldset className="flex flex-col items-start justify-center">
              <Input
                type="checkbox"
                name="Agro e insumos rurales"
                label="Agro e insumos rurales"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Herramientas de campo"
                label="Herramientas de campo"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Maquinaria agrícola"
                label="Maquinaria agrícola"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Alimentos agroindustriales"
                label="Alimentos agroindustriales"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
              <Input
                type="checkbox"
                name="Productos orgánicos"
                label="Productos orgánicos"
                register={register}
                watch={watch}
                errors={errors}
                className="!flex-row"
              />
            </fieldset>
          ),
        },
      ]}
    />
  );

  const renderMobileCategories = () => (
    <fieldset className="flex flex-col items-start justify-center w-100">
      {/* Fila 1: Vestimenta - Tecnología */}

      <section className="grid grid-cols-2 gap-1 w-full">
        <VestimentaDropdown />

        <TecnologiaDropdown />
      </section>

      {/* Fila 2: Vehículos - Hogar */}

      <section className="grid grid-cols-2 gap-1 w-full mt-4">
        <VehiclesDropdown />

        <AgroDropdown />
      </section>

      {/* Fila 3: Niños - Oficina */}

      <section className="grid grid-cols-2 gap-1 w-full mt-4">
        <NinosDropdown />

        <OficinaDropdown />
      </section>

      {/* Fila 4: Ganado - Mascotas */}

      <section className="grid grid-cols-2 gap-1 w-full mt-4">
        <GanadoDropdown />

        <MascotasDropdown />
      </section>

      {/* Fila 5 */}

      <section className="grid grid-cols-2 w-full mt-4 justify-items-center">
        <HogarDropdown />

        <Rentals />
      </section>

      {/* Checkboxes individuales - 2 columnas */}

      <section className="flex items-start! gap-3 ml-4 mt-2 border-t border-gray-200">
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Instrumentos Musicales"
            label="Instrumentos Musicales"
            register={register}
            watch={watch}
            errors={errors}
            className=""
          />
          <Input
            type="checkbox"
            name="Accesorios"
            label="Accesorios"
            register={register}
            watch={watch}
            errors={errors}
            className=""
          />
          <Input
            type="checkbox"
            name="Salud y Belleza"
            label="Salud y Belleza"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Deportes y Aire libre"
            label="Deportes y Aire libre"
            register={register}
            watch={watch}
            errors={errors}
          />
        </section>
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Alimentos y Bebidas"
            label="Alimentos y Bebidas"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Aves de corral"
            label="Aves de corral"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Inmuebles"
            label="Inmuebles"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Música y Películas"
            label="Música y Películas"
            register={register}
            watch={watch}
            errors={errors}
          />
        </section>
      </section>
    </fieldset>
  );

  const renderDesktopCategories = () => (
    <fieldset className="flex flex-col items-start w-full max-w-full">
      <section className="grid grid-cols-3 gap-6 w-full">
        <VestimentaDropdown />
        <TecnologiaDropdown />
        <VehiclesDropdown />
      </section>

      <section className="grid grid-cols-3 gap-6 w-full mt-4">
        <HogarDropdown />
        <NinosDropdown />
        <OficinaDropdown />
      </section>

      <section className="grid grid-cols-3 gap-6 w-full mt-4">
        <GanadoDropdown />
        <MascotasDropdown />
        <AgroDropdown />
      </section>

      <section className="flex items-start! gap-2 ml-4 mt-2 border-t border-gray-200">
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Instrumentos Musicales"
            label="Instrumentos Musicales"
            register={register}
            watch={watch}
            errors={errors}
            className=""
          />
          <Input
            type="checkbox"
            name="Accesorios"
            label="Accesorios"
            register={register}
            watch={watch}
            errors={errors}
            className=""
          />
        </section>
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Salud y Belleza"
            label="Salud y Belleza"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Deportes y Aire libre"
            label="Deportes y Aire libre"
            register={register}
            watch={watch}
            errors={errors}
          />
        </section>
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Alimentos y Bebidas"
            label="Alimentos y Bebidas"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Aves de corral"
            label="Aves de corral"
            register={register}
            watch={watch}
            errors={errors}
          />
        </section>
        <section className="flex! flex-col! items-start!">
          <Input
            type="checkbox"
            name="Inmuebles"
            label="Inmuebles"
            register={register}
            watch={watch}
            errors={errors}
          />
          <Input
            type="checkbox"
            name="Música y Películas"
            label="Música y Películas"
            register={register}
            watch={watch}
            errors={errors}
          />
        </section>
      </section>
    </fieldset>
  );
  return (
    <Dropdown
      text="Categorias"
      cndiv="m-3 flex flex-col items-center justify-center "
      className="w-full m-auto px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800"
      options={[
        {
          type: "custom",
          content: isMobile
            ? renderMobileCategories()
            : renderDesktopCategories(),
        },
      ]}
    />
  );
}
