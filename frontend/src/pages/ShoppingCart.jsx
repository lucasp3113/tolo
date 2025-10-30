import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimationScroll from '../components/AnimationScroll';
import ProductCard from '../components/ProductCard';
import { TbRuler2 } from 'react-icons/tb';
import Button from '../components/Button';
import Card from '../components/Card';
import { FaOpencart, FaStoreSlash } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { FaTruckFast } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown'
import CheckoutBricks from '../components/Checkout';

export default function ShoppingCart() {
  const { ecommerce } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [update, setUpdate] = useState(false);
  const [productos, setProductos] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [sellers, setSellers] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [categories, setCategories] = useState(null);
  const [priceShipping, setPriceShipping] = useState(null);
  const [currentStep, setCurrentStep] = useState("first");

  const [selectedSend, setSelectedSend] = useState("send");
  const { register, handleSubmit, formState: { errors }, setError } = useForm()
  const [departamento, setDepartamento] = useState(null);

  const [proceedToPayment, setProceedToPayment] = useState({});
  useEffect(() => {
    console.log(proceedToPayment)
    if (Object.keys(proceedToPayment).length > 0) {
      document.cookie = `proceedToPayment=${encodeURIComponent(JSON.stringify(proceedToPayment))}; path=/; max-age=3600`;
    }
  }, [proceedToPayment])
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    selectedSeller && calculateShipping(categories[selectedSeller]);
  }, [selectedSeller]);

  let user = null;
  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
    userId = payload.id_usuario
  }

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [map, setMap] = useState(null);

  useEffect(() => {
    axios.post("/api/show_map.php", { selectedSeller })
      .then(res => setMap(res.data))
      .catch(res => console.log(res))
  }, [selectedSeller])

  useEffect(() => {
    axios
      .post('/api/show_cart.php', { client: user })
      .then((res) => {
        const uniqueProducts = Array.from(
          new Map(
            res.data.data.map(item => [`${item.id_producto}-${item.vendedor}`, item])
          ).values()
        );

        setProductos(uniqueProducts);

        const dataSellers = Array.from(new Set(uniqueProducts.map(p => p.vendedor)));
        setSellers(dataSellers);
        ecommerce ? setSelectedSeller(ecommerce) : setSelectedSeller(dataSellers[0]);

        const objectPrice = {};
        const objectCategories = {};
        dataSellers.forEach(seller => {
          objectPrice[seller] = 0;
          objectCategories[seller] = [];
        });

        uniqueProducts.forEach(p => {
          objectPrice[p.vendedor] += parseFloat(p.precio_unitario) * p.cantidad;
          if (!objectCategories[p.vendedor].includes(p.nombre_categoria) && !p.envio_gratis) {
            objectCategories[p.vendedor].push(p.nombre_categoria);
          }
        });

        setTotalPrice(objectPrice);
        setCategories(objectCategories);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (!productos.length) return;

    const dataSellers = Array.from(new Set(productos.map(p => p.vendedor)));

    const objectPrice = {};
    const objectCategories = {};

    dataSellers.forEach(seller => {
      objectPrice[seller] = 0;
      objectCategories[seller] = [];
    });

    productos.forEach(p => {
      objectPrice[p.vendedor] += parseFloat(p.precio_unitario) * p.cantidad;
      if (!objectCategories[p.vendedor].includes(p.nombre_categoria) && !p.envio_gratis) {
        objectCategories[p.vendedor].push(p.nombre_categoria);
      }
    });

    setTotalPrice(objectPrice);
    setCategories(objectCategories);

    if (selectedSeller) {
      calculateShipping(objectCategories[selectedSeller]);
    }
  }, [productos, selectedSeller]);


  function deleteProduct(id_producto) {
    axios.post('/api/delete_product.php', { id_producto })
      .then(() => {
        setProductos(prev => prev.filter(p => p.id_producto !== id_producto));
      })
      .catch(err => console.log(err));
  }

  function calculateShipping(categorias) {
    const preciosCategorias = {
      "Electrónica": 743,
      "Electrodomésticos": 743,
      "Hogar y Cocina": 712,
      "Ropa hombre": 263,
      "Ropa mujer": 263,
      "Ropa niño": 263,
      "Ropa niña": 263,
      "Rop unisex": 263,
      "Calzado": 263,
      "Accesorios": 263,
      "Libros": 263,
      "Juguetes": 263,
      "Salud y Belleza": 263,
      "Deportes y Aire libre": 330,
      "Herramientas y Ferretería": 330,
      "Videojuegos": 263,
      "Computación": 743,
      "Celulares y accesorios": 263,
      "Oficina y papelería": 263,
      "Automotriz": 804,
      "Música y Películas": 263,
      "Instrumentos Musicales": 763,
      "Alimentos y Bebidas": 263,
      "Motocicletas": 1400,
      "Náutica": 1400,
      "Repuestos y autopartes": 804,
      "Mascotas": 723,
      "Perros": 0,
      "Gatos": 0,
      "Ganado bovino": 0,
      "Ganado ovino": 0,
      "Ganado equino": 0,
      "Ganado caprino": 0,
      "Aves de corral": 0,
      "Inmuebles": 0,
      "Alquiler de campos": 0,
      "Alquiler de casas": 0,
      "Alquiler de herramientas": 330,
      "Jardín y exteriores": 850,
      "Muebles": 1215,
    };

    let maxPrecio = 0;
    categorias.forEach(cat => {
      const precio = preciosCategorias[cat] ?? 0;
      if (precio > maxPrecio) maxPrecio = precio;
    });

    let precioFinal = 0;
    if (maxPrecio > 0) {
      precioFinal = maxPrecio * 1.10 + 25;
    }
    setPriceShipping(parseInt(precioFinal));
  }

  function showProducts(data) {
    const filtered = data.filter(p => p.vendedor === selectedSeller);
    const jsx = [];

    for (let i = 0; i < filtered.length; i += 3) {
      const chunk = filtered.slice(i, i + 3);
      jsx.push(
        <AnimationScroll key={`chunk-${i}-${selectedSeller}`}>
          <section className="flex items-center justify-center gap-4">
            {chunk.map(producto => (
              <ProductCard
                key={`${producto.id_producto}-${producto.vendedor}`}
                idItem={producto.id_item}
                onDelete={(id) => {
                  setProductos(prev => prev.filter(p => p.id_item !== id));
                }}
                cart={true}
                name={producto.nombre_producto}
                price={producto.precio_unitario}
                image={`/api/${producto.ruta_imagen}`}
                amount={producto.cantidad}
                stock={producto.stock}
                freeShipping={producto.envio_gratis === 1}
                phone={false}
                client={true}
              />
            ))}
          </section>
        </AnimationScroll>
      );
    }

    return jsx;
  }

  const renderStep = () => {
    switch (currentStep) {
      case "first":
        return productos.filter(producto => producto.vendedor === selectedSeller).length > 0 ? (
          <div className={`mb-22 ${windowWidth >= 500 ? 'flex flex-wrap justify-center gap-4' : ''}`}>
            {sellers?.length > 1 && !ecommerce && (
              <>
                <section className="w-full flex items-center justify-center">
                  {sellers.map(seller => (
                    <span
                      key={seller}
                      onClick={() => setSelectedSeller(seller)}
                      className='m-3 select-none font-quicksand font-semibold text-lg bg-gray-300 hover:bg-gray-200 p-2 min-w-24 cursor-pointer rounded-3xl'
                    >
                      {seller}
                    </span>
                  ))}
                </section>
                <h2 className='font-quicksand font-semibold text-3xl mb-4'>
                  Tu pedido en {selectedSeller}
                </h2>
              </>
            )}

            {!update ? (
              windowWidth > 500 ? (
                showProducts(productos)
              ) : (
                productos
                  .filter(producto => producto.vendedor === selectedSeller)
                  .map(producto => (
                    <AnimationScroll key={`${producto.id_producto}-${producto.vendedor}`}>
                      <ProductCard
                        cart={TbRuler2}
                        idItem={producto.id_item}
                        onDelete={(id) => {
                          setProductos(prev => prev.filter(p => p.id_item !== id));
                        }}
                        name={producto.nombre_producto}
                        price={producto.precio_unitario}
                        image={`/api/${producto.ruta_imagen}`}
                        amount={producto.cantidad}
                        stock={producto.stock}
                        freeShipping={producto.envio_gratis === 1}
                        phone={true}
                        client={true}
                      />
                    </AnimationScroll>
                  ))
              )
            ) : (
              <CreateProduct edit={true} onCancel={() => setUpdate(false)} id={update[1]} />
            )}

            {totalPrice && (
              <Card className={`${windowWidth < 500 ? "!w-88 m-auto" : "!w-[31rem]"} ${productos
                .filter(producto => producto.vendedor === selectedSeller).length > 1 ? "mt-4 mb-28" : "mt-12"} !shadow !bg-gray-50 !rounded-4xl`}>
                <h2 className='font-quicksand -translate-y-3 font-bold text-2xl'>Detalles de la compra</h2>
                <section className='flex items-center justify-between w-full'>
                  <h2 className='font-quicksand ml-3 font-medium text-xl'>Subtotal</h2>
                  <span className='font-quicksand font-medium text-xl'>${totalPrice[selectedSeller]}</span>
                </section>
                <section className='flex items-center justify-between w-full mt-2'>
                  <h2 className='font-quicksand ml-3 font-medium text-xl'>Envío</h2>
                  <span className='font-quicksand mr-1 font-medium text-xl'>${priceShipping}</span>
                </section>
                <section className='flex items-center justify-between w-full mt-2'>
                  <h2 className='font-quicksand ml-3 font-medium text-xl'>ToloCoins</h2>
                  <span className='font-quicksand text-green-600 mr-1 font-medium text-xl'>- ${priceShipping}</span>
                </section>
                <section className='flex items-center justify-between w-full mt-2'>
                  <h2 className='font-quicksand ml-3 font-bold text-xl'>Total</h2>
                  <span className='font-quicksand font-bold text-xl'>
                    ${priceShipping + totalPrice[selectedSeller]}
                  </span>
                </section>
                <Button
                  onClick={() => {
                    setCurrentStep("second")
                    setProceedToPayment({
                      idCarrito: productos
                        .filter(producto => producto.vendedor === selectedSeller)[0].id_carrito,
                      totalPrice: priceShipping + totalPrice[selectedSeller],
                      metodo_envio: "Esto se realizará en la tercera entrega",
                      direccion_entrega: "Esto se realizará en la tercera entrega",
                    })
                  }}
                  color="black"
                  size="lg"
                  text="Finalizar pedido"
                  className={"!w-72 mr-3 mt-4 !rounded-2xl font-quicksand font-semibold"}
                />
              </Card>
            )}
          </div>
        ) : <section className='w-full h-full flex justify-center items-center flex-col'><FaOpencart className=' -translate-y-14 text-gray-500 text-6xl' /> <span className='text-gray 500 text-2xl -translate-y-14'>Agrega un producto a tu carrito</span></section>;

      case "second":
        return (
          <section className='w-full md:w-1/2 lg:w-1/2 flex items-start p-3 m-auto flex-col justify-start'>
            <IoReturnUpBackOutline onClick={() => setCurrentStep("first")} className={`${map && width < 500 ? "top-22 !left-2" : "top-22"} cursor-pointer text-4xl md:text-5xl lg:text-5xl text-gray-700 hover:scale-110 absolute left-6`} />
            {map ? (
              <>
                <h2 className='font-quicksand font-semibold text-3xl mt-8 mb-2'>Entrega</h2>
                <p className='text-gray-400 font-quicksand text-lg font-medium mb-3'>
                  Seleccione "Local" para ver su dirección
                </p>
              </>
            ) : (
              <h2 className='font-quicksand m-auto font-semibold text-3xl mt-5 mb-2'>Envío</h2>
            )}

            <section className='flex rounded-2xl flex-col items-center shadow-sm w-full'>
              {map && (
                <section
                  className={`${selectedSend === "send" ? "border-2 border-blue-600 bg-sky-50" : ""} flex justify-between items-center p-3 rounded-t-2xl w-full`}
                  onClick={() => setSelectedSend("send")}>
                  <section className='flex items-center'>
                    <input
                      className='ml-2 mr-4 scale-150'
                      name='delivery'
                      value='send'
                      type='radio'
                      checked={selectedSend === "send"}
                      onChange={() => setSelectedSend("send")}
                    />
                    <label htmlFor="send" className='font-quicksand mb-1 font-medium text-xl'>
                      Envío
                    </label>
                  </section>
                  <FaTruckFast className='mr-4 text-3xl' />
                </section>
              )}

              {map && (
                <section
                  className={`${selectedSend === "local" ? "border-2 border-blue-600 bg-sky-50" : ""} flex justify-between items-center p-3 rounded-b-2xl w-full`}
                  onClick={() => setSelectedSend("local")}
                >
                  <section className='flex items-center'>
                    <input
                      className='ml-2 mr-4 scale-150'
                      name='delivery'
                      value='local'
                      type='radio'
                      checked={selectedSend === "local"}
                      onChange={() => setSelectedSend("local")}
                    />
                    <label htmlFor="local" className='font-quicksand mb-1 font-medium text-xl'>
                      Local
                    </label>
                  </section>
                  <FaStore className='mr-4 text-3xl' />
                </section>
              )}
            </section>
            <div className={`w-full mt-8 h-[300px] ${selectedSend === "send" && "hidden"}`}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={map}
              ></iframe>
            </div>
            {selectedSend === "send" && (
              <form onSubmit={handleSubmit(() => console.log("efefew"))} className={`mt-0 w-full mb-52 m-auto bg-white p-3 rounded-xl`}>
                <section className='flex items-center w-full justify-center '>
                  <Input
                    type={"text"}
                    name={"name"}
                    className='w-full shadow-lg !p-3'
                    placeholder={"Nombre"}
                    required={true}
                    register={register}
                    maxLength={32}
                    errors={errors}
                  />
                  <Input
                    type={"text"}
                    name={"lastName"}
                    className='shadow-lg !p-3'
                    placeholder={"Apellido"}
                    required={true}
                    register={register}
                    maxLength={32}
                    errors={errors}
                  />
                </section>
                <section className='flex items-center w-full justify-center '>
                  <Input
                    type={"text"}
                    name={"address"}
                    className='shadow-lg !p-3'
                    placeholder={"Dirección"}
                    required={true}
                    register={register}
                    maxLength={60}
                    errors={errors}
                  />
                  <Input
                    type={"text"}
                    name={"phone"}
                    className='shadow-lg !p-3 '
                    placeholder={"Celular"}
                    required={true}
                    register={register}
                    maxLength={32}
                    errors={errors}
                    pattern={{
                      regex: /^(?:\+598)?0?9\d{7,8}$/,
                      message: "Número de celular inválido"
                    }}
                  />

                </section>
                <section className='flex items-center w-full justify-center '>
                  <Input
                    type={"text"}
                    name={"city"}
                    className='shadow-lg !p-3'
                    placeholder={"Ciudad"}
                    required={true}
                    register={register}
                    maxLength={60}
                    errors={errors}
                  />
                  <Input
                    type={"text"}
                    name={"postal"}
                    className='shadow-lg !p-3'
                    placeholder={"Código postal"}
                    required={true}
                    register={register}
                    maxLength={40}
                    errors={errors}
                  />
                </section>
                <Dropdown
                  text="Departamento"
                  border={false}
                  menuClassName='max-h-62 !w-42 overflow-y-auto'
                  cndiv='py-1 !shadow-lg !w-84 lg:!w-109 md:!w-103 m-auto rounded-lg
border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center'
                  showSelectedAsTitle={true}
                  options={[
                    { label: "Artigas", onClick: () => setDepartamento("Artigas") },
                    { label: "Canelones", onClick: () => setDepartamento("Canelones") },
                    { label: "Cerro Largo", onClick: () => setDepartamento("Cerro Largo") },
                    { label: "Colonia", onClick: () => setDepartamento("Colonia") },
                    { label: "Durazno", onClick: () => setDepartamento("Durazno") },
                    { label: "Flores", onClick: () => setDepartamento("Flores") },
                    { label: "Florida", onClick: () => setDepartamento("Florida") },
                    { label: "Lavalleja", onClick: () => setDepartamento("Lavalleja") },
                    { label: "Maldonado", onClick: () => setDepartamento("Maldonado") },
                    { label: "Montevideo", onClick: () => setDepartamento("Montevideo") },
                    { label: "Paysandú", onClick: () => setDepartamento("Paysandú") },
                    { label: "Río Negro", onClick: () => setDepartamento("Río Negro") },
                    { label: "Rivera", onClick: () => setDepartamento("Rivera") },
                    { label: "Rocha", onClick: () => setDepartamento("Rocha") },
                    { label: "Salto", onClick: () => setDepartamento("Salto") },
                    { label: "San José", onClick: () => setDepartamento("San José") },
                    { label: "Soriano", onClick: () => setDepartamento("Soriano") },
                    { label: "Tacuarembó", onClick: () => setDepartamento("Tacuarembó") },
                    { label: "Treinta y Tres", onClick: () => setDepartamento("Treinta y Tres") },
                  ]}
                />
                <Button onClick={() => setCurrentStep("third")} className={"!w-72  !rounded-2xl !hover:scale-105 font-quicksand font-semibold mt-5"} color={"blue"} size={"lg"} text={"Siguiente"} />
              </form>
            )}
          </section>
        );

      case "third":
        return (
          <>
            <section className={`${width < 500 ? "top-23" : "top-20"} text-4xl md:text-5xl lg:text-5xl z-50 text-gray-700 cursor-pointer hover:scale-110 mb-2 absolute left-2`}>
              <IoReturnUpBackOutline onClick={() => setCurrentStep("second")} />
            </section>
            <h2 className={"font-quicksand text-3xl translate-y-5 font-bold"}>Métodos de pago</h2>
            <CheckoutBricks
              total={priceShipping + totalPrice[selectedSeller]}
              idCompra={proceedToPayment.idCarrito}
              data={productos}
              onPaymentSuccess={(paymentData) => {
                console.log('Pago exitoso:', paymentData);
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return renderStep();
}