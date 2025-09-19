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
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [color, setColor] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [currentStep, setCurrentStep] = useState(null)
    const [sizes, setSizes] = useState(true)

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
    const [dataSizes, setDataSizes] = useState(null)
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

        } else if (currentStep === "showSizes") {
            axios.post("/api/show_sizes.php", {
                productId: productId
            })
                .then((res) => {
                    setDataSizes(res.data.data)
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
                nameStocks: arrStocks
            };

            const fd = new FormData();
            fd.append('json', JSON.stringify(payload));

            const files = watch(`imagesColor${i}`) || [];
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

    function createSize(data) {
        const sizes = [];
        const stocks = [];

        Object.keys(data).forEach(key => {
            if (key.startsWith("nameSize")) {
                sizes.push(data[key]);
            }
            if (key.startsWith("nameStockSize")) {
                stocks.push(data[key]);
            }
        });
        axios.post("/api/create_size.php", {
            productId: productId,
            sizes: sizes,
            stocks: stocks
        })
            .then((res) => setCurrentStep("showSizes"))
            .catch((err) => console.log(err))
    }

    function deleteSize(idSize) {
        console.log(idSize)
        axios.post("/api/delete_size.php", {
            idSize: idSize
        })
            .then((res) => {
                setDataSizes(prevSizes => prevSizes.filter(s => s.id_talle !== idSize));
                console.log(res);
            })
            .catch((err) => console.log(err))
    }

    function createCharac(dataForm) {
        const data = [];
        Object.values(dataForm).forEach((d) => {
            data.push(d)
        })
        axios.post("/api/create_charac.php", {
            productId: productId,
            data: data
        })
            .then((res) => {
                setCurrentStep("showCharac")
                setDataCharac(res.data.data)
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
        const watchedColorFiles = watch(`imagesColor${displayNumber}`)
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
                    register={register}
                    errors={errors}
                    required={true}
                    minLength={3}
                    maxLength={25}
                    icon={<IoMdColorPalette />}
                />

                <Input
                    type="file"
                    name={`imagesColor${displayNumber}`}
                    label="Imágenes del producto"
                    register={register}
                    errors={errors}
                    multiple={true}
                    required={true}
                />

                {(watch(`imagesColor${displayNumber}`) && watch(`imagesColor${displayNumber}`).length > 0) && (
                    <div className="m-3">
                        <p className="text-sm text-gray-600 mb-2">{watch(`imagesColor${displayNumber}`).length} imagen(es) seleccionada(s):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Array.from(watch(`imagesColor${displayNumber}`)).map((file, idx) => {
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

                <h3 className='font-quicksand m-auto w-full font-semibold text-md'>Talles del color</h3>

                {visibleSizesForColor.map((isVisible, sizeIdx) => (
                    isVisible && (
                        <section key={`${colorIdx}-${sizeIdx}`} className={`transition-opacity ease-in-out duration-700 opacity-100`}>
                            <Input
                                name={`nameSizeColor${displayNumber}${sizeIdx}`}
                                label={"Talle"}
                                placeholder={"Talle Ej: XS, M, XXL, 35, 40"}
                                register={register}
                                errors={errors}
                                required={true}
                                minLength={1}
                                maxLength={10}
                            />
                            <Input
                                name={`nameStockSizeColor${displayNumber}${sizeIdx}`}
                                label={"Stock del talle"}
                                placeholder={"Stock"}
                                register={register}
                                type={"number"}
                                errors={errors}
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
                    <FiPlus onClick={() => addColorSize(colorIdx)}  className='text-black text-3xl mt-2 mr-3 transition-transform duration-300 ease-in-out hover:scale-125' />
                </section>
            </section>
        )
    })

    const jsxSize = Array.from({ length: numSize }).map((_, idx) => (
        visibleSize[idx] && (
            <section key={idx} className={`transition-opacity ease-in-out duration-700 ${visibleSize[idx] ? "opacity-100" : "opacity-0"}`}>
                <Input
                    name={`nameSize${idx + 1}`}
                    label={"Talle"}
                    placeholder={"Talle Ej: XS, M, XXL, 35, 40"}
                    register={register}
                    errors={errors}
                    required={true}
                    minLength={1}
                    maxLength={10}
                />
                <Input
                    name={`nameStockSize${idx + 1}`}
                    label={"Stock del talle"}
                    placeholder={"Stock"}
                    register={register}
                    type={"number"}
                    errors={errors}
                    required={true}
                    validate={value => Number(value) >= 0 || "El stock no puede ser negativo"}
                />
                <section className='w-full flex items-center justify-end'>
                    {visibleSize.filter(v => v).length > 1 && (
                        <span
                            onClick={() => removeSize(idx)}
                            className='text-red-600 text-sm mr-3 cursor-pointer hover:text-red-800'
                        >
                            Eliminar talle
                        </span>
                    )}
                </section>
            </section>
        )
    ))

    const jsxCharac = Array.from({ length: numCharac }).map((_, idx) => (
        visibleCharac[idx] && (
            <section key={idx} className={`transition-opacity ease-in-out duration-700 ${visibleCharac[idx] ? "opacity-100" : "opacity-0"}`}>
                <Input
                    name={`nameCharac${idx + 1}`}
                    label={"Característica"}
                    placeholder={"Característica"}
                    register={register}
                    errors={errors}
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
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
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
                color ? setCurrentStep("addColor") : setCurrentStep("addSizes")

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
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    const watchedFiles = watch("images");
    const selectedFiles = watchedFiles ? Array.from(watchedFiles) : [];

    const men = watch("Ropa hombre");
    const women = watch("Ropa mujer");
    const boy = watch("Ropa niño");
    const girl = watch("Ropa niña");
    const unisex = watch("Ropa unisex");
    const footwear = watch("Calzado");
    const baby = watch("Bebés y niños");
    const accessories = watch("Accesorios");
    const toys = watch("Juguetes");
    const healthBeauty = watch("Salud y Belleza");
    const sportsOutdoor = watch("Deportes y Aire libre");
    const pets = watch("Mascotas");
    const computing = watch("Computación");
    const cellphonesAccessories = watch("Celulares y accesorios");
    const officeStationery = watch("Oficina y papelería");
    const appliances = watch("Electrodomésticos");
    const musicalInstruments = watch("Instrumentos Musicales");

    useEffect(() => {
        if (men || women || boy || girl || unisex || footwear || baby) {
            setSizes(true);
        } else {
            setSizes(false);
        }
    }, [men, women, boy, girl, unisex, footwear, baby]);

    useEffect(() => {
        if (
            men || women || boy || girl || unisex || footwear || accessories ||
            toys || healthBeauty || sportsOutdoor || pets || baby ||
            computing || cellphonesAccessories || officeStationery || appliances ||
            musicalInstruments
        ) {
            setColor(true)
        } else {
            setColor(false)
        }
    }, [
        men, women, boy, girl, unisex, footwear, accessories,
        toys, healthBeauty, sportsOutdoor, pets, baby,
        computing, cellphonesAccessories, officeStationery, appliances,
        musicalInstruments
    ]);

    switch (currentStep) {
        case "addColor":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl' onSubmit={handleSubmit(colorSave)}>
                    {color && (
                        <>
                            <h2 className='font-quicksand m-auto w-full font-semibold text-2xl'>Colores</h2>
                            {jsxColor}
                        </>
                    )}
                    <Button onClick={handleSubmit(colorSave)} className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
                </form>
            );

        case "showColors":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-semibold text-3xl'>Colores</h2>
                    {dataColors && dataColors.map((c, index) => (
                        <div className='flex items-center w-1/3 m-auto justify-between' key={`color${index}`}>
                            <span className='font-quicksand text-xl font-medium'>{c.nombre}</span>
                            {dataColors.length > 1 && (
                                <FaRegTrashCan onClick={() => colorDelete(c.id_color)} className='text-red-600 transition-transform duration-300 ease-in-out hover:scale-120' />
                            )}
                        </div>
                    ))}
                    <section className='flex items-center justify-between'>
                        <Button onClick={() => setCurrentStep("addColor")} className={"w-50"} color={"blue"} size={"md"} text={"Añadir color"} />
                        <Button onClick={() => setCurrentStep("addSize")} className={"w-50"} color={"green"} size={"md"} text={"Siguiente"} />
                    </section>
                </form>
            );
        case "addSizes":
            return (
                <form onSubmit={handleSubmit(createSize)} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-semibold text-2xl'>Talles</h2>
                    {jsxSize}
                    <section className='w-full flex items-center justify-end'>
                        <FiPlus onClick={addSize} className='text-black text-3xl mt-2 mr-3 transition-transform duration-300 ease-in-out hover:scale-125' />
                    </section>
                    <Button className={"w-50"} color={"blue"} size={"md"} text={"Guardar"} />
                </form>
            );
        case "showSizes":
            return (
                <form className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <h2 className='font-quicksand m-auto w-full font-semibold text-3xl'>Talles</h2>
                    {dataSizes && dataSizes.map((s, index) => (
                        <div className='flex items-center w-1/3 m-auto justify-between' key={`size${index}`}>
                            <span className='font-quicksand text-xl font-medium'>{s.talle}</span>
                            {dataSizes.length > 1 && (
                                <FaRegTrashCan onClick={() => deleteSize(s.id_talle)} className='text-red-600 transition-transform duration-300 ease-in-out hover:scale-120' />
                            )}
                        </div>
                    ))}
                    <section className='flex items-center justify-between'>
                        <Button onClick={() => setCurrentStep("addSize")} className={"w-50"} color={"blue"} size={"md"} text={"Añadir talle"} />
                        <Button onClick={() => setCurrentStep("addCharac")} className={"w-50"} color={"green"} size={"md"} text={"Siguiente"} />
                    </section>
                </form>
            )
        case "addCharac":
            return (
                <form onSubmit={handleSubmit(createCharac)} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
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
                    <h2 className='font-quicksand m-auto w-full font-semibold text-3xl'>Características</h2>
                    {dataCharac && dataCharac.map((c, index) => (
                        <div className='flex items-center w-full m-auto justify-between' key={`size${index}`}>
                            <span className='font-quicksand text-xl font-medium'>{c.caracteristica}</span>
                                <FaRegTrashCan onClick={() => deleteCharac(c.id_caracteristica)} className='text-red-600 transition-transform duration-300 ease-in-out hover:scale-120' />
                        </div>
                    ))}
                    <section className='flex items-center justify-between'>
                        <Button onClick={() => setCurrentStep("addCharac")} className={"w-50"} color={"blue"} size={"md"} text={"Añadir caracteristica"} />
                        <Button onClick={() => Navigate("/")} className={"w-50"} color={"green"} size={"md"} text={"Siguiente"} />
                    </section>
                </form>
            )
        default:
            return (
                <form onSubmit={handleSubmit(!edit ? addProduct : (data) => updateProduct(data, id))} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
                    <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
                    <div className="flex flex-col mt-3 ml-3 items-start ">
                        <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>{edit ? "Editar publicación" : "Crear publicación"}</h2>
                        <p className="text-sm whitespace-nowrap text-gray-600">{edit ? "Completá el formulario para editar la publicación." : "Completá el formulario para crear una publicación."}</p>
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
                    <DropdownCategories watch={watch} register={register} errors={errors} direction={"b"} />
                    {!sizes && (
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
                    )}
                    {!color && (
                        <Input
                            type="file"
                            name="images"
                            label="Imágenes del producto"
                            register={register}
                            errors={errors}
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
                        register={register}
                        errors={errors}
                        maxLength={2000}
                    />
                    <Input
                        type={"checkbox"}
                        name={"shipping"}
                        label={"Envío gratis"}
                        placeholder={"Envío gratis"}
                        register={register}
                        errors={errors}
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