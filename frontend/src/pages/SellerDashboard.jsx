import React, { useState, useEffect, useCallback, memo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RatingMeter = memo(({ progress, getColor }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 5) * circumference;

  return (
    <div className="mb-6 flex flex-col items-center">
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
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#374151"
        >
          {progress.toFixed(1)}
        </text>
      </svg>
      <p className="text-gray-600 text-sm mt-2 font-quicksand font-medium">
        Calificación
      </p>
    </div>
  );
});

const Chart = memo(({ chartData, chartType }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
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
          dataKey={chartType === "ventas" ? "ventas" : "ganancias"}
          stroke={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: chartType === "ventas" ? "#0ea5e9" : "#22c55e",
          }}
          fill="url(#colorValue)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

const RatingMeterMobile = memo(({ progress, getColor }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 5) * circumference;

  return (
    <svg width="60" height="40" viewBox="0 0 100 50" className="flex-shrink-0">
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
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      <text
        x="50"
        y="45"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#374151"
      >
        {progress.toFixed(1)}
      </text>
    </svg>
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
              stopColor={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
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
          dataKey={chartType === "ventas" ? "ventas" : "ganancias"}
          stroke={chartType === "ventas" ? "#0ea5e9" : "#22c55e"}
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: chartType === "ventas" ? "#0ea5e9" : "#22c55e",
          }}
          fill="url(#colorValueMobile)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default function SellerDashboard({ children }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [logo, setLogo] = useState(null);
  const rating = 4;
  const [progress, setProgress] = useState(0);
  const [timeRange, setTimeRange] = useState("1semana");
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("ventas");

  const [ecommerce, setEcommerce] = useState({
    nombre_ecommerce: "",
    facturacion_acumulada: 0,
    name_range: "",
    commission_percentage: 0,
    minimum_billing: 0,
    next_range: "",
    next_percentage: 0,
  });

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    user = payload.user;
  }

  useEffect(() => {
    axios
      .post("/api/show_profile_picture.php", { user })
      .then((res) => {
        if (res.data.logo && res.data.logo.logo) {
          setLogo(`/api/${res.data.logo.logo}`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .post("/api/ecommerce.php", { usuario: user })
      .then((res) => {
        if (res.data.success) {
          setEcommerce({
            nombre_ecommerce: res.data.ecommerce_name,
            facturacion_acumulada: res.data.cumulative_billing,
            name_range: res.data.name_range,
            commission_percentage: res.data.commission_percentage,
            minimum_billing: res.data.minimum_billing,
            next_range: res.data.next_range,
            next_percentage: res.data.next_percentage,
          });
        }
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    let startTime = performance.now();
    const duration = 1000;
    let animationFrameId;

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(rating * eased);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [rating]);

  const generateDummyData = useCallback(() => {
    switch (timeRange) {
      case "1dia":
        return Array.from({ length: 24 }, (_, i) => ({
          name: `${i}:00`,
          ventas: Math.floor(Math.random() * 10),
          ganancias: Math.floor(Math.random() * 500),
        }));
      case "1semana":
        return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => ({
          name: day,
          ventas: Math.floor(Math.random() * 50),
          ganancias: Math.floor(Math.random() * 3000),
        }));
      case "1mes":
        return Array.from({ length: 30 }, (_, i) => ({
          name: `${i + 1}`,
          ventas: Math.floor(Math.random() * 20),
          ganancias: Math.floor(Math.random() * 1500),
        }));
      case "5meses":
        return ["Mes 1", "Mes 2", "Mes 3", "Mes 4", "Mes 5"].map((mes) => ({
          name: mes,
          ventas: Math.floor(Math.random() * 200),
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
          ventas: Math.floor(Math.random() * 150),
          ganancias: Math.floor(Math.random() * 10000),
        }));
      default:
        return [];
    }
  }, [timeRange]);

  useEffect(() => {
    setChartData(generateDummyData());
  }, [generateDummyData]);

  const getColor = useCallback((value) => {
    if (value < 2.5) return "red";
    if (value < 4) return "orange";
    return "green";
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="hidden md:flex h-screen w-screen overflow-hidden p-6 gap-6">
        <div className="w-80 flex-shrink-0 bg-white shadow-md flex flex-col items-center p-6 overflow-y-auto border-r border-gray-200 rounded-md">
          {logo ? (
            <img
              src={logo}
              alt="Logo Comercio"
              className="w-36 h-36 mb-4 border-4 border-sky-600 rounded-full object-contain bg-white p-2 shadow-lg"
            />
          ) : (
            <FaCircleUser className="w-36 h-36 mb-4 border-4 text-gray-500 border-sky-600 rounded-full object-contain bg-white p-2 shadow-lg" />
          )}
          <h1 className="text-3xl font-bold mb-2 font-quicksand text-gray-800">
            {ecommerce.nombre_ecommerce}
          </h1>
          <RatingMeter progress={progress} getColor={getColor} />
          <div className="flex items-center justify-center mb-8 text-gray-700 font-quicksand">
            <FaLocationDot className="text-sky-600 mr-2" size={18} />
            <span className="font-medium">San José, Uruguay</span>
          </div>
          <div className="w-full flex flex-col gap-3 mt-auto">
            <button
              onClick={() => navigate("/create_product/")}
              className="w-full bg-sky-700 hover:bg-sky-800 transition-all hover:cursor-pointer text-white font-semibold py-3 px-4 rounded-xl duration-100 shadow-md hover:shadow-lg font-quicksand flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              Añadir Producto
            </button>
            <button
              onClick={() => navigate("/product_crud/")}
              className="w-full bg-sky-700 hover:bg-sky-800 transition-all hover:cursor-pointer text-white font-semibold py-3 px-4 rounded-xl duration-100 shadow-md hover:shadow-lg font-quicksand flex items-center justify-center gap-2"
            >
              <span className="text-xl"></span>
              Ver Mis Productos
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex gap-6">
            <div className="w-96 flex-shrink-0">{children}</div>

            <div className="flex-1 bg-white shadow rounded-xl p-6 mr-3 hover:shadow-lg duration-200 flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 font-quicksand flex items-center gap-2">
                  {chartType === "ventas" ? (
                    <>
                      <span className="text-sky-600"></span>
                      Ventas
                    </>
                  ) : (
                    <>
                      <span className="text-green-600"></span>
                      Ganancias
                    </>
                  )}
                </h2>

                <div className="flex gap-2 p-1 rounded-lg">
                  <button
                    onClick={() => setChartType("ventas")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                      chartType === "ventas"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Ventas
                  </button>
                  <button
                    onClick={() => setChartType("ganancias")}
                    className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                      chartType === "ganancias"
                        ? "bg-green-600 text-white shadow-sm"
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
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${
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
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col min-h-screen">
        <div className="bg-white relative w-full shadow p-4 flex items-center border-b border-gray-200">
          <img
            src={logo}
            alt="Logo Comercio"
            className="w-16 h-16 object-contain bg-white border-2 border-sky-600 rounded-full flex-shrink-0 p-1 shadow-sm"
          />
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-xl font-bold font-quicksand text-gray-800">
              Arctec
            </h1>
            <div className="flex items-center text-xs text-gray-600 font-quicksand mt-1">
              <FaLocationDot className="mr-1 text-sky-600" size={10} />
              <span>San José, Uruguay</span>
            </div>
          </div>
          <RatingMeterMobile progress={progress} getColor={getColor} />
        </div>

        <div className="flex-1 p-4 flex flex-col gap-4 pb-6 overflow-y-auto">
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/create_product/")}
              className="flex-1 bg-gradient-to-r from-sky-800 to-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md font-quicksand text-sm"
            >
              + Añadir producto
            </button>
            <button
              onClick={() => navigate("/product_crud/")}
              className="flex-1 bg-gradient-to-r from-sky-800 to-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md font-quicksand text-sm"
            >
              Ver mis productos
            </button>
          </div>

          {children}

          <div className="bg-white shadow mb-22 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 font-quicksand flex items-center gap-2">
                {chartType === "ventas" ? (
                  <>
                    <span className="text-sky-600"></span>Ventas
                  </>
                ) : (
                  <>
                    <span className="text-green-600"></span>Ganancias
                  </>
                )}
              </h2>

              <div className="flex gap-1 p-1 rounded-lg">
                <button
                  onClick={() => setChartType("ventas")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                    chartType === "ventas"
                      ? "bg-sky-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  Ventas
                </button>
                <button
                  onClick={() => setChartType("ganancias")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                    chartType === "ganancias"
                      ? "bg-green-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  Ganancias
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
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
                  className={`px-3 py-1 rounded-md text-xs font-semibold font-quicksand whitespace-nowrap duration-150 ${
                    timeRange === key
                      ? "bg-gray-800 text-white"
                      : "text-gray-500 bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <ChartMobile chartData={chartData} chartType={chartType} />
          </div>
        </div>
      </div>
    </div>
  );
}
