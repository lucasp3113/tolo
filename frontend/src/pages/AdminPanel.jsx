import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = memo(({ chartData, chartType }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop 
              offset="5%" 
              stopColor={chartType === 'Visitas' ? '#0ea5e9' : '#22c55e'} 
              stopOpacity={0.3}
            />
            <stop 
              offset="95%" 
              stopColor={chartType === 'Visitas' ? '#0ea5e9' : '#22c55e'} 
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Quicksand' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Quicksand' }}
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
            color: '#fff'
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Line 
          type="monotone" 
          dataKey={chartType === 'Visitas' ? 'Visitas' : 'ganancias'} 
          stroke={chartType === 'Visitas' ? '#0ea5e9' : '#22c55e'} 
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: chartType === 'Visitas' ? '#0ea5e9' : '#22c55e' }}
          fill="url(#colorValue)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const tableEndRef = useRef(null);
  const ITEMS_PER_PAGE = 10;
  const [timeRange, setTimeRange] = useState('1semana');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('Visitas');

  const allOrders = [
    { id: 1, cliente: "Juan Camilo", fecha: "08/10/2025", monto: "$5000", direccion: "Pelossi 653", estado: "Enviado" },
    { id: 2, cliente: "Bruno Camilo", fecha: "08/10/2025", monto: "$3500", direccion: "Rocha 489", estado: "Enviado" },
    { id: 3, cliente: "Beto Torreta", fecha: "08/10/2025", monto: "$2300", direccion: "Nicolás Guerra 101", estado: "En proceso" },
    { id: 4, cliente: "María López", fecha: "07/10/2025", monto: "$4200", direccion: "Av. Brasil 234", estado: "Enviado" },
    { id: 5, cliente: "Carlos Ruiz", fecha: "07/10/2025", monto: "$1800", direccion: "Colonia 567", estado: "En proceso" },
    { id: 6, cliente: "Ana García", fecha: "06/10/2025", monto: "$3100", direccion: "18 de Julio 890", estado: "Enviado" },
    { id: 7, cliente: "Pedro Sánchez", fecha: "06/10/2025", monto: "$2900", direccion: "Rivera 123", estado: "En proceso" },
    { id: 8, cliente: "Laura Fernández", fecha: "05/10/2025", monto: "$5500", direccion: "8 de Octubre 456", estado: "Enviado" },
    { id: 9, cliente: "Diego Martínez", fecha: "05/10/2025", monto: "$2100", direccion: "Bulevar Artigas 789", estado: "En proceso" },
    { id: 10, cliente: "Sofía Rodríguez", fecha: "04/10/2025", monto: "$3800", direccion: "Millán 321", estado: "Enviado" },
    { id: 11, cliente: "Javier Torres", fecha: "04/10/2025", monto: "$4500", direccion: "Constituyente 654", estado: "En proceso" },
    { id: 12, cliente: "Valentina Pérez", fecha: "03/10/2025", monto: "$2700", direccion: "Agraciada 987", estado: "Enviado" },
    { id: 13, cliente: "Mateo Silva", fecha: "03/10/2025", monto: "$3300", direccion: "Comercio 147", estado: "En proceso" },
    { id: 14, cliente: "Camila Gómez", fecha: "02/10/2025", monto: "$4100", direccion: "San José 258", estado: "Enviado" },
    { id: 15, cliente: "Lucas Díaz", fecha: "02/10/2025", monto: "$1900", direccion: "Yaguarón 369", estado: "En proceso" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.post("/api/check_admin.php", { token })
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
    switch(timeRange) {
      case '1dia':
        return Array.from({length: 24}, (_, i) => ({
          name: `${i}:00`,
          Visitas: Math.floor(Math.random() * 10),
          ganancias: Math.floor(Math.random() * 500)
        }));
      case '1semana':
        return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => ({
          name: day,
          Visitas: Math.floor(Math.random() * 50),
          ganancias: Math.floor(Math.random() * 3000)
        }));
      case '1mes':
        return Array.from({length: 30}, (_, i) => ({
          name: `${i + 1}`,
          Visitas: Math.floor(Math.random() * 20),
          ganancias: Math.floor(Math.random() * 1500)
        }));
      case '5meses':
        return ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5'].map(mes => ({
          name: mes,
          Visitas: Math.floor(Math.random() * 200),
          ganancias: Math.floor(Math.random() * 15000)
        }));
      case '1año':
        return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(mes => ({
          name: mes,
          Visitas: Math.floor(Math.random() * 150),
          ganancias: Math.floor(Math.random() * 10000)
        }));
      default:
        return [];
    }
  }, [timeRange]);

  useEffect(() => {
    setChartData(generateDummyData());
  }, [generateDummyData]);

  return (
    <div className="flex gap-4 p-4">
      {/* === TABLA DE PEDIDOS === */}
      <section className="w-[61%] bg-white shadow rounded-xl p-4 max-h-[28rem] overflow-y-auto">
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
                <td className="px-4 py-2 border border-gray-200">{order.id}</td>
                <td className="px-4 py-2 border border-gray-200">{order.cliente}</td>
                <td className="px-4 py-2 border border-gray-200">{order.fecha}</td>
                <td className="px-4 py-2 border border-gray-200">{order.monto}</td>
                <td className="px-4 py-2 border border-gray-200">{order.direccion}</td>
                <td className={`px-4 py-2 border border-gray-200 font-bold flex justify-center ${
                  order.estado === "Enviado" ? "text-green-600" : "text-amber-500"
                }`}>
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

      {/* === GRÁFICO === */}
      <section className="w-[40%] bg-white shadow rounded-xl p-6 hover:shadow-lg duration-200 flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 font-quicksand flex items-center gap-2">
            {chartType === 'Visitas' ? (
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
              onClick={() => setChartType('Visitas')}
              className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                chartType === 'Visitas'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Visitas
            </button>
            <button
              onClick={() => setChartType('ganancias')}
              className={`px-4 py-2 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                chartType === 'ganancias'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Ganancias
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
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
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-quicksand duration-150 ${
                timeRange === key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
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
    </div>
  );
}
