import React, { useState, useEffect, useCallback, memo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from "react-router-dom";

const RatingMeter = memo(({ progress, getColor }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 5) * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      const iframes = document.querySelectorAll("iframe");
      if (!iframes.length) return;

      for (const iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (!doc) continue;

          const target = doc.querySelector(".tawk-icon-right");
          if (target) {
            target.remove();
            clearInterval(interval);

            const observer = new MutationObserver(() => {
              const again = doc.querySelector(".tawk-icon-right");
              if (again) again.remove();
            });

            observer.observe(doc.body, { childList: true, subtree: true });
            return;
          }
        } catch (e) {

        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);


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

const RatingMeterMobile = memo(({ progress, getColor }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 5) * circumference;

  return (
    <svg width="60" height="40" viewBox="0 0 100 50" className="flex-shrink-0">
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="#e5e7eb" strokeWidth="10" />
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

const Chart = memo(({ chartData, chartType, isMobile }) => {
  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : "100%"}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartType === 'ventas' ? '#0ea5e9' : '#22c55e'}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={chartType === 'ventas' ? '#0ea5e9' : '#22c55e'}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 11, fontFamily: 'Quicksand' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 11, fontFamily: 'Quicksand' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: 'Quicksand',
            fontSize: isMobile ? '12px' : '14px',
            color: '#fff'
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Line
          type="monotone"
          dataKey={chartType === 'ventas' ? 'ventas' : 'ganancias'}
          stroke={chartType === 'ventas' ? '#0ea5e9' : '#22c55e'}
          strokeWidth={isMobile ? 2.5 : 3}
          dot={false}
          activeDot={{ r: isMobile ? 5 : 6, fill: chartType === 'ventas' ? '#0ea5e9' : '#22c55e' }}
          fill="url(#colorValue)"
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

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload.user);
      setUserId(payload.id_usuario);
    } catch (e) {
    }
  }, []);

  const [pendingStepsFromAPI, setPendingStepsFromAPI] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios.post("/api/pending_steps.php", { userId })
      .then((res) => {
        console.log(res)
        setPendingStepsFromAPI(res.data.data || []);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  // Controlar visibilidad del chatbot solo en esta página
  useEffect(() => {
    // Mostrar chatbot al entrar
    if (window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
      window.Tawk_API.showWidget();
    }

    // Ocultar chatbot al salir (cleanup function)
    return () => {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  const [hoverPendings, setHoverPendings] = useState(true);
  const steps = [
    { key: 'logo', label: 'Agregar logo', path: '/profile_picture/' },
    { key: 'favicon', label: 'Agregar favicon', path: '/favicon/' },
    { key: 'imagen_inicio', label: 'Agregar imagen de inicio', path: '/customize_home/' },
    { key: 'tiene_custom_shop', label: 'Configurar tienda', path: '/customize_store/' },
    { key: 'ubicacion', label: 'Agregar ubicación', path: '/maps/' }
  ];

  const completedSteps = steps.filter(step => ecommerce[step.key]);
  const totalSteps = steps.length;
  const completedCount = steps.filter(step => {
    const value = pendingStepsFromAPI[step.key];
    return value && value !== 0 && value !== '';
  }).length;
  const pendingSteps = steps.filter(step => {
    const value = pendingStepsFromAPI[step.key];
    return !value || value === 0 || value === '';
  });





  useEffect(() => {
    if (user) {
      axios
        .post("/api/show_profile_picture.php", { user })
        .then((res) => {
          console.log(res)
          if (res.data?.logo?.logo) {
            setLogo(`/api/${res.data.logo.logo}`);
          } else {
            setLogo(null);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

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
      case '1dia':
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
      case '1mes':
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

  const { ecommerce: nameEcommerce } = useParams();

  useEffect(() => {
    setChartData(generateDummyData());
  }, [generateDummyData]);

  const getColor = useCallback((value) => {
    if (value < 2.5) return "red";
    if (value < 4) return "orange";
    return "green";
  }, []);


  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        {pendingSteps.length > 0 && (
          <section onMouseEnter={() => setHoverPendings(false)}
            onMouseLeave={() => setHoverPendings(true)}
            className={`absolute z-50 text-green-500 font-quicksand font-semibold left-9 transition-colors ease-in-out duration-500 w-58 hover:h-38 p-1 whitespace-nowrap rounded-xl hover:bg-green-500 hover:text-white cursor-pointer text-lg bottom-0`}>
            {!hoverPendings ? (
              <ul className="">
                {pendingSteps.map(step => (
                  <li
                    key={step.key}
                    onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}${step.path}`) : navigate(step.path)}
                    className="hover:underline cursor-pointer text-white"
                  >
                    {step.label}
                  </li>
                ))}
              </ul>
            ) : (
              `${completedCount} de ${totalSteps} pasos completados`
            )}
          </section>
        )}
        <div className="bg-white cursor-pointer relative w-full shadow p-4 flex items-center border-b border-gray-200">
          {logo ? (
            <img
              src={logo}
              alt="Logo Comercio"
              onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/profile_picture/`) : navigate("/profile_picture/")}
              className="w-16 h-16 object-contain bg-white border-2 border-sky-600 rounded-full flex-shrink-0 p-1 shadow-sm"
            />
          ) : (
            <span
              onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/profile_picture/`) : navigate("/profile_picture/")}
              className="font-quicksand flex text-md font-semibold cursor-pointer items-center justify-center w-16 h-16 object-contain bg-white border-2 border-sky-600 rounded-full flex-shrink-0 p-1 shadow-sm"
            >
              Añadir logo
            </span>
          )}
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

        <div className="flex-1 p-4 flex flex-col gap-4 pb-6">
          <div className="flex gap-3">
            <button
              onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/create_product/`) : navigate("/create_product/")}
              className="flex-1 bg-gradient-to-r from-sky-800 to-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md font-quicksand text-sm"
            >
              + Añadir producto
            </button>
            <button
              onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/product_crud/`) : navigate("/product_crud/")}
              className="flex-1 bg-gradient-to-r from-sky-800 to-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md font-quicksand text-sm"
            >
              Ver mis productos
            </button>
          </div>

          <section className="w-full flex items-center justify-center">
            {children}
          </section>

          <div className="bg-white shadow-md mb-22 rounded-xl p-4">
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

              <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
                <button
                  onClick={() => setChartType('ventas')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${chartType === 'ventas' ? 'bg-sky-600 text-white' : 'text-gray-600'
                    }`}
                >
                  Ventas
                </button>
                <button
                  onClick={() => setChartType('ganancias')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${chartType === 'ganancias' ? 'bg-green-600 text-white' : 'text-gray-600'
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
                  className={`px-3 py-1 rounded-md text-xs font-semibold font-quicksand whitespace-nowrap duration-150 ${timeRange === key ? 'bg-gray-800 text-white' : 'text-gray-500 bg-gray-50'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <Chart chartData={chartData} chartType={chartType} isMobile={true} />
          </div>
        </div>
      </div>
    );
  }

  // VERSIÓN DESKTOP
  return (
    <section className="w-full p-5 h-full flex justify-between items-center">

      <section className="w-1/4 h-full relative shadow-md flex items-center flex-col p-4">
        {logo ? (
          <img
            src={logo}
            alt="Logo Comercio"
            onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/profile_picture/`) : navigate("/profile_picture/")}
            className="w-36 h-36 cursor-pointer mb-4 border-4 border-sky-600 rounded-full object-contain bg-white p-2 shadow-lg"
          />
        ) : (
          <span
            onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/profile_picture/`) : navigate("/profile_picture/")}
            className="font-quicksand w-36 h-36 mb-4 border-4 border-sky-600 rounded-full font-semibold flex text-xl cursor-pointer items-center justify-center bg-white p-2 shadow-lg"
          >
            Añadir logo
          </span>
        )}
        <h1 className="text-3xl font-bold mb-2 font-quicksand text-gray-800"></h1>

        <RatingMeter progress={progress} getColor={getColor} />

        {pendingSteps.length > 0 && (
          <section onMouseEnter={() => setHoverPendings(false)}
            onMouseLeave={() => setHoverPendings(true)}
            className={`absolute bottom-36 
      z-50 text-green-500 font-quicksand font-semibold 
      transition-all ease-in-out duration-500 
      w-58 p-1 whitespace-nowrap rounded-xl left-1/2
      hover:bg-green-500 hover:text-white 
      cursor-pointer text-lg`}>
            {!hoverPendings ? (
              <ul className="">
                {pendingSteps.map(step => (
                  <li
                    key={step.key}
                    onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}${step.path}`) : navigate(step.path)}
                    className="hover:underline cursor-pointer text-white"
                  >
                    {step.label}
                  </li>
                ))}
              </ul>
            ) : (
              `${completedCount} de ${totalSteps} pasos completados`
            )}
          </section>
        )}

        <section className="w-full flex flex-col mt-auto">
          <button
            onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/create_product/`) : navigate("/create_product/")}
            className="w-full bg-gradient-to-r from-sky-800 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold py-3 px-4 rounded-xl duration-200 shadow-md hover:shadow-lg font-quicksand flex items-center justify-center"
          >
            <span className="text-xl">+</span>
            Añadir Producto
          </button>
          <button
            onClick={() => nameEcommerce ? navigate(`/${ecommerce.nombre_ecommerce}/product_crud/`) : navigate("/product_crud/")}
            className="w-full bg-gradient-to-r from-sky-800 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold py-3 px-4 rounded-xl duration-200 shadow-md hover:shadow-lg font-quicksand flex items-center justify-center translate-y-1.5"
          >
            Ver Mis Productos
          </button>
        </section>
      </section>

      <section className="w-1/3 flex items-center justify-center">
        <section className="w-[90%]">
          {children}
        </section>
      </section>

      <section className="w-2/5 mr-2 bg-white shadow-md flex flex-col h-full">
        <section className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 font-quicksand flex items-center gap-2">
            {chartType === 'ventas' ? (
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

          <section className="flex gap-2 bg-gray-50 p-2 rounded-4xl">
            <button
              onClick={() => setChartType('ventas')}
              className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${chartType === 'ventas'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Ventas
            </button>
            <button
              onClick={() => setChartType('ganancias')}
              className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${chartType === 'ganancias'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Ganancias
            </button>
          </section>
        </section>

        <section className="flex gap-2 mb-4">
          {[
            { key: '1dia', label: '1D' },
            { key: '1semana', label: '1S' },
            { key: '1mes', label: '1M' },
            { key: '5meses', label: '5M' },
            { key: '1año', label: '1A' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${timeRange === key
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              {label}
            </button>
          ))}
        </section>

        <section className="flex-1 min-h-0">
          <Chart chartData={chartData} chartType={chartType} isMobile={false} />
        </section>
      </section>
    </section >
  );
}
