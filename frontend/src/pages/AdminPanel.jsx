import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import Input from "../components/Input";
import { IoSearch } from "react-icons/io5";
import Button from "../components/Button";
import { MdOutlineBarChart } from "react-icons/md";
import ProductCRUD from "./ProductCRUD";
import ClipLoader from "react-spinners/ClipLoader";

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


function formatDate(dateStr, timeRange) {
  const date = new Date(dateStr);

  switch (timeRange) {
    case "1dia":
      return `${date.getHours()}:00`;
    case "1semana":
      const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      return days[date.getDay()];
    case "1mes":
      return `${date.getDate()}`;
    case "5meses":
    case "1año":
      const months = [
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
      ];
      return months[date.getMonth()];
    default:
      return dateStr;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function AdminPanel() {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const ITEMS_PER_PAGE = 10;
  const tableEndRef = useRef(null);
  

  const ECOMMERCES_PER_PAGE = 8;
  const ecommerceEndRef = useRef(null);
  

  const allEcommerces = [];
  const allOrders = [];
  

  const colorsCurrentRange = {
    junior: "text-sky-400 border-sky-400",
    amateur: "text-green-500 border-green-500",
    semi_senior: "text-blue-500 border-blue-500",
    senior: "text-red-500 border-red-500",
    elite: "text-amber-500 border-amber-500",
  };

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  

  const [user, setUser] = useState(null);
  const [productCrud,   setProductCrud] = useState(false);
  const [selectedEcommerce, setSelectedEcommerce] = useState(null);
  

  const [searchData, setSearchData] = useState(allEcommerces);
  const [timeRange, setTimeRange] = useState("1semana");
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("Visitas");
  const [width, setWidth] = useState(window.innerWidth);

  const [ordersTable, setOrdersTable] = useState(allOrders);
  const [displayedOrders, setDisplayedOrders] = useState([]); 
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [ecommerceCount, setEcommerceCount] = useState(ECOMMERCES_PER_PAGE);

  function search(data) {
    setLoading(true);
    setSearched(true);
    axios
      .post("/api/search_ecommerce.php", {
        search: data["ecommerce"],
      })
      .then((res) => {
        setLoading(false);
        setSearchData(res.data.data);
        setEcommerceCount(ECOMMERCES_PER_PAGE);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getVisits(timeRange) {
    axios
      .post("/api/get_views.php", { timeRange })
      .then((res) => {
        console.log("Respuesta completa:", res.data);
        if (res.data.success && res.data.data) {
          const formattedData = res.data.data.map((item) => ({
            name: formatDate(item.date, timeRange),
            Visitas: parseInt(item.count, 10),
          }));
          setChartData(formattedData);
        } else {
          console.error("Respuesta sin éxito:", res.data);
        }
      })
      .catch((err) => {
        console.log("Error al obtener visitas:", err);
      });
  }

  function getEarnings(timeRange) {
    axios
      .post("/api/get_earnings.php", { timeRange })
      .then((res) => {
        console.log("Respuesta completa:", res.data);
        if (res.data.success && res.data.data) {
          const formattedData = res.data.data.map((item) => ({
            name: formatDate(item.date, timeRange),
            ganancias: parseInt(item.total || item.amount || item.count, 10), 
          }));
          setChartData(formattedData);
        } else {
          console.error("Respuesta sin éxito:", res.data);
        }
      })
      .catch((err) => {
        console.log("Error al obtener ganancias:", err);
      });
  }

  function table() {
    axios
      .post("/api/orders.php")
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((order) => ({
            id: order.id_compra,
            cliente: order.cliente,
            fecha: order.fecha_compra,
            monto: order.total,
            direccion: order.direccion || "Sin dirección",
            estado: order.estado,
          }));
          setOrdersTable(formatted);
          setDisplayedOrders([]);
          setPage(0);
          setHasMore(true);
        }
      })
      .catch((err) => console.error( err));
  }


  const loadMoreOrders = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newOrders = ordersTable.slice(start, end);

      if (newOrders.length > 0) {
        setDisplayedOrders((prev) => [...prev, ...newOrders]);
        setPage((prev) => prev + 1);
      }

      if (end >= ordersTable.length) setHasMore(false);
      setLoading(false);
    }, 300);
  };

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
    table();
  }, []);

  
  useEffect(() => {
    loadMoreOrders();
  }, [ordersTable]);


  useEffect(() => {
    if (chartType === "Visitas") {
      getVisits(timeRange);
    } else {
      getEarnings(timeRange);
    }
  }, [timeRange, chartType]);
  

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

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);



  return !productCrud ? (
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
                      key={`${order.id}-${i}`}
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
                          order.estado === "enviado"
                            ? "text-green-600"
                            : "text-amber-500"
                        }`}
                      >
                        {capitalize(order.estado)}
                        {order.estado === "enviado" ? (
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
                {loading && (
                  <div className="fixed bottom-28 left-0 right-0 z-50 flex justify-center items-center h-20">
                    <ClipLoader
                      size={40}
                      color="#f0000"
                      className="mt-5 mb-5"
                    />
                  </div>
                )}
              </form>

              <div className="max-h-[600px] overflow-y-auto">
                <div className="flex flex-wrap justify-center">
                  {searchData.slice(0, ecommerceCount).map((ecommerce, i) => (
                    <div
                      key={ecommerce.id}
                      className="flex ml-4 p-4 w-[30%] bg-white hover:cursor-pointer rounded-md shadow-sm hover:shadow-md transition-all duration-100 animate-[fadeSlide_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${i * 0.03}s` }}
                      onClick={() => {
                        setProductCrud(true);
                        setSelectedEcommerce(ecommerce.nombre_usuario);
                      }}
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
              </div>
              {searched && !loading && searchData.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  No se encontró ningún e-commerce con ese nombre
                </p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="font-quicksand mb-18">
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

                        {order.estado === "Enviado" ? (
                          <IoCheckmarkDone className="self-center ml-0.5 text-sm text-sky-500" />
                        ) : (
                          <FaRegClock className="self-center ml-0.5 text-[10px]" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tableEndRef} className="h-2" />
              {!hasMore && displayedOrders.length > 0 && (
                <div className="text-center py-2 text-gray-500 text-[10px]">
                  No hay más pedidos para mostrar
                </div>
              )}
            </section>

            <section className="mt-4 flex flex-col w-full items-center">
              <div className="w-[100%]">
                <form
                  onSubmit={handleSubmit(search)}
                  className="w-full mb-4 px-1"
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
                  {loading && (
                    <div className="fixed bottom-28 left-0 right-0 z-50 flex justify-center items-center h-20">
                      <ClipLoader
                        size={40}
                        color="#f0000"
                        className="mt-5 mb-5"
                      />
                    </div>
                  )}
                </form>

                <div className="max-h-[600px] overflow-y-auto">
                  <div className="flex flex-col gap-4 px-1">
                    {searchData.slice(0, ecommerceCount).map((ecommerce, i) => (
                      <div
                        key={ecommerce.id}
                        className="flex p-3 bg-white hover:cursor-pointer rounded-md shadow-sm hover:shadow-md transition-all duration-100 animate-[fadeSlide_0.5s_ease-out_forwards]"
                        style={{ animationDelay: `${i * 0.03}s` }}
                        onClick={() => {
                          setProductCrud(true);
                          setSelectedEcommerce(ecommerce.nombre_usuario);
                        }}
                      >
                        <div>
                          {ecommerce.logo ? (
                            <img
                              src={`/api/${ecommerce.logo}`}
                              alt="Imagen de E-Commerce"
                              className={`${
                                colorsCurrentRange[ecommerce.nombre_rango]
                              } h-16 w-16 rounded-full border-2`}
                            />
                          ) : (
                            <FaCircleUser
                              className={`${
                                colorsCurrentRange[ecommerce.nombre_rango]
                              } text-5xl m-auto text-gray-500! h-16 w-16 rounded-full border-2`}
                            />
                          )}
                        </div>
                        <div className="flex flex-col ml-5 justify-center">
                          <p className="font-semibold break-words">
                            {ecommerce.nombre_ecommerce}
                          </p>
                          <p
                            className={`${
                              colorsCurrentRange[ecommerce.nombre_rango]
                            } flex items-center text-sm`}
                          >
                            {capitalize(ecommerce.nombre_rango)}
                            <MdOutlineBarChart
                              className="text-sky-700 ml-1"
                              size={14}
                            />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={ecommerceEndRef} className="h-4 w-full" />
                </div>
                {searched && !loading && searchData.length === 0 && (
                  <p className="text-center text-gray-500 mt-4 text-sm">
                    No se encontró ningún e-commerce con ese nombre
                  </p>
                )}
              </div>
            </section>
          </section>
        </div>
      )}
    </section>
  ) : (
    <ProductCRUD
      ecommerce={selectedEcommerce}
      setProductCrud={setProductCrud}
      isAdmin={selectedEcommerce}
    />
  );
}