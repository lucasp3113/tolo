import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import logoToloBlue from '../assets/logoToloBlue.png'
import { FaBoxOpen } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import Dropdown from '../components/Dropdown';


export default function Product() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    function addProduct(data) {
        console.log(data)
    }
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Componentes de dropdowns para reutilizar
    const VestimentaDropdown = () => (
        <Dropdown
            text="Vestimenta"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="footwear" label="Calzado" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="menClothes" label="Ropa de hombre" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="womenClothes" label="Ropa de mujer" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="unisexClothes" label="Ropa unisex" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="boyClothes" label="Ropa de niño" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="girlClothes" label="Ropa de niña" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const TecnologiaDropdown = () => (
        <Dropdown
            text="Tecnología"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="electronics" label="Electrónica" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="computing" label="Computación" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="phonesAccessories" label="Celulares y accesorios" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="videogames" label="Videojuegos" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const VehiclesDropdown = () => (
        <Dropdown
            text="Vehículos y Repuestos"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="vehicles" label="Vehículos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="spareParts" label="Repuestos y autopartes" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="motorcycles" label="Motocicletas" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="nautical" label="Náutica" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const HogarDropdown = () => (
        <Dropdown
            text="Hogar y Herramientas"
            cndiv="ml-10"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="electrodomesticos" label="Electrodomésticos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="homeKitchen" label="Hogar y Cocina" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="toolsHardware" label="Herramientas y Ferretería" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="gardenOutdoor" label="Jardín y exteriores" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const Rentals = () => (
        <Dropdown
            text="Alquileres"
            cndiv="mr-10"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="fieldRentals" label="Alquiler de campos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="houseRentals" label="Alquiler de casas" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="toolRentals" label="Alquiler de herramientas" register={register} errors={errors} className='!flex-row' />

                    </fieldset>
                )
            }]}
        />
    );

    const NinosDropdown = () => (
        <Dropdown
            text="Niños y Bebés"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="babiesKids" label="Bebés y niños" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="toys" label="Juguetes" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const OficinaDropdown = () => (
        <Dropdown
            text="Oficina y Estudio"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="officeSupplies" label="Oficina y papelería" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="books" label="Libros" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const GanadoDropdown = () => (
        <Dropdown
            text="Ganado"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="cattle" label="Ganado bovino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="sheep" label="Ganado ovino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="horses" label="Ganado equino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="goats" label="Ganado caprino" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const MascotasDropdown = () => (
        <Dropdown
            text="Mascotas"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="dogs" label="Perros" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="cats" label="Gatos" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const AgroDropdown = () => (
        <Dropdown
            text="Agro"
            cndiv="px-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="agroSupplies" label="Agro e insumos rurales" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="fieldTools" label="Herramientas de campo" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="farmMachinery" label="Maquinaria agrícola" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="farmAnimals" label="Animales y ganado" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="agroFood" label="Alimentos agroindustriales" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="organicProducts" label="Productos orgánicos" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    // Render para móvil - filas de 2 dropdowns
    const renderMobileCategories = () => (
        <fieldset className='flex flex-col items-start justify-center w-100'>
            {/* Fila 1: Vestimenta - Tecnología */}
            <section className='grid grid-cols-2 gap- w-full'>
                <VestimentaDropdown />
                <TecnologiaDropdown />
            </section>

            {/* Fila 2: Vehículos - Hogar */}
            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <VehiclesDropdown />
                <AgroDropdown />

            </section>

            {/* Fila 3: Niños - Oficina */}
            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <NinosDropdown />
                <OficinaDropdown />
            </section>

            {/* Fila 4: Ganado - Mascotas */}
            <section className='grid grid-cols-2 gap-1 w-full mt-4'>
                <GanadoDropdown />
                <MascotasDropdown />
            </section>

            {/* Fila 5: Agro solo (centrado) */}
            <section className='grid grid-cols-2 w-full mt-4 justify-items-center'>
                <HogarDropdown />
                <Rentals />
            </section>

            {/* Checkboxes individuales - 2 columnas */}
            <section className='grid grid-cols-2 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="instrumentosMusicales"
                    label="Instrumentos Musicales"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="accessories"
                    label="Accesorios"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-2 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="healthBeauty"
                    label="Salud y Belleza"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="sportsOutdoors"
                    label="Deportes y Aire libre"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-2 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="musicMovies"
                    label="Música y Películas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="foodDrinks"
                    label="Alimentos y Bebidas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-2 mb-6 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="poultry"
                    label="Aves de corral"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="realEstate"
                    label="Inmuebles"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>
        </fieldset>
    );

    // Render para desktop - diseño original
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
                    name="instrumentosMusicales"
                    label="Instrumentos Musicales"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="accessories"
                    label="Accesorios"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="healthBeauty"
                    label="Salud y Belleza"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="sportsOutdoors"
                    label="Deportes y Aire libre"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-4 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="musicMovies"
                    label="Música y Películas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="foodDrinks"
                    label="Alimentos y Bebidas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="poultry"
                    label="Aves de corral"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="realEstate"
                    label="Inmuebles"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>
        </fieldset>
    );

    return (
        <form onSubmit={handleSubmit(addProduct)} className='w-85 mb-52 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
            <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
            <div className="flex flex-col mt-3 ml-3 items-start ">
                <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>Crear publicación</h2>
                <p className="text-sm whitespace-nowrap text-gray-600">Completá el formulario para crear una publicación.</p>
            </div>
            <Input
                name={"nameProduct"}
                label={"Nombre del producto"}
                placeholder={"Nombre del producto"}
                register={register}
                errors={errors}
                required={true}
                minLength={3}
                maxLength={25}
                icon={<FaBoxOpen />}
            />
            <Input
                type={"number"}
                name={"productPrice"}
                label={"Precio del producto"}
                placeholder={"Precio del producto"}
                register={register}
                errors={errors}
                required={true}
                icon={<FaDollarSign />}
                maxLength={20}
                validate={value => Number(value) > 0 || "El precio no puede ser negativo ni 0"}
            />
            <Input
                type={"number"}
                name={"productStock"}
                label={"Stock del producto"}
                placeholder={"Stock del producto"}
                register={register}
                errors={errors}
                required={true}
                icon={<FaBoxes />}
                validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
            />
            <Dropdown
                text="Categorias"
                cndiv="m-3 flex flex-col items-center justify-center Ñ"
                className="w-full m-auto px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800"
                options={[
                    {
                        type: "custom",
                        content: isMobile ? renderMobileCategories() : renderDesktopCategories()
                    }
                ]}
            />
            <Input
                type={"textarea"}
                name={"productDescription"}
                label={"Descripción del  producto"}
                placeholder={"Descripción del producto"}
                register={register}
                errors={errors}
                maxLength={2000}
            />
            <Button className={"w-50"} color={"blue"} size={"md"} text={"Añadir producto"} />

        </form>
    )
}