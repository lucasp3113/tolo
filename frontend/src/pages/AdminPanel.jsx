import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import Input from "../components/Input";
import { IoSearch } from "react-icons/io5";
import Button from "../components/Button";
import silvano from "../../src/assets/lautaro.jpeg";
import { MdOutlineBarChart } from "react-icons/md";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useForm } from "react-hook-form";
import { div } from "three/src/nodes/TSL.js";

const Chart = memo(({ chartData, chartType }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Quicksand" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Quicksand" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            fontFamily: "Quicksand",
            color: "#fff",
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Line
          type="monotone"
          dataKey={chartType === "Visitas" ? "Visitas" : "ganancias"}
          stroke={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: chartType === "Visitas" ? "#0ea5e9" : "#22c55e",
          }}
          fill="url(#colorValue)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

const ChartMobile = memo(({ chartData, chartType }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorValueMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "Quicksand" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "Quicksand" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            border: "none",
            fontFamily: "Quicksand",
            fontSize: "12px",
            color: "#fff",
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Line
          type="monotone"
          dataKey={chartType === "Visitas" ? "Visitas" : "ganancias"}
          stroke={chartType === "Visitas" ? "#0ea5e9" : "#22c55e"}
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: chartType === "Visitas" ? "#0ea5e9" : "#22c55e",
          }}
          fill="url(#colorValueMobile)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default function AdminPanel() {
  function search(data) {
    axios
      .post("/api/search_ecommerce.php", {
        search: data["ecommerce"],
      })
      .then((res) => {
        setSearchData(res.data.data);
        setEcommerceCount(8);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const allEcommerces = [];

  const [searchData, setSearchData] = useState(allEcommerces);
  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  const colorsCurrentRange = {
    junior: "text-sky-400 border-sky-400",
    amateur: "text-green-500 border-green-500",
    semi_senior: "text-blue-500 border-blue-500",
    senior: "text-red-500 border-red-500",
    elite: "text-amber-500 border-amber-500",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const tableEndRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  const [timeRange, setTimeRange] = useState("1semana");
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("Visitas");

  const [ecommerceCount, setEcommerceCount] = useState(8);
  const ecommerceEndRef = useRef(null);
  const ECOMMERCES_PER_PAGE = 8;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          ecommerceCount < allEcommerces.length
        ) {
          setEcommerceCount((prev) =>
            Math.min(prev + ECOMMERCES_PER_PAGE, allEcommerces.length)
          );
        }
      },
      { threshold: 1.0 }
    );

    if (ecommerceEndRef.current) observer.observe(ecommerceEndRef.current);
    return () => observer.disconnect();
  }, [ecommerceCount]);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });

  const allOrders = [
    {
      id: 1,
      cliente: "Juan Camilo",
      fecha: "08/10/2025",
      monto: "$5000",
      direccion: "Pelossi 653",
      estado: "Enviado",
    },
    {
      id: 2,
      cliente: "Bruno Camilo",
      fecha: "08/10/2025",
      monto: "$3500",
      direccion: "Rocha 489",
      estado: "Enviado",
    },
    {
      id: 3,
      cliente: "Beto Torreta",
      fecha: "08/10/2025",
      monto: "$2300",
      direccion: "Nicolás Guerra 101",
      estado: "En proceso",
    },
    {
      id: 4,
      cliente: "Juan Maderagni",
      fecha: "07/10/2025",
      monto: "$4200",
      direccion: "F. Figueroa 443",
      estado: "Enviado",
    },
    {
      id: 5,
      cliente: "Francisco Luchineludo",
      fecha: "07/10/2025",
      monto: "$1800",
      direccion: "Brasil 1430",
      estado: "En proceso",
    },
    {
      id: 6,
      cliente: "Donatella Reyes",
      fecha: "06/10/2025",
      monto: "$3100",
      direccion: "18 de Julio 890",
      estado: "Enviado",
    },
    {
      id: 7,
      cliente: "Agustina Rodríguez",
      fecha: "06/10/2025",
      monto: "$2900",
      direccion: "Herrera 305",
      estado: "En proceso",
    },
    {
      id: 8,
      cliente: "Laura Fernández",
      fecha: "05/10/2025",
      monto: "$5500",
      direccion: "8 de Octubre 456",
      estado: "Enviado",
    },
    {
      id: 9,
      cliente: "Diego Martínez",
      fecha: "05/10/2025",
      monto: "$2100",
      direccion: "Bulevar Artigas 789",
      estado: "En proceso",
    },
    {
      id: 10,
      cliente: "Sofía Rodríguez",
      fecha: "04/10/2025",
      monto: "$3800",
      direccion: "Millán 321",
      estado: "Enviado",
    },
    {
      id: 11,
      cliente: "Javier Torres",
      fecha: "04/10/2025",
      monto: "$4500",
      direccion: "Constituyente 654",
      estado: "En proceso",
    },
    {
      id: 12,
      cliente: "Valentina Pérez",
      fecha: "03/10/2025",
      monto: "$2700",
      direccion: "Agraciada 987",
      estado: "Enviado",
    },
    {
      id: 13,
      cliente: "Mateo Silva",
      fecha: "03/10/2025",
      monto: "$3300",
      direccion: "Comercio 147",
      estado: "En proceso",
    },
    {
      id: 14,
      cliente: "Camila Gómez",
      fecha: "02/10/2025",
      monto: "$4100",
      direccion: "San José 258",
      estado: "Enviado",
    },
    {
      id: 15,
      cliente: "Lucas Díaz",
      fecha: "02/10/2025",
      monto: "$1900",
      direccion: "Yaguarón 369",
      estado: "En proceso",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post("/api/check_admin.php", { token })
      .then((res) => {
        if (!res.data.success) navigate("/login");
        else {
          setUser(res.data.user);
          setLoading(false);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => {
    loadMoreOrders();
  }, []);

  const loadMoreOrders = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newOrders = allOrders.slice(start, end);

      if (newOrders.length > 0) {
        setDisplayedOrders((prev) => [...prev, ...newOrders]);
        setPage((prev) => prev + 1);
      }

      if (end >= allOrders.length) setHasMore(false);
      setLoading(false);
    }, 0);
  };

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) loadMoreOrders();
      },
      { threshold: 1.0 }
    );

    if (tableEndRef.current) observer.observe(tableEndRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const generateDummyData = useCallback(() => {
    switch (timeRange) {
      case "1dia":
        return Array.from({ length: 24 }, (_, i) => ({
          name: `${i}:00`,
          Visitas: Math.floor(Math.random() * 10),
          ganancias: Math.floor(Math.random() * 500),
        }));
      case "1semana":
        return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => ({
          name: day,
          Visitas: Math.floor(Math.random() * 50),
          ganancias: Math.floor(Math.random() * 3000),
        }));
      case "1mes":
        return Array.from({ length: 30 }, (_, i) => ({
          name: `${i + 1}`,
          Visitas: Math.floor(Math.random() * 20),
          ganancias: Math.floor(Math.random() * 1500),
        }));
      case "5meses":
        return ["Mes 1", "Mes 2", "Mes 3", "Mes 4", "Mes 5"].map((mes) => ({
          name: mes,
          Visitas: Math.floor(Math.random() * 200),
          ganancias: Math.floor(Math.random() * 15000),
        }));
      case "1año":
        return [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ].map((mes) => ({
          name: mes,
          Visitas: Math.floor(Math.random() * 150),
          ganancias: Math.floor(Math.random() * 10000),
        }));
      default:
        return [];
    }
  }, [timeRange]);

  useEffect(() => {
    setChartData(generateDummyData());
  }, [generateDummyData]);

  return (
    <section className=" bg-gradient-to-br from-gray-50 to-gray-100">
      {width >= 500 ? (
        <div className="gap-4 md:p-4 font-quicksand">
          <section className="flex gap-4">
            <section className="w-[76%] bg-white shadow rounded-xl p-4 max-h-[28rem] overflow-y-auto">
              <table className="w-full">
                <thead className="top-0 bg-white z-10">
                  <tr className="text-center">
                    <th className="px-4 py-2 font-semibold">Pedido</th>
                    <th className="px-4 py-2 font-semibold">Cliente</th>
                    <th className="px-4 py-2 font-semibold">Fecha</th>
                    <th className="px-4 py-2 font-semibold">Monto</th>
                    <th className="px-4 py-2 font-semibold">Dirección</th>
                    <th className="px-4 py-2 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className="text-center animate-[fadeSlide_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <td className="px-4 py-2 border border-gray-200">
                        {order.id}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.cliente}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.fecha}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.monto}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.direccion}
                      </td>
                      <td
                        className={`px-4 py-2 border border-gray-200 font-bold flex justify-center ${
                          order.estado === "Enviado"
                            ? "text-green-600"
                            : "text-amber-500"
                        }`}
                      >
                        {order.estado}{" "}
                        {order.estado === "Enviado" ? (
                          <IoCheckmarkDone className="self-center ml-2 text-xl text-sky-500" />
                        ) : (
                          <FaRegClock className="self-center ml-2 text-md" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tableEndRef} className="h-4" />
              {!hasMore && displayedOrders.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No hay más pedidos para mostrar
                </div>
              )}
            </section>

            <section className="w-[40%] bg-white shadow rounded-xl p-6 flex flex-col">
              <div className="flex items-center w-full justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 font-quicksand flex items-center gap-2">
                  {chartType === "Visitas" ? (
                    <>
                      <span className="text-sky-600"></span>
                      Visitas
                    </>
                  ) : (
                    <>
                      <span className="text-green-600"></span>
                      Ganancias
                    </>
                  )}
                </h2>

                <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                  <button
                    onClick={() => setChartType("Visitas")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand transition-all duration-200 hover:cursor-pointer hover:text-white hover:bg-sky-600 ${
                      chartType === "Visitas"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Visitas
                  </button>
                  <button
                    onClick={() => setChartType("ganancias")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand transition-all duration-200 hover:cursor-pointer hover:bg-green-600 hover:text-white ${
                      chartType === "ganancias"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Ganancias
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { key: "1dia", label: "1D" },
                  { key: "1semana", label: "1S" },
                  { key: "1mes", label: "1M" },
                  { key: "5meses", label: "5M" },
                  { key: "1año", label: "1A" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeRange(key)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold font-quicksand hover:cursor-pointer duration-150 ${
                      timeRange === key
                        ? "bg-gray-800 text-white"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <Chart chartData={chartData} chartType={chartType} />
              </div>
            </section>
          </section>

          <style>{`
      @keyframes fadeSlide {
        0% {
          opacity: 0;
          transform: translateY(12px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>

          <section className="mt-10 flex flex-col w-full items-center">
            <div className="w-[100%]">
              <form onSubmit={handleSubmit(search)} className="w-[50%] m-auto!">
                <Input
                  type="text"
                  name="ecommerce"
                  label="Buscar E-Commerce"
                  placeholder="Ej: Nike"
                  register={register}
                  errors={errors}
                  required={true}
                  className=""
                  icon={
                    <Button
                      type="submit"
                      className="bg-transparent translate-y-2 translate-x-2 shadow-none"
                      text={
                        <IoSearch className="text-2xl text-gray-600 -translate-y-[75%]" />
                      }
                    />
                  }
                />
              </form>

              <div className="max-h-[600px] overflow-y-auto">
                <div className="flex flex-wrap justify-center">
                  {searchData.slice(0, ecommerceCount).map((ecommerce, i) => (
                    <div
                      key={ecommerce.id}
                      className="flex ml-4 p-4 w-[30%] bg-white hover:cursor-pointer rounded-md shadow-sm hover:shadow-md transition-all duration-100 animate-[fadeSlide_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${i * 0.03}s` }}
                      onClick={() =>
                        navigate(`/seller_dashboard/${ecommerce.id_usuario}`)
                      }
                    >
                      <div>
                        {ecommerce.logo ? (
                          <img
                            src={`/api/${ecommerce.logo}`}
                            alt="Imagen de E-Commerce"
                            className={`${
                              colorsCurrentRange[ecommerce.nombre_rango]
                            } h-30 w-30 rounded-full border-4`}
                          />
                        ) : (
                          <FaCircleUser
                            className={`${
                              colorsCurrentRange[ecommerce.nombre_rango]
                            } text-8xl m-auto text-gray-500! h-30 w-30 rounded-full border-4`}
                          />
                        )}
                      </div>
                      <div className="flex flex-col ml-10 justify-justify w-[50%]">
                        <p className="font-semibold break-words mt-5">
                          {ecommerce.nombre_ecommerce}
                        </p>
                        <p
                          className={`${
                            colorsCurrentRange[ecommerce.nombre_rango]
                          } flex self-center`}
                        >
                          {capitalize(ecommerce.nombre_rango)}
                          <MdOutlineBarChart
                            className="text-sky-700 ml-2 translate-y-1"
                            size={18}
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={ecommerceEndRef} className="h-4 w-full" />
                {ecommerceCount >= searchData.length && (
                  <div className="text-center py-4 text-gray-500 text-sm w-full">
                    No hay más e-commerce para mostrar
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="font-quicksand">
          <section className="flex flex-col gap-4 p-3">
            <section className="w-full mx-auto bg-white shadow rounded-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 font-quicksand flex items-center gap-2">
                  {chartType === "Visitas" ? (
                    <>
                      <span className="text-sky-600"></span>
                      Visitas
                    </>
                  ) : (
                    <>
                      <span className="text-green-600"></span>
                      Ganancias
                    </>
                  )}
                </h2>

                <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                  <button
                    onClick={() => setChartType("Visitas")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand transition-all duration-200 hover:cursor-pointer hover:text-white hover:bg-sky-600 ${
                      chartType === "Visitas"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Visitas
                  </button>
                  <button
                    onClick={() => setChartType("ganancias")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand transition-all duration-200 hover:cursor-pointer hover:bg-green-600 hover:text-white ${
                      chartType === "ganancias"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Ganancias
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { key: "1dia", label: "1D" },
                  { key: "1semana", label: "1S" },
                  { key: "1mes", label: "1M" },
                  { key: "5meses", label: "5M" },
                  { key: "1año", label: "1A" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeRange(key)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold font-quicksand hover:cursor-pointer duration-150 ${
                      timeRange === key
                        ? "bg-gray-800 text-white"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <ChartMobile chartData={chartData} chartType={chartType} />
              </div>
            </section>

            <section className="w-full mx-auto bg-white border border-gray-200 rounded-lg p-1.5 max-h-[18rem] overflow-y-auto text-xs">
              <table className="w-full text-[11px]">
                <thead className="sticky top-0 bg-white z-20 shadow-sm">
                  <tr className="text-center border-b-2 border-gray-300">
                    <th className="py-1 px-0.5 w-[5%] font-semibold text-[10px] bg-white">
                      Pedido
                    </th>
                    <th className="py-1 px-0.5 w-[30%] font-semibold text-[10px] bg-white">
                      Cliente
                    </th>
                    <th className="py-1 px-0.5 w-[20%] font-semibold text-[10px] bg-white">
                      Fecha
                    </th>
                    <th className="py-1 px-0.5 font-semibold text-[10px] bg-white">
                      Monto
                    </th>
                    <th className="py-1 px-0.5 font-semibold text-[10px] bg-white hidden sm:table-cell">
                      Dir.
                    </th>
                    <th className="py-1 px-0.5 font-semibold text-[10px] bg-white">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className="text-center text-[11px] animate-[fadeSlide_0.5s_ease-out_forwards] border-b border-gray-100 hover:bg-gray-50"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <td className="px-0.5 py-1">{order.id}</td>
                      <td className="px-0.5 py-1 truncate">{order.cliente}</td>
                      <td className="px-0.5 py-1 text-[10px]">{order.fecha}</td>
                      <td className="px-0.5 py-1 font-semibold">
                        {order.monto}
                      </td>
                      <td className="px-0.5 py-1 text-[9px] hidden sm:table-cell truncate">
                        {order.direccion}
                      </td>
                      <td
                        className={`px-0.5 py-1 font-bold flex justify-center items-center gap-0.5 ${
                          order.estado === "Enviado"
                            ? "text-green-600"
                            : "text-amber-500"
                        }`}
                      >
                        <span className="text-[9px]">
                          {order.estado === "Enviado" ? (
                            <p className="flex">
                              {" "}
                              Enviado
                              <IoCheckmarkDone className="self-center ml-2 text-xs text-sky-500" />
                            </p>
                          ) : (
                            <p className="flex">
                              En Espera
                              <FaRegClock className="self-center ml-2 text-xs" />
                            </p>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tableEndRef} className="h-2" />
              {!hasMore && displayedOrders.length > 0 && (
                <div className="text-center py-2 text-gray-500 text-[10px]">
                  No hay más pedidos
                </div>
              )}
            </section>
          </section>

          <style>{`
      @keyframes fadeSlide {
        0% {
          opacity: 0;
          transform: translateY(12px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>

          <section className="mt-2 flex flex-col w-full items-center mb-[6rem] ">
            <div className="w-full">
              <form
                onSubmit={handleSubmit(search)}
                className="flex justify-center border-b border-gray-200"
              >
                <Input
                  type="text"
                  name="ecommerce"
                  label="Buscar E-Commerce"
                  placeholder="Ej: Nike"
                  register={register}
                  errors={errors}
                  required={true}
                  className="bg-white!"
                  icon={
                    <Button
                      type="submit"
                      className="bg-transparent translate-y-2 translate-x-2 shadow-none"
                      text={
                        <IoSearch className="text-2xl text-gray-600 -translate-y-[75%]" />
                      }
                    />
                  }
                />
              </form>

              <div className="max-h-[400px] overflow-y-auto">
                <div className="flex flex-col justify-center">
                  {searchData.slice(0, ecommerceCount).map((ecommerce, i) => (
                    <div
                      key={ecommerce.id}
                      className="flex bg-white p-4 w-full hover:cursor-pointer rounded-md border-b border-gray-200 transition-all duration-100 animate-[fadeSlide_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${i * 0.03}s` }}
                      onClick={() =>
                        navigate(`/seller_dashboard/${ecommerce.id_usuario}`)
                      }
                    >
                      <div>
                        <img
                          src={`/api/${ecommerce.logo}`}
                          alt="Imagen de E-Commerce"
                          className={`${
                            colorsCurrentRange[ecommerce.nombre_rango]
                          } rounded-full h-25 w-30 border-4`}
                        />
                      </div>
                      <div className="flex flex-col ml-10 w-[50%]">
                        <p className="font-semibold break-words mt-5">
                          {ecommerce.nombre_ecommerce}
                        </p>
                        <p
                          className={`${
                            colorsCurrentRange[ecommerce.nombre_rango]
                          } flex self-center`}
                        >
                          {capitalize(ecommerce.nombre_rango)}
                          <MdOutlineBarChart
                            className="text-sky-700 ml-2 translate-y-1"
                            size={18}
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={ecommerceEndRef} className="h-4" />
                {ecommerceCount >= searchData.length && (
                  <div className="text-center py-2 text-gray-500 text-xs">
                    No hay más e-commerce
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
