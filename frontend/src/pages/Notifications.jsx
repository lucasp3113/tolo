import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { IoNotifications } from "react-icons/io5";
import { IoNotificationsOffSharp } from "react-icons/io5";


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Ejemplo de estilos según tipo de notificación
  const typeStyles = {
    success: "border-green-300 bg-green-50 text-green-800",
    info: "border-blue-300 bg-blue-50 text-blue-800",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
    default: "border-gray-300 bg-gray-50 text-gray-800"
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-center">
        <IoNotifications className="text-blue-600 text-3xl" />
        Notificaciones
      </h2>

      {notifications.length > 0 ? (
        <div className="w-full max-w-2xl space-y-4">
          {notifications.map((n, i) => (
            <Card
              key={i}
              className={`flex items-start gap-3 border ${
                typeStyles[n.type] || typeStyles.default
              } transform transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <IoNotifications className="text-xl mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold">{n.title}</h4>
                <p className="text-sm">{n.message}</p>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 h-64">
          <IoNotificationsOffSharp className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-400 text-xl font-semibold text-center">
            No tienes notificaciones
          </p>
        </div>
      )}
    </div>
  );
}

