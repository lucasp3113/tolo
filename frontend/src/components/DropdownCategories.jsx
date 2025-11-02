import React from 'react'
import { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Input from './Input';

export default function DropdownCategories({ register, errors, direction, watch, selected = null }) {
    const [isMobile, setIsMobile] = useState(false);

    const isSelected = (categoryName) => {
        return selected && Array.isArray(selected) && selected.some(item => item.nombre_categoria === categoryName);
    };
    
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const VestimentaDropdown = () => (
        <Dropdown
            text="Vestimenta"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Calzado" label="Calzado" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Calzado")} />
                        <Input type="checkbox" name="Ropa hombre" label="Ropa hombre" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ropa hombre")} />
                        <Input type="checkbox" name="Ropa mujer" label="Ropa mujer" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ropa mujer")} />
                        <Input type="checkbox" name="Ropa unisex" label="Ropa unisex" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ropa unisex")} />
                        <Input type="checkbox" name="Ropa niño" label="Ropa niño" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ropa niño")} />
                        <Input type="checkbox" name="Ropa niña" label="Ropa niña" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ropa niña")} />
                    </fieldset>
                )
            }]}
        />
    );

    const TecnologiaDropdown = () => (
        <Dropdown
            text="Tecnología"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Electrónica" label="Electrónica" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Electrónica")} />
                        <Input type="checkbox" name="Computación" label="Computación" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Computación")} />
                        <Input type="checkbox" name="Celulares y accesorios" label="Celulares y accesorios" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Celulares y accesorios")} />
                        <Input type="checkbox" name="Videojuegos" label="Videojuegos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Videojuegos")} />
                    </fieldset>
                )
            }]}
        />
    );

    const VehiclesDropdown = () => (
        <Dropdown
            text="Vehículos y Repuestos"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Vehículos" label="Vehículos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Vehículos")} />
                        <Input type="checkbox" name="Repuestos y autopartes" label="Repuestos y autopartes" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Repuestos y autopartes")} />
                        <Input type="checkbox" name="Motocicletas" label="Motocicletas" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Motocicletas")} />
                        <Input type="checkbox" name="Náutica" label="Náutica" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Náutica")} />
                    </fieldset>
                )
            }]}
        />
    );

    const HogarDropdown = () => (
        <Dropdown
            text="Hogar y Herramientas"
            cndiv="ml-10 md:ml-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Electrodomésticos" label="Electrodomésticos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Electrodomésticos")} />
                        <Input type="checkbox" name="Hogar y Cocina" label="Hogar y Cocina" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Hogar y Cocina")} />
                        <Input type="checkbox" name="Herramientas y Ferretería" label="Herramientas y Ferretería" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Herramientas y Ferretería")} />
                        <Input type="checkbox" name="Jardín y exteriores" label="Jardín y exteriores" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Jardín y exteriores")} />
                    </fieldset>
                )
            }]}
        />
    );

    const Rentals = () => (
        <Dropdown
            text="Alquileres"
            cndiv="mr-10"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Alquiler de campos" label="Alquiler de campos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Alquiler de campos")} />
                        <Input type="checkbox" name="Alquiler de casas" label="Alquiler de casas" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Alquiler de casas")} />
                        <Input type="checkbox" name="Alquiler de herramientas" label="Alquiler de herramientas" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Alquiler de herramientas")} />
                    </fieldset>
                )
            }]}
        />
    );

    const NinosDropdown = () => (
        <Dropdown
            text="Niños y Bebés"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Bebés y niños" label="Bebés y niños" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Bebés y niños")} />
                        <Input type="checkbox" name="Juguetes" label="Juguetes" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Juguetes")} />
                    </fieldset>
                )
            }]}
        />
    );

    const OficinaDropdown = () => (
        <Dropdown
            text="Oficina y Estudio"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Oficina y papelería" label="Oficina y papelería" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Oficina y papelería")} />
                        <Input type="checkbox" name="Libros" label="Libros" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Libros")} />
                    </fieldset>
                )
            }]}
        />
    );

    const GanadoDropdown = () => (
        <Dropdown
            text="Ganado"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Ganado bovino" label="Ganado bovino" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ganado bovino")} />
                        <Input type="checkbox" name="Ganado ovino" label="Ganado ovino" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ganado ovino")} />
                        <Input type="checkbox" name="Ganado equino" label="Ganado equino" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ganado equino")} />
                        <Input type="checkbox" name="Ganado caprino" label="Ganado caprino" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Ganado caprino")} />
                    </fieldset>
                )
            }]}
        />
    );

    const MascotasDropdown = () => (
        <Dropdown
            text="Mascotas"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Perros" label="Perros" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Perros")} />
                        <Input type="checkbox" name="Gatos" label="Gatos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Gatos")} />
                        <Input type="checkbox" name="Mascotas" label="Mascotas" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Mascotas")} />
                    </fieldset>
                )
            }]}
        />
    );

    const AgroDropdown = () => (
        <Dropdown
            text="Agro"
            cndiv="px-3"
            direction={direction}
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Agro e insumos rurales" label="Agro e insumos rurales" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Agro e insumos rurales")} />
                        <Input type="checkbox" name="Herramientas de campo" label="Herramientas de campo" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Herramientas de campo")} />
                        <Input type="checkbox" name="Maquinaria agrícola" label="Maquinaria agrícola" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Maquinaria agrícola")} />
                        <Input type="checkbox" name="Alimentos agroindustriales" label="Alimentos agroindustriales" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Alimentos agroindustriales")} />
                        <Input type="checkbox" name="Productos orgánicos" label="Productos orgánicos" register={register} watch={watch} errors={errors} className='!flex-row' defaultChecked={isSelected("Productos orgánicos")} />
                    </fieldset>
                )
            }]}
        />
    );

    const renderMobileCategories = () => (
        <fieldset className='flex flex-col items-start justify-center w-100'>
            <section className='grid grid-cols-2 gap-1 w-full'>
                <VestimentaDropdown />
                <TecnologiaDropdown />
            </section>

            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <VehiclesDropdown />
                <AgroDropdown />
            </section>

            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <NinosDropdown />
                <OficinaDropdown />
            </section>

            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <GanadoDropdown />
                <MascotasDropdown />
            </section>

            <section className='grid grid-cols-2 w-full mt-4 justify-items-center'>
                <HogarDropdown />
                <Rentals />
            </section>

            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Instrumentos Musicales"
                    label="Instrumentos Musicales"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full ml-4.5'
                    defaultChecked={isSelected("Instrumentos Musicales")}
                />
                <Input
                    type="checkbox"
                    name="Accesorios"
                    label="Accesorios"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Accesorios")}
                />
            </section>

            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Salud y Belleza"
                    label="Salud y Belleza"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full ml-4.5'
                    defaultChecked={isSelected("Salud y Belleza")}
                />
                <Input
                    type="checkbox"
                    name="Deportes y Aire libre"
                    label="Deportes y Aire libre"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Deportes y Aire libre")}
                />
            </section>

            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Música y Películas"
                    label="Música y Películas"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full ml-4.5'
                    defaultChecked={isSelected("Música y Películas")}
                />
                <Input
                    type="checkbox"
                    name="Alimentos y Bebidas"
                    label="Alimentos y Bebidas"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Alimentos y Bebidas")}
                />
            </section>

            <section className='grid grid-cols-2 mb-6 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Aves de corral"
                    label="Aves de corral"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full ml-4.5'
                    defaultChecked={isSelected("Aves de corral")}
                />
                <Input
                    type="checkbox"
                    name="Inmuebles"
                    label="Inmuebles"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Inmuebles")}
                />
            </section>
        </fieldset>
    );

    const renderDesktopCategories = () => (
        <fieldset className='flex flex-col items-start justify-center w-full max-w-full'>
            <section className='grid grid-cols-3 gap-6 w-full'>
                <VestimentaDropdown />
                <TecnologiaDropdown />
                <VehiclesDropdown />
            </section>

            <section className='grid grid-cols-3 gap-6 w-full mt-4'>
                <HogarDropdown />
                <NinosDropdown />
                <OficinaDropdown />
            </section>

            <section className='grid grid-cols-3 gap-6 w-full mt-4'>
                <GanadoDropdown />
                <MascotasDropdown />
                <AgroDropdown />
            </section>

            <section className='grid grid-cols-4 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Instrumentos Musicales"
                    label="Instrumentos Musicales"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Instrumentos Musicales")}
                />
                <Input
                    type="checkbox"
                    name="Accesorios"
                    label="Accesorios"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Accesorios")}
                />
                <Input
                    type="checkbox"
                    name="Salud y Belleza"
                    label="Salud y Belleza"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Salud y Belleza")}
                />
                <Input
                    type="checkbox"
                    name="Deportes y Aire libre"
                    label="Deportes y Aire libre"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Deportes y Aire libre")}
                />
            </section>

            <section className='grid grid-cols-4 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Música y Películas"
                    label="Música y Películas"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Música y Películas")}
                />
                <Input
                    type="checkbox"
                    name="Alimentos y Bebidas"
                    label="Alimentos y Bebidas"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Alimentos y Bebidas")}
                />
                <Input
                    type="checkbox"
                    name="Aves de corral"
                    label="Aves de corral"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Aves de corral")}
                />
                <Input
                    type="checkbox"
                    name="Inmuebles"
                    label="Inmuebles"
                    register={register}
                    watch={watch}
                    errors={errors}
                    className='!flex-row w-full'
                    defaultChecked={isSelected("Inmuebles")}
                />
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
                    content: isMobile ? renderMobileCategories() : renderDesktopCategories()
                }
            ]}
        />
    )
}