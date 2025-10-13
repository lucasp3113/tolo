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
import DropdownCategories from '../components/DropdownCategories'
import { IoMdColorPalette } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { FaT } from 'react-icons/fa6'
import { FaRegTrashCan } from "react-icons/fa6";
import { ImFacebook2 } from 'react-icons/im'
import { data } from 'react-router-dom'


export default function CreateProduct({ edit = false, onCancel, id }) {
    function finish() {
        axios.post("/api/create_notifications.php", {
            userId: userId,
            message: "Producto creado exitosamente"
        })
    }
    const formProduct = useForm();
    const formCharac = useForm();
    const formColor = useForm();

    const [color, setColor] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [currentStep, setCurrentStep] = useState(null)
    const [sizes, setSizes] = useState(false)

    const [numColor, setNumColor] = useState(1)
    const [visibleColors, setVisibleColors] = useState([true])

    const [colorSizes, setColorSizes] = useState([1])
    const [visibleColorSizes, setVisibleColorSizes] = useState([[true]])

    const [numSize, setNumSize] = useState(1)
    const [visibleSize, setVisibleSize] = useState([true])

    const [numCharac, setNumCharac] = useState(1)
    const [visibleCharac, setVisibleCharac] = useState([true])

    const [productId, setProductId] = useState(1);

    const [dataColors, setDataColors] = useState(null)
    const [dataCharac, setDataCharac] = useState(null)

    useEffect(() => {
        if (currentStep === "showColors") {
            axios.post("/api/show_colors.php", {
                productId: productId
            })
                .then((res) => {
                    setDataColors(res.data.data)
                })
                .catch((err) => console.log(err))

        } else if (currentStep === "showCharac") {
            axios.post("/api/show_charac.php", {
                productId: productId
            })
                .then((res) => {
                    setDataCharac(res.data.data)
                })
                .catch((err) => console.log(err))
        }
    }, [currentStep])


    function colorSave(formValues) {
        for (let i = 1; i <= numColor; i++) {
            const colorName = formValues[`nameColor${i}`];
            if (!colorName) continue;

            const sizesCount = colorSizes[i - 1];
            const arrSizes = [];
            const arrStocks = [];

            for (let j = 0; j < sizesCount; j++) {
                const sizeValue = formValues[`nameSizeColor${i}${j}`];
                const stockValue = formValues[`nameStockSizeColor${i}${j}`];
                if (sizeValue) arrSizes.push(sizeValue);
                if (stockValue) arrStocks.push(stockValue);
            }

            const payload = {
                idProducto: productId,
                nameColor: colorName,
                nameSizes: arrSizes,
                nameStocks: arrStocks,
                nameStockColor: formValues["nameStockColor"]
            };
            const fd = new FormData();
            fd.append('json', JSON.stringify(payload));
            console.log(payload)
            const files = formColor.watch(`imagesColor${i}`) || [];
            Array.from(files).forEach(file => fd.append('images[]', file));
            axios.post('/api/add_color.php', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => {
                    setCurrentStep("showColors")
                    console.log(res)
                    console.log(files)
                })
                .catch(err => console.log(err));
        }
    }

    function colorDelete(idColor) {
        axios.post("/api/delete_color.php", {
            idColor: idColor
        })
            .then((res) => {
                setDataColors(prevColors => prevColors.filter(c => c.id_color !== idColor));
                console.log(res);
            })
            .catch((err) => console.log(err))
    }

    function createCharac(dataForm) {
        const data = [];
        Object.values(dataForm).forEach((d) => {
            data.push(d)
        })
        console.log(dataForm)
        console.log(data)
        axios.post("/api/create_charac.php", {
            productId: productId,
            data: data
        })
            .then((res) => {
                setCurrentStep("showCharac")
                setDataCharac(res.data.data)
                console.log(productId)
            })
            .catch((err) => console.log(err))
    }

    function deleteCharac(idCharac) {
        axios.post("/api/delete_charac.php", {
            idCharac: idCharac
        })
            .then((res) => {
                setDataCharac(prevCharac => prevCharac.filter(c => c.id_caracteristica !== idCharac));
                console.log(res);
            })
            .catch((err) => console.log(err))
    }

    const addColorSize = (colorIndex) => {
        setColorSizes(prev => {
            const next = [...prev];
            next[colorIndex] = (next[colorIndex] || 1) + 1;
            return next;
        });

        setVisibleColorSizes(prev => {
            const next = prev.map(arr => [...arr]);
            if (!next[colorIndex]) next[colorIndex] = [];
            next[colorIndex].push(false);

            setTimeout(() => {
                setVisibleColorSizes(old => {
                    const updated = old.map(arr => [...arr]);
                    updated[colorIndex][updated[colorIndex].length - 1] = true;
                    return updated;
                });
            }, 50);

            return next;
        });
    };

    const removeColorSize = (colorIndex, sizeIdx) => {
        if (colorSizes[colorIndex] <= 1) return;

        setVisibleColorSizes(prev => {
            const next = prev.map(arr => [...arr]);
            if (next[colorIndex] && next[colorIndex][sizeIdx] !== undefined) {
                next[colorIndex][sizeIdx] = false;
            }
            return next;
        });

        setColorSizes(prev => {
            const next = [...prev];
            next[colorIndex] = Math.max(1, next[colorIndex] - 1);
            return next;
        });
    };

    const addSize = () => {
        const nextIndex = visibleSize.length;
        setNumSize(prev => prev + 1);
        setVisibleSize(prev => [...prev, false]);
        setTimeout(() => {
            setVisibleSize(prev => {
                const next = [...prev];
                next[nextIndex] = true;
                return next;
            });
        }, 50);
    }

    const removeSize = (sizeIdx) => {
        if (visibleSize.filter(v => v).length <= 1) return;

        setVisibleSize(prev => {
            const next = [...prev];
            next[sizeIdx] = false;
            return next;
        });
    }

    const addCharac = () => {
        setNumCharac(prev => prev + 1)
        setVisibleCharac(prev => [...prev, false])
        setTimeout(() => {
            setVisibleCharac(prev => prev.map((v, idx) => idx === prev.length - 1 ? true : v))
        }, 50)
    }
    const removeCharac = (characIdx) => {
        setVisibleCharac(prev => {
            const next = [...prev];
            next[characIdx] = false;
            return next;
        });
    }

    const jsxColor = Array.from({ length: numColor }).map((_, colorIdx) => {
        const displayNumber = colorIdx + 1
        const watchedColorFiles = formColor.watch(`imagesColor${displayNumber}`)
        const selectedColorFiles = watchedColorFiles ? Array.from(watchedColorFiles) : []

        const colorVisible = visibleColors[colorIdx] ?? false
        const sizesCount = colorSizes[colorIdx] ?? 1
        const visibleSizesForColor = visibleColorSizes[colorIdx] ?? Array.from({ length: sizesCount }).map((_, i) => i === 0)
        return (
            <section key={colorIdx} className={`transition-opacity ease-in-out duration-700 ${colorVisible ? "opacity-100" : "opacity-0"}`}>
                <Input
                    name={`nameColor${displayNumber}`}
                    label={"Color"}
                    placeholder={"Color"}
                    register={formColor.register}
                    errors={formColor.formState.errors}
                    required={true}
                    minLength={3}
                    maxLength={25}
                    icon={<IoMdColorPalette />}
                />

                <Input
                    type="file"
                    name={`imagesColor${displayNumber}`}
                    label="Imágenes del producto"
                    register={formColor.register}
                    errors={formColor.formState.errors}
                    multiple={true}
                    required={true}
                />

                {(formColor.watch(`imagesColor${displayNumber}`) && formColor.watch(`imagesColor${displayNumber}`).length > 0) && (
                    <div className="m-3">
                        <p className="text-sm text-gray-600 mb-2">{formColor.watch(`imagesColor${displayNumber}`).length} imagen(es) seleccionada(s):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Array.from(formColor.watch(`imagesColor${displayNumber}`)).map((file, idx) => {
                                const url = URL.createObjectURL(file);
                                return (
                                    <div key={idx} className="relative">
                                        <img src={url} alt={`preview`} className="w-full h-24 object-cover rounded-lg border border-gray-200" onLoad={() => URL.revokeObjectURL(url)} />
                                        <div className="mt-1">
                                            <span className="text-xs text-gray-500 block truncate">{file.name}</span>
                                            <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {sizes ? (
                    <>
                        <h3 className='font-quicksand m-auto w-full font-semibold text-md'>Talles del color</h3>
                        {visibleSizesForColor.map((isVisible, sizeIdx) => (
                            isVisible && (
                                <section key={`${colorIdx}-${sizeIdx}`} className={`transition-opacity ease-in-out duration-700 opacity-100`}>
                                    <Input
                                        name={`nameSizeColor${displayNumber}${sizeIdx}`}
                                        label={"Talle"}
                                        placeholder={"Talle Ej: XS, M, XXL, 35, 40"}
                                        register={formColor.register}
                                        errors={formColor.formState.errors}
                                        required={true}
                                        minLength={1}
                                        maxLength={10}
                                    />
                                    <Input
                                        name={`nameStockSizeColor${displayNumber}${sizeIdx}`}
                                        label={"Stock del talle"}
                                        placeholder={"Stock"}
                                        register={formColor.register}
                                        type={"number"}
                                        errors={formColor.formState.errors}
                                        required={true}
                                        validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
                                    />
                                    <section className='w-full flex items-center justify-end'>
                                        {visibleSizesForColor.filter(v => v).length > 1 && (
                                            <span
                                                onClick={() => removeColorSize(colorIdx, sizeIdx)}
                                                className='text-red-600 text-sm mr-3 cursor-pointer hover:text-red-800'
                                            >
                                                Eliminar talle
                                            </span>
                                        )}
                                    </section>
                                </section>
                            )
                        ))}
                        <section className='flex items-center justify-end'>
                            <FiPlus onClick={() => addColorSize(colorIdx)} className='text-black text-3xl mt-2 mr-3 transition-transform duration-300 ease-in-out hover:scale-125' />
                        </section>
                    </>
                ) : (
                    <Input
                        name={`nameStockColor`}
                        label={"Stock del color"}
                        placeholder={"Stock"}
                        register={formColor.register}
                        type={"number"}
                        errors={formColor.formState.errors}
                        required={true}
                        validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
                    />
                )}
            </section>
        )
    })

    const jsxCharac = Array.from({ length: numCharac }).map((_, idx) => (
        visibleCharac[idx] && (
            <section key={idx} className={`transition-opacity ease-in-out duration-700 ${visibleCharac[idx] ? "opacity-100" : "opacity-0"}`}>
                <Input
                    name={`nameCharac${idx + 1}`}
                    label={"Característica"}
                    placeholder={"Característica"}
                    register={formCharac.register}
                    errors={formCharac.formState.errors}
                    required={true}
                    minLength={3}
                    maxLength={25}
                    icon={<FaTag />}
                />
                <section className='w-full flex items-center justify-end'>
                    {visibleCharac.filter(v => v).length > 1 && (
                        <span
                            onClick={() => removeCharac(idx)}
                            className='text-red-600 text-sm mr-3 cursor-pointer hover:text-red-800'
                        >
                            Eliminar característica
                        </span>
                    )}
                </section>
            </section>
        )
    ))

    let user = null;
    let userId = null
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
        userId = payload.id_usuario
    }

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    function addProduct(data) {
        console.log(data);

        const { shipping, ...restData } = data;

        const filteredArray = [];
        const categoryList = [];
        const valuesData = Object.entries(restData);

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
        formData.append("shipping", shipping ? 1 : 0);

        formData.append("username", user);
        formData.append("categories", JSON.stringify(categoryList));
        if (watchedFiles && watchedFiles.length > 0) {
            Array.from(watchedFiles).forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append("imageCount", watchedFiles.length);
        }
        axios.post("/api/create_product.php", formData)
            .then(res => {
                console.log(res)
                setProductId(res.data.product_id);
                color ? setCurrentStep("addColor") : sizes ? setCurrentStep("addSizes") : setCurrentStep("addCharac")

            })
            .catch(err => console.log(err));
    }

    function updateProduct(data, productId) {
        const { shipping, ...restData } = data;

        const filteredArray = [];
        const categoryList = [];
        const valuesData = Object.entries(restData);

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
        formData.append("shipping", shipping ? 1 : 0);

        formData.append("username", user);
        formData.append("categories", JSON.stringify(categoryList));
        formData.append("id_publicacion", productId);

        if (watchedFiles && watchedFiles.length > 0) {
            Array.from(watchedFiles).forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append("imageCount", watchedFiles.length);
        }

        axios.post("/api/update_product.php", formData)
            .then(res => {
                axios.post("/api/create_notifications.php", {
                    userId: userId,
                    message: "Producto eliminado exitosamente"
                })
            })
            .catch(err => console.log(err));
    }

    const watchedFiles = formProduct.watch("images");
    const selectedFiles = watchedFiles ? Array.from(watchedFiles) : [];

    const electronics = formProduct.watch("Electrónica");
    const men = formProduct.watch("Ropa hombre");
    const women = formProduct.watch("Ropa mujer");
    const boy = formProduct.watch("Ropa niño");
    const girl = formProduct.watch("Ropa niña");
    const unisex = formProduct.watch("Ropa unisex");
    const footwear = formProduct.watch("Calzado");
    const accessories = formProduct.watch("Accesorios");
    const toys = formProduct.watch("Juguetes");
    const homeKitchen = formProduct.watch("Hogar y Cocina");
    const healthBeauty = formProduct.watch("Salud y Belleza");
    const sportsOutdoor = formProduct.watch("Deportes y Aire libre");
    const baby = formProduct.watch("Bebés y niños");
    const computing = formProduct.watch("Computación");
    const cellphonesAccessories = formProduct.watch("Celulares y accesorios");
    const officeStationery = formProduct.watch("Oficina y papelería");
    const automotive = formProduct.watch("Automotriz");
    const gardenOutdoor = formProduct.watch("Jardín y exteriores");
    const vehicles = formProduct.watch("Vehículos");
    const spareParts = formProduct.watch("Repuestos y autopartes");
    const motorcycles = formProduct.watch("Motocicletas");
    const nautical = formProduct.watch("Náutica");
    const appliances = formProduct.watch("Electrodomésticos");
    const musicalInstruments = formProduct.watch("Instrumentos Musicales");

    useEffect(() => {
        if (
            electronics || men || women || boy || girl || unisex || footwear ||
            accessories || toys || homeKitchen || healthBeauty || sportsOutdoor ||
            baby || computing || cellphonesAccessories || officeStationery ||
            automotive || gardenOutdoor || vehicles || spareParts || motorcycles ||
            nautical || appliances || musicalInstruments
        ) {
            setColor(true)
        } else {
            setColor(false)
        }
        if (men || women || boy || girl || unisex || footwear) {
            setSizes(true)
        } else {
            setSizes(false)
        }
    }, [
        electronics, men, women, boy, girl, unisex, footwear,
        accessories, toys, homeKitchen, healthBeauty, sportsOutdoor,
        baby, computing, cellphonesAccessories, officeStationery,
        automotive, gardenOutdoor, vehicles, spareParts, motorcycles,
        nautical, appliances, musicalInstruments
    ])


    switch (currentStep) {
        case "addColor":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl' onSubmit={formColor.handleSubmit(colorSave)}>
                    {color && (
                        <>
                            <h2 className='font-quicksand m-auto w-full font-semibold text-2xl'>Colores</h2>
                            {jsxColor}
                        </>
                    )}
                    <Button onClick={formColor.handleSubmit(colorSave)} className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
                </form>
            );

        case "showColors":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-black mb-2 text-3xl'>Colores</h2>
                    {dataColors && dataColors.map((c, index) => (
                        <div className='flex items-center w-45 m-auto justify-between mb-1 mt-1' key={`color${index}`}>
                            <img className={`w-10`} src={`/api/uploads/products/${c.ruta_imagen}`} loading='lazy' alt="" />
                            <span className='font-quicksand text-2xl font-semibold'>{c.nombre}</span>
                            {dataColors.length > 1 && (
                                <FaRegTrashCan onClick={() => colorDelete(c.id_color)} className='text-red-600 text-2xl transition-transform duration-300 ease-in-out hover:scale-120' />
                            )}
                        </div>
                    ))}
                    <section className='flex mt-2 items-center justify-between'>
                        <Button onClick={() => setCurrentStep("addColor")} className={"w-50"} color={"blue"} size={"md"} text={"Añadir color"} />
                        <Button onClick={() => setCurrentStep("addCharac")} className={"w-50"} color={"green"} size={"md"} text={"Siguiente"} />
                    </section>
                </form>
            );
        case "addSizes":
            return (
                <form onSubmit={formSize.handleSubmit(createSize)} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-semibold text-2xl'>Talles</h2>
                    {jsxSize}
                    <section className='w-full flex items-center justify-end'>
                        <FiPlus onClick={addSize} className='text-black text-3xl mt-2 mr-3 transition-transform duration-300 ease-in-out hover:scale-125' />
                    </section>
                    <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
                </form>
            );
        case "addCharac":
            return (
                <form onSubmit={formCharac.handleSubmit(createCharac)} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-semibold text-2xl'>Características</h2>
                    {jsxCharac}
                    <section className='w-full flex items-center justify-end'>
                        <FiPlus onClick={addCharac} className='text-gray-700 mt-2 text-3xl mr-3 transition-transform duration-300 ease-in-out hover:scale-125' />
                    </section>
                    <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
                </form>
            );
        case "showCharac":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-black text-3xl mb-2'>Características</h2>
                    {dataCharac && dataCharac.map((c, index) => (
                        <div className='flex items-center w-full m-auto justify-between' key={`size${index}`}>
                            <span className='font-quicksand text-xl font-semibold mt-2 mb-2'>{c.caracteristica}</span>
                            <FaRegTrashCan onClick={() => deleteCharac(c.id_caracteristica)} className='text-red-600 text-2xl transition-transform duration-300 ease-in-out hover:scale-120' />
                        </div>
                    ))}
                    <section className='flex mt-2 items-center justify-between'>
                        <Button onClick={() => setCurrentStep("addCharac")} className={"w-50"} color={"blue"} size={"md"} text={"Añadir caracteristica"} />
                        <Button onClick={() => finish()} className={"w-50"} color={"green"} size={"md"} text={"Siguiente"} />
                    </section>
                </form>
            )
        default:
            return (
                <form onSubmit={formProduct.handleSubmit(!edit ? addProduct : (data) => updateProduct(data, id))} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
                    <div className="flex flex-col mt-3 ml-3 items-start ">
                        <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>{edit ? "Editar publicación" : "Crear publicación"}</h2>
                        <p className="text-sm whitespace-nowrap text-gray-600">{edit ? "Completá el formulario para editar la publicación." : "Completá el formulario para crear una publicación."}</p>
                    </div>
                    <Input
                        name={"nameProduct"}
                        label={"Nombre del producto"}
                        placeholder={"Nombre del producto"}
                        register={formProduct.register}
                        errors={formProduct.formState.errors}
                        required={true}
                        minLength={3}
                        maxLength={30}
                        icon={<FaBoxOpen />}
                    />
                    <Input
                        type={"number"}
                        name={"productPrice"}
                        label={"Precio del producto"}
                        placeholder={"Precio del producto"}
                        register={formProduct.register}
                        errors={formProduct.formState.errors}
                        required={true}
                        icon={<FaDollarSign />}
                        maxLength={20}
                        validate={value => Number(value) > 0 || "El precio no puede ser negativo ni 0"}
                    />
                    <DropdownCategories watch={formProduct.watch} register={formProduct.register} errors={formProduct.formState.errors} direction={"b"} />
                    {!color && (
                        <Input
                            type={"number"}
                            name={"productStock"}
                            label={"Stock del producto"}
                            placeholder={"Stock del producto"}
                            register={formProduct.register}
                            errors={formProduct.formState.errors}
                            required={true}
                            icon={<FaBoxes />}
                            validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
                        />
                    )}
                    {!color && (
                        <Input
                            type="file"
                            name="images"
                            label="Imágenes del producto"
                            register={formProduct.register}
                            errors={formProduct.formState.errors}
                            multiple={true}
                            required={true}
                        />
                    )}
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
                        register={formProduct.register}
                        errors={formProduct.formState.errors}
                        maxLength={2000}
                    />
                    <Input
                        type={"checkbox"}
                        name={"shipping"}
                        label={"Envío gratis"}
                        placeholder={"Envío gratis"}
                        register={formProduct.register}
                        errors={formProduct.formState.errors}
                        required={false}
                        className='flex-col-reverse'
                    />
                    {edit ? (
                        <section className='flex items-center justify-center'>
                            <Button className={"w-50"} color={"green"} size={"md"} text={"Editar producto"} />
                            <Button className={"w-50"} color={"blue"} size={"md"} type='button' text={"Cancelar"} onClick={() => onCancel()} />
                        </section>
                    ) : (<Button className={"w-50"} color={"blue"} size={"md"} text={"Siguiente"} />)}
                </form>
            );
    }
}