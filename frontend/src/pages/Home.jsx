import { useState, useEffect, useRef, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import AnimationScroll from '../components/AnimationScroll';
import { useNavigate } from 'react-router-dom';
import { CiSliderHorizontal } from "react-icons/ci";
import Button from '../components/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { LuSearchX } from "react-icons/lu";
import { TypeAnimation } from 'react-type-animation';
import Carrusel from '../components/Carrusel'
import carrusel1 from '../assets/carrusel1.webp'
import carrusel2 from '../assets/carrusel2.webp'
import carrusel3 from '../assets/carrusel3.webp'
import ranking from '../assets/ranking.webp'
import { IoArrowDownCircleOutline } from "react-icons/io5";
import Card from '../components/Card'
import { IoShirt } from "react-icons/io5";
import { RiComputerFill } from "react-icons/ri";
import { FaTools } from "react-icons/fa";
import { MdToys } from "react-icons/md";
import { FaFootballBall } from "react-icons/fa";
import { IoCarSportSharp } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { GiLipstick } from "react-icons/gi";
import { IoWatchSharp } from "react-icons/io5";
import { TbCircleNumber1Filled } from "react-icons/tb";
import { TbCircleNumber2Filled } from "react-icons/tb";
import { TbCircleNumber3Filled } from "react-icons/tb";
import { TbCircleNumber4Filled } from "react-icons/tb";


export default function Home({ searchData, userType, setSearchData, loading = false }) {
    const { ecommerce } = useParams();

    let user = null;
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user
    }

    const [imageHome, setImageHome] = useState(null)

    const [bestSellersData, setBestSellersData] = useState(null);
    const [loadingBestSellers, setLoadingBestSellers] = useState(false);

    useEffect(() => {
        if (ecommerce) {
            axios.post("/api/show_image_home.php", { nameEcommerce: ecommerce })
                .then((res) => {
                    setImageHome(res.data.img.home)
                })
                .catch((err) => console.log(err))

            axios.post("/api/best_sellers.php", { ecommerce })
                .then((res) => {
                    console.log(res)
                    setBestSellersData(res.data.data);
                })
                .catch((res) => console.log(res))
        }
    }, [ecommerce])

    const navigate = useNavigate();

    const carruselRef = useRef(null);
    const [isInView, setIsInView] = useState(true);

    const [carruselEl, setCarruselEl] = useState(null);

    useEffect(() => {
        if (!carruselEl) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { root: null, threshold: 0.1, rootMargin: "-120px 0px 0px 0px" }
        );

        observer.observe(carruselEl);

        return () => observer.unobserve(carruselEl);
    }, [carruselEl]);




    const [rankingImg, setRankingImg] = useState(null)
    useEffect(() => {
        axios.post("/api/ranking.php")
            .then(res => setRankingImg(res.data.data))
            .catch(res => console.log(res))
    }, [])

    const uniqueProducts = searchData && Array.isArray(searchData)
        ? Array.from(new Map(searchData.map(item => [item.id_producto, item])).values())
        : [];

    const noResults = searchData === "error" || (Array.isArray(searchData) && searchData.length === 0);

    function showProducts(data) {
        const jsx = [];
        for (let i = 0; i < data.length; i += 3) {
            const chunk = data.slice(i, i + 3);

            jsx.push(
                <AnimationScroll key={chunk[0].id_producto}>
                    <section className='flex items-center w-full justify-center'>
                        {chunk.map((producto) => (
                            <ProductCard
                                key={producto.id_producto}
                                name={producto.nombre_producto}
                                rating={producto.rating}
                                price={producto.precio}
                                image={`/api/${producto.ruta_imagen}`}
                                image2={producto.imagen_2 && `/api/${producto.imagen_2}`}
                                stock={producto.stock}
                                freeShipping={true}
                                phone={false}
                                onDelete={() => handleDeleteProduct(producto.id_producto)}
                                admin={userType}
                                onClick={() => ecommerce ? navigate(`product/${producto.id_producto}`) : navigate(`/product/${producto.id_producto}`)}
                            />
                        ))}
                    </section>
                </AnimationScroll>
            );
        }
        return jsx;
    }

    function showProductsMobile(data) {
        const jsx = [];
        for (let i = 0; i < data.length; i += 2) {
            const chunk = data.slice(i, i + 2);

            jsx.push(
                <AnimationScroll key={chunk[0].id_producto}>
                    <section className="flex flex-wrap items-start justify-start w-full">
                        {chunk.map((producto) => (
                            <ProductCard
                                key={producto.id_producto}
                                phone={true}
                                name={producto.nombre_producto}
                                rating={producto.rating}
                                price={producto.precio}
                                image={`/api/${producto.ruta_imagen}`}
                                image2={producto.imagen_2 && `/api/${producto.imagen_2}`}
                                stock={producto.stock}
                                freeShipping={true}
                                onDelete={() => handleDeleteProduct(producto.id_producto)}
                                admin={userType}
                                onClick={() =>
                                    ecommerce
                                        ? navigate(`product/${producto.id_producto}`)
                                        : navigate(`/product/${producto.id_producto}`)
                                }
                            />
                        ))}
                    </section>
                </AnimationScroll>
            );
        }
        return jsx;
    }



    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    function handleDeleteProduct(id) {
        axios.post("/api/delete_product.php", {
            "id": id
        })
            .then((res) => {
                setSearchData(prevSearchData =>
                    prevSearchData.filter(p => p && p.id_producto !== id)
                );
                console.log(res)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        console.log(searchData)
        if (searchData !== null) {
            setSearchData(null);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [animation, setAnimation] = useState(null);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (uniqueProducts.length === 0) {
            setAnimation(false);
            return;
        }
        setAnimation(false);
        const timer = setTimeout(() => {
            setAnimation(true);
        }, 50);
        return () => clearTimeout(timer);

    }, [uniqueProducts]);

    const NoResultsMessage = () => (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-center">
                <h3 className="text-2xl font-bold whitespace-nowrap font-quicksand text-gray-800 mb-2">
                    No se encontraron resultados
                </h3>
                <p className="text-gray-500 font-semibold font-quicksand">
                    Intenta con otra búsqueda o verifica la ortografía
                </p>
                <LuSearchX className='text-gray-500 text-4xl m-auto mt-3' />
            </div>
        </div>
    );

    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startTranslateX, setStartTranslateX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const lastTimeRef = useRef(Date.now());
    const isPausedRef = useRef(isPaused);
    const isDraggingRef = useRef(isDragging);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        isDraggingRef.current = isDragging;
    }, [isDragging]);

    const categories = useMemo(() => [
        { icon: IoShirt, label: "Ropa" },
        { icon: RiComputerFill, label: "Tecnología" },
        { icon: FaTools, label: "Herramientas" },
        { icon: MdToys, label: "Juguetes" },
        { icon: FaFootballBall, label: "Deporte" },
        { icon: IoCarSportSharp, label: "Vehículos" },
        { icon: MdPets, label: "Mascotas" },
        { icon: IoWatchSharp, label: "Accesorios" },
        { icon: GiLipstick, label: "Salud y Belleza" },
    ], []);

    const duplicatedCategories = [...categories, ...categories, ...categories];

    useEffect(() => {
        let animationId;
        const speed = 0.5;
        const cardWidth = windowWidth < 768 ? 112 : 168;
        const gap = 32;
        const itemWidth = cardWidth + gap;
        const totalWidth = categories.length * itemWidth;

        const animate = () => {
            if (!isPausedRef.current && !isDraggingRef.current) {
                const now = Date.now();
                const delta = now - lastTimeRef.current;
                lastTimeRef.current = now;

                setTranslateX(prev => {
                    const newVal = prev - (speed * delta / 16);
                    if (Math.abs(newVal) >= totalWidth) {
                        return newVal % totalWidth;
                    }
                    return newVal;
                });
            }
            animationId = requestAnimationFrame(animate);
        };

        lastTimeRef.current = Date.now();
        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [windowWidth, categories.length]);


    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setStartTranslateX(translateX);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX);
        setStartTranslateX(translateX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = x - startX;
        setTranslateX(startTranslateX + walk);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX;
        const walk = x - startX;
        setTranslateX(startTranslateX + walk);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        lastTimeRef.current = Date.now();
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        lastTimeRef.current = Date.now();
    };

    return (
        <section
            className={`
    flex flex-col items-center justify-between
    transition-colors duration-1000 ease-in-out
    min-h-[50%]
    ${searchData || ecommerce || loading ? "bg-transparent" : !isInView ? "bg-white" : "bg-sky-800"}
  `}>

            {!searchData ? (
                ecommerce ? (
                    <>
                        <section
                            className="overflow-hidden relative flex items-start bg-black justify-start w-full"
                        >
                            <img
                                loading="lazy"
                                src={`/api/${imageHome}`}
                                alt="Imagen principal"
                                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                            />
                        </section>

                        {windowWidth >= 500 && bestSellersData ? showProducts(bestSellersData) :
                        bestSellersData && showProductsMobile(bestSellersData)}
                    </>
                ) : (
                    <section className={`flex flex-col mt-8 items-center h-full md:justify-between justify-start w-full relative`} >
                        <h2 className="text-white mt-4 md:mt-0 font-semibold text-3xl md:text-4xl lg:text-4xl h-18 font-poppins w-3/4 text-center">
                            <TypeAnimation
                                sequence={[
                                    'Tu ecommerce listo en un par de clics. Compra, vende y crece.',
                                ]}
                                speed={55}
                                cursor={true}
                                wrapper="span"
                                repeat={0}
                            />
                        </h2>
                        <button
                            onClick={() => ecommerce ? navigate(`/${ecommerce}/register/`) : navigate("/register/")}
                            className="md:w-46 w-46 mt-18 mb-15 translate-y-4 md:mt-6 md:mb-6 md:p-2 p-3 bg-sky-700 transition-colors hover:bg-white hover:text-sky-700 cursor-pointer text-white font-semibold rounded-3xl duration-500 whitespace-nowrap !shadow-none text-lg font-quicksand flex items-center justify-center"
                        >Comenzar</button>
                        <section ref={setCarruselEl} className='w-[90%] flex items-center justify-center'>
                            <Carrusel
                                multiple={true}
                                home={true}
                                autoPlay={false}
                                productData={false}
                                showProductInfo={false}
                                className="w-full max-w-4xl rounded-3xl"
                                images={[carrusel1, carrusel2, carrusel3]}
                            />
                        </section>
                        <IoArrowDownCircleOutline className={"text-white mt-4 text-5xl"} />
                        <AnimationScroll>
                            <section className="w-full max-w-screen translate-y-12 overflow-hidden">
                                <div
                                    ref={scrollContainerRef}
                                    className="flex gap-8 p-8 overflow-hidden select-none"
                                    style={{
                                        cursor: isDragging ? 'grabbing' : 'grab'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <div
                                        className="flex gap-8 min-w-max"
                                        style={{
                                            transform: `translateX(${translateX}px)`,
                                            willChange: 'transform'
                                        }}
                                    >
                                        {duplicatedCategories.map((category, index) => {
                                            const IconComponent = category.icon;
                                            return (
                                                <Card
                                                    key={index}
                                                    className="md:w-42 md:h-42 w-28 h-28 flex-shrink-0 !rounded-full !bg-sky-800 group hover:!bg-white 
                          !border-4 transition-all ease-in-out duration-700 !border-sky-800 cursor-pointer 
                          flex flex-col items-center justify-center"
                                                >
                                                    <IconComponent className="text-6xl group-hover:text-sky-800 text-white" />
                                                    <span className="font-quicksand text-white text-md md:text-xl font-bold group-hover:text-sky-800">
                                                        {category.label}
                                                    </span>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        </AnimationScroll>
                        <section className='flex mt-12 flex-col w-full p-2 md:p-12 items-center justify-center'>
                            <section className='flex flex-col md:flex-row w-full md:w-[90%] p-3'>
                                <section className="flex flex-col w-full md:w-1/2 items-start justify-start text-start md:mr-6">
                                    <TbCircleNumber1Filled className="text-sky-800 text-5xl" />
                                    <h2 className='font-quicksand mb-2 text-gray-900 font-bold text-3xl'>
                                        Tu e-commerce listo en minutos
                                    </h2>
                                    <p className='font-quicksand text-xl text-gray-800 font-semibold'>
                                        Creá tu tienda dentro de Tolo con unos clics — sin programar, sin servidores, sin estrés. Nosotros nos encargamos de TODO: envíos, pagos, mantenimiento, hosting… vos solo te enfocás en vender.
                                        Tener tu propio e-commerce nunca fue tan fácil ni tan rápido.
                                    </p>
                                </section>
                                <section className="flex md:ml-6 w-full md:w-1/2 flex-col items-start justify-start text-start">
                                    <TbCircleNumber2Filled className='text-5xl text-sky-800' />
                                    <h2 className='font-quicksand mb-2 font-bold text-3xl text-gray-900'>
                                        No pierdas más clientes, (ni tiempo)
                                    </h2>
                                    <p className='font-quicksand text-xl text-gray-800 font-semibold'>
                                        Cada día sin tienda online es una venta que se te escapa. Tus clientes ya compran en digital, y si no te encuentran… se van con otro.
                                        Con Tolo, tu negocio está abierto 24/7, automatizado y listo para atender incluso mientras dormís.
                                    </p>
                                </section>
                            </section>
                            <section className='flex flex-col md:flex-row w-[90%] md:p-3'>
                                <section className="flex ml-0 md:mr-6 w-full md:w-1/2 flex-col items-start justify-start text-start">
                                    <TbCircleNumber3Filled className="text-sky-800 text-5xl" />
                                    <h2 className='font-quicksand mb-2 text-gray-900 font-bold text-3xl'>
                                        Crecé y pagá menos comisión
                                    </h2>
                                    <p className='font-quicksand text-xl text-gray-800 font-semibold'>
                                        En Tolo, crecer tiene premio. Cuanto más vendés, menos comisión pagás. Subí de rango, aumentá tu rentabilidad y hacé que cada venta valga más.
                                        Acá, el éxito se nota también en tu bolsillo.
                                    </p>
                                </section>
                                <section className="flex ml-0 md:ml-6 w-full md:w-1/2 flex-col items-start justify-start text-start">
                                    <TbCircleNumber4Filled className='text-5xl text-sky-800' />
                                    <h2 className='font-quicksand mb-2 font-bold text-3xl text-gray-900'>
                                        Todo lo que buscás, en un solo lugar.
                                    </h2>
                                    <p className='font-quicksand text-xl text-gray-800 font-semibold'>
                                        Olvidate de abrir mil pestañas y buscar tienda por tienda. En Tolo encontrás de productos cientas de tiendas Uruguayas, reunidos en una sola plataforma rápida, simple y personalizada para vos.
                                        Comprar nunca fue tan fácil.
                                    </p>
                                </section>
                            </section>
                        </section>
                        <h3 className={`${!isInView ? "opacity-100" : "opacity-0"} text-gray-900 mt-4 md:mt-0 font-bold text-3xl md:text-4xl lg:text-4xl h-18 translate-y-8 md:translate-y-14 font-quicksand w-3/4 text-center mb-8`}>Ranking de mejores tiendas del mes</h3>
                        <span className={"font-quicksand text-gray-800 w-3/4 text-2xl  font-semibold "}>¿Tu tienda podría estar acá el mes que viene?</span>
                        <section className={`${!isInView ? "opacity-100" : "opacity-0"} transition-opacity -translate-y-6 ease-in-out duration-700 w-[100%] md:w-[50%] lg:w-[45%] relative flex items-center justify-center`}>
                            {rankingImg && (
                                <section className='absolute inset-0 z-10'>
                                    <img
                                        onClick={() => navigate(`/${rankingImg[1]["nombre_ecommerce"]}`)}
                                        loading='lazy'
                                        className='cursor-pointer absolute transition-transform ease-in-out duration-500 hover:scale-110 object-contain w-[16%] sm:w-[11%] md:w-[10%] left-[20%] top-[38%] md:left-[22%] md:top-[43%]'
                                        src={`/api/${rankingImg[1]["logo"]}`}
                                        alt="2do lugar"
                                    />

                                    <img
                                        onClick={() => navigate(`/${rankingImg[0]["nombre_ecommerce"]}`)}
                                        loading='lazy'
                                        className='transition-transform ease-in-out duration-500 hover:scale-110 bg-transparent cursor-pointer absolute object-contain w-[16%] left-[42%] top-[11%]'
                                        src={`/api/${rankingImg[0]["logo"]}`}
                                        alt="1er lugar"
                                    />

                                    <img
                                        onClick={() => navigate(`/${rankingImg[2]["nombre_ecommerce"]}`)}
                                        loading='lazy'
                                        className='transition-transform ease-in-out duration-500 hover:scale-110 bg-transparent cursor-pointer absolute object-contain w-[16%] right-[19%] top-[31%]'
                                        src={`/api/${rankingImg[2]["logo"]}`}
                                        alt="3er lugar"
                                    />
                                </section>
                            )}

                            <img
                                src={ranking}
                                loading="lazy"
                                className="object-contain w-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]"
                                alt="Ranking podio"
                            />


                            <section>
                            </section>
                        </section>


                    </section>
                )
            ) : (
                !loading ? (
                    noResults ? (
                        <NoResultsMessage />
                    ) : windowWidth < 500 ? (
                        <section className={`flex flex-col mb-20 w-full items-center justify-center transition-opacity ease-in-out `}>
                            {showProductsMobile(uniqueProducts)}
                        </section>
                    ) : (
                        <section className={`flex flex-col mb-20 w-full items-center justify-center transition-opacity ease-in-out `}>
                            {uniqueProducts.length > 1 && windowWidth > 500 ? showProducts(uniqueProducts) : uniqueProducts.map((producto) => (
                                <AnimationScroll key={producto.id_producto}>
                                    <ProductCard
                                        key={producto.id_producto}
                                        name={producto.nombre_producto}
                                        rating={producto.rating}
                                        price={producto.precio}
                                        image={`/api/${producto.ruta_imagen}`}
                                        image2={producto.imagen_2 && `/api/${producto.imagen_2}`}
                                        stock={producto.stock}
                                        freeShipping={true}
                                        phone={windowWidth >= 500 ? false : true}
                                        onDelete={() => handleDeleteProduct(producto.id_producto)}
                                        admin={userType}
                                        onClick={() => ecommerce ? navigate(`product/${producto.id_producto}`) : navigate(`/product/${producto.id_producto}`)}
                                    />
                                </AnimationScroll>
                            ))}
                        </section>
                    )
                ) : (
                    <div className="fixed bottom-1/2 left-0 right-0 z-50 flex justify-center items-center h-20">
                        <ClipLoader size={60} color="#00000" />
                    </div>
                )
            )}
        </section >
    );
}