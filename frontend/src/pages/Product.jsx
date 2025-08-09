import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import logoToloBlue from '../assets/logoToloBlue.png'
import { FaBoxOpen } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import Dropdown from '../components/Dropdown';
import axios from 'axios'


export default function Product() {
    const [isMobile, setIsMobile] = useState(false);
    // Remover el estado selectedFiles ya no se necesita
    
    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Función modificada para manejar múltiples archivos
    function addProduct(data) {
        console.log(data);
        const filteredArray = [];
        const categoryList = [];
        const valuesData = Object.entries(data);

        valuesData.forEach((v) => {
            if (v[1]) {
                if (v[1] === true) {
                    categoryList.push(v);
                } else {
                    filteredArray.push(v);
                }
            }
        });

        const cleanData = Object.fromEntries(filteredArray);
        const formData = new FormData();
        
        for (const key in cleanData) {
            formData.append(key, cleanData[key]);
        }
        
        formData.append("username", user);
        formData.append("categories", JSON.stringify(categoryList));
        
        // Manejar múltiples archivos usando watchedFiles
        if (watchedFiles && watchedFiles.length > 0) {
            Array.from(watchedFiles).forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append("imageCount", watchedFiles.length);
        }

        axios.post("/api/product_add.php", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    // Observar cambios en el input de archivos usando watch
    const watchedFiles = watch("images");
    
    // Convertir FileList a Array para el preview
    const selectedFiles = watchedFiles ? Array.from(watchedFiles) : [];

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
                        <Input type="checkbox" name="Calzado" label="Calzado" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ropa hombre" label="Ropa hombre" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ropa mujer" label="Ropa mujer" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Rop unisex" label="Rop unisex" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ropa niño" label="Ropa niño" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ropa niña" label="Ropa niña" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Electrónica" label="Electrónica" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Computación" label="Computación" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Celulares y accesorios" label="Celulares y accesorios" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Videojuegos" label="Videojuegos" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Vehículos" label="Vehículos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Repuestos y autopartes" label="Repuestos y autopartes" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Motocicletas" label="Motocicletas" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Náutica" label="Náutica" register={register} errors={errors} className='!flex-row' />
                    </fieldset>
                )
            }]}
        />
    );

    const HogarDropdown = () => (
        <Dropdown
            text="Hogar y Herramientas"
            cndiv="ml-10 md:ml-3"
            direction='b'
            options={[{
                type: "custom",
                content: (
                    <fieldset className='flex flex-col items-start justify-center'>
                        <Input type="checkbox" name="Electrodomésticos" label="Electrodomésticos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Hogar y Cocina" label="Hogar y Cocina" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Herramientas y Ferretería" label="Herramientas y Ferretería" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Jardín y exteriores" label="Jardín y exteriores" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Alquiler de campos" label="Alquiler de campos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Alquiler de casas" label="Alquiler de casas" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Alquiler de herramientas" label="Alquiler de herramientas" register={register} errors={errors} className='!flex-row' />

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
                        <Input type="checkbox" name="Bebés y niños" label="Bebés y niños" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Juguetes" label="Juguetes" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Oficina y papelería" label="Oficina y papelería" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Libros" label="Libros" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Ganado bovino" label="Ganado bovino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ganado ovino" label="Ganado ovino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ganado equino" label="Ganado equino" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Ganado caprino" label="Ganado caprino" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Perros" label="Perros" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Gatos" label="Gatos" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Mascotas" label="Mascotas" register={register} errors={errors} className='!flex-row' />
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
                        <Input type="checkbox" name="Agro e insumos rurales" label="Agro e insumos rurales" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Herramientas de campo" label="Herramientas de campo" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Maquinaria agrícola" label="Maquinaria agrícola" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Alimentos agroindustriales" label="Alimentos agroindustriales" register={register} errors={errors} className='!flex-row' />
                        <Input type="checkbox" name="Productos orgánicos" label="Productos orgánicos" register={register} errors={errors} className='!flex-row' />
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

            {/* Fila 5 */}
            <section className='grid grid-cols-2 w-full mt-4 justify-items-center'>
                <HogarDropdown />
                <Rentals />
            </section>

            {/* Checkboxes individuales - 2 columnas */}
            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Instrumentos Musicales"
                    label="Instrumentos Musicales"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full ml-4.5'
                />
                <Input
                    type="checkbox"
                    name="Accesorios"
                    label="Accesorios"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Salud y Belleza"
                    label="Salud y Belleza"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full ml-4.5'
                />
                <Input
                    type="checkbox"
                    name="Deportes y Aire libre"
                    label="Deportes y Aire libre"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-2 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Música y Películas"
                    label="Música y Películas"
                    register={register}
                    errors={errors}
                    className='!flex-row w-full ml-4.5'
                />
                <Input
                    type="checkbox"
                    name="Alimentos y Bebidas"
                    label="Alimentos y Bebidas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full '
                />
            </section>

            <section className='grid grid-cols-2 mb-6 gap-10 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Aves de corral"
                    label="Aves de corral"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full ml-4.5'
                />
                <Input
                    type="checkbox"
                    name="Inmuebles"
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
                    name="Instrumentos Musicales"
                    label="Instrumentos Musicales"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Accesorios"
                    label="Accesorios"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Salud y Belleza"
                    label="Salud y Belleza"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Deportes y Aire libre"
                    label="Deportes y Aire libre"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
            </section>

            <section className='grid grid-cols-4 gap-6 mt-4 w-full justify-items-start'>
                <Input
                    type="checkbox"
                    name="Música y Películas"
                    label="Música y Películas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Alimentos y Bebidas"
                    label="Alimentos y Bebidas"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Aves de corral"
                    label="Aves de corral"
                    register={register}
                    errors={errors}

                    className='!flex-row w-full'
                />
                <Input
                    type="checkbox"
                    name="Inmuebles"
                    label="Inmuebles"
                    register={register}
                    errors={errors}
                    className='!flex-row w-full'
                />
            </section>
        </fieldset>
    );

    return (
        <form onSubmit={handleSubmit(addProduct)} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
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
                type="file"
                name="images"
                label="Imágenes del producto"
                register={register}
                errors={errors}
                multiple={true}
                required={true}
            />

            {selectedFiles.length > 0 && (
                <div className="m-3">
                    <p className="text-sm text-gray-600 mb-2">
                        {selectedFiles.length} imagen(es) seleccionada(s):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedFiles.map((file, index) => {
                            
                            const imageUrl = URL.createObjectURL(file);
                            
                            return (
                                <div key={index} className="relative">
                                    <img 
                                        src={imageUrl} 
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        onLoad={() => URL.revokeObjectURL(imageUrl)}
                                    />
                                    <div className="mt-1">
                                        <span className="text-xs text-gray-500 block truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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