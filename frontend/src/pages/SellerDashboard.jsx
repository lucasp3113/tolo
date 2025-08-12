import React, { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import Input from "../components/Input";
import logo from "../assets/arctec.jpg";
import { FaLocationDot } from "react-icons/fa6";  

export default function SellerDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const rating = 4; // Valor real
  const [progress, setProgress] = useState(0); // Progreso animado

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Animar barra de calificación
  useEffect(() => {
    let start = 0;
    const duration = 1000; // Duración total en ms
    const step = 10; // Intervalo de actualización
    const increment = rating / (duration / step);

    const interval = setInterval(() => {
      start += increment;
      if (start >= rating) {
        start = rating;
        clearInterval(interval);
      }
      setProgress(start);
    }, step);

    return () => clearInterval(interval);
  }, [rating]);

  // Determinar color según rating
  const getColor = (value) => {
    if (value < 2.5) return "red";
    if (value < 4) return "orange";
    return "green";
  };

  // Cálculo para el trazo del semicirculo Desktop
  const radiusDesktop = 40;
  const circumferenceDesktop = Math.PI * radiusDesktop;
  const offsetDesktop = circumferenceDesktop - (progress / 5) * circumferenceDesktop;

  // Cálculo para el trazo del semicirculo Mobile
  const radiusMobile = 32;
  const circumferenceMobile = Math.PI * radiusMobile;
  const offsetMobile = circumferenceMobile - (progress / 5) * circumferenceMobile;

  return (
    <div className="min-h-screen w-full bg-gray-100">

      <div className="hidden md:grid md:grid-cols-4 h-screen w-screen overflow-x-hidden">
        {/* Panel izquierdo Desktop */}
        <div className="col-span-1 bg-white shadow-lg flex flex-col items-center p-6">
          <img 
            src={logo} 
            alt="Logo Comercio" 
            className="w-32 mb-4 border-4 border-sky-800 rounded-full" 
          />
          <h1 className="text-2xl font-bold mb-2">Artec</h1>
          <p className="text-center text-gray-600">
            Vendemos electrónicos, componentes de PC, gadgets y más.
          </p>
          <div className="mt-6 w-full pt-4">
            <div className="flex justify-center">
              <FaLocationDot title="Localidad" className="text-gray-500 mb-2 mr-2"/>
              <h2>San José, Uruguay</h2>
            </div>
          </div>
          <div className="mt-6 w-full border-t border-gray-300 pt-4"></div>
        </div>

        {/* Panel derecho Desktop */}
        <div className="col-span-3 grid grid-rows-2 gap-4 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">221</h1>
              <p className="text-gray-600">Ventas totales</p>
            </div>
            <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">$3000</h1>
              <p className="text-gray-600">Ingresos de este mes</p>
            </div>
            {/* Barra semicircular de calificación con animación */}
            <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
              <svg width="100" height="60" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="transparent"
                  stroke={getColor(progress)}
                  strokeWidth="10"
                  strokeDasharray={circumferenceDesktop}
                  strokeDashoffset={offsetDesktop}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {progress.toFixed(1)}
                </text>
              </svg>
              <p className="text-gray-600 mt-1">Calificación</p>
            </div>

            <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">15</h1>
              <p className="text-gray-600">Pedidos activos</p>
            </div>
          </div>

          {/* Parte inferior Desktop */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-bold mb-3">Ventas recientes</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Teclado mecánico</span>
                  <span className="text-green-600">$2000</span>
                </li>
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Mouse gamer</span>
                  <span className="text-green-600">$1200</span>
                </li>
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Placa de video RTX 3060</span>
                  <span className="text-green-600">$16000</span>
                </li>
                <li className="flex justify-between">
                  <span>Monitor 27" 144Hz</span>
                  <span className="text-green-600">$10000</span>
                </li>
              </ul>
            </div>

            {/* Productos más vendidos */}
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-bold mb-3">Productos más vendidos</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Mouse gamer</span>
                  <span className="text-blue-600">80 u.</span>
                </li>
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Teclado mecánico</span>
                  <span className="text-blue-600">65 u.</span>
                </li>
                <li className="flex justify-between border-b border-gray-300 pb-1">
                  <span>Auriculares inalámbricos</span>
                  <span className="text-blue-600">50 u.</span>
                </li>
                <li className="flex justify-between">
                  <span>SSD 1TB</span>
                  <span className="text-blue-600">40 u.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Mobile/Tablet */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Header móvil */}
        <div className="bg-white shadow-sm p-4 flex items-center space-x-4">
          <img 
            src={logo} 
            alt="Logo Comercio" 
            className="w-12 h-12 border-2 border-sky-800 rounded-full flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">Arctec</h1>
            <div className="flex justify-center items-center text-sm text-gray-600">
              <FaLocationDot className="mr-1 flex-shrink-0" size={12}/>
              <span className="truncate">San José, Uruguay</span>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="flex-1 p-4 space-y-4 pb-6">
          {/* Métricas móvil - Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px]">
              <h1 className="text-2xl font-bold">221</h1>
              <p className="text-gray-600 text-sm text-center">Ventas totales</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px]">
              <h1 className="text-2xl font-bold">$3000</h1>
              <p className="text-gray-600 text-sm text-center">Ingresos del mes</p>
            </div>
            

            {/* Barra semicircular de calificación con animación */}
            <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
              <svg width="100" height="60" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="transparent"
                  stroke={getColor(progress)}
                  strokeWidth="10"
                  strokeDasharray={circumferenceDesktop}
                  strokeDashoffset={offsetDesktop}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {progress.toFixed(1)}
                </text>
              </svg>
              <p className="text-gray-600 mt-1">Calificación</p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px]">
              <h1 className="text-2xl font-bold">15</h1>
              <p className="text-gray-600 text-sm text-center">Pedidos activos</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              Vendemos electrónicos, componentes de PC, gadgets y más.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Ventas recientes</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Teclado mecánico</span>
                <span className="text-sm font-semibold text-green-600 flex-shrink-0">$2000</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Mouse gamer</span>
                <span className="text-sm font-semibold text-green-600 flex-shrink-0">$1200</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Placa de video RTX 3060</span>
                <span className="text-sm font-semibold text-green-600 flex-shrink-0">$16000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 truncate pr-2">Monitor 27" 144Hz</span>
                <span className="text-sm font-semibold text-green-600 flex-shrink-0">$10000</span>
              </div>
            </div>
          </div>


          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Productos más vendidos</h2>
            <div className="space-y-3 mb-18">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Mouse gamer</span>
                <span className="text-sm font-semibold text-blue-600 flex-shrink-0">80 u.</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Teclado mecánico</span>
                <span className="text-sm font-semibold text-blue-600 flex-shrink-0">65 u.</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-800 truncate pr-2">Auriculares inalámbricos</span>
                <span className="text-sm font-semibold text-blue-600 flex-shrink-0">50 u.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 truncate pr-2">SSD 1TB</span>
                <span className="text-sm font-semibold text-blue-600 flex-shrink-0">40 u.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
