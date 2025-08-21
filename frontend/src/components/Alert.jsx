import { useEffect, useState } from "react";
import { FaTimes, FaCheck, FaExclamation, FaInfoCircle } from "react-icons/fa";

const Alert = ({
  isOpen,
  title,
  message,
  variant = "info",
  type = "modal",
  className = "",
  onClose,
  showCancelButton = false,
  cancelText = "Cancelar",
  onCancel,
}) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
  }, [isOpen]);

  useEffect(() => {
    if (type === "toast" && isOpen) {
      const timer = setTimeout(() => {
        // Inicia animación de salida
        setShow(false);
        // Cierra después de que la animación termine
        setTimeout(() => {
          onClose();
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isOpen && !show) return null;

  const baseStyles = {
    info: "bg-blue-100 border-blue-500 text-blue-800",
    success: "bg-green-100 border-green-500 text-green-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    danger: "bg-red-100 border-red-500 text-red-800",
  };

  const variantClass = baseStyles[variant] || baseStyles.info;

  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return <FaCheck className="inline mr-2" />;
      case "danger":
        return <FaTimes className="inline mr-2" />;
      case "warning":
        return <FaExclamation className="inline mr-2" />;
      case "info":
      default:
        return <FaInfoCircle className="inline mr-2" />;
    }
  };

  if (type === "modal") {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo borroso */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className={`relative p-6 rounded-lg border shadow-md max-w-sm w-full ${variantClass} ${className}`}>
        <h2 className="text-lg font-semibold tracking-wide mb-2">{title}</h2>
        <p className="text-sm font-medium">{message}</p>
        <div className="flex justify-center gap-2">
          {showCancelButton && (
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              onClick={() => {
                setShow(false);
                onCancel?.(); 
              }}
            >
              {cancelText}    
            </button>    
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => {
              setShow(false); // inicia animación de salida
              onClose();      // llama a la función de cierre del padre
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}



  // TOAST (solo título, padding reducido, con icono y animación)
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-2 rounded-lg border shadow-lg min-w-[200px] ${variantClass} ${className}
        transition-all duration-300 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <h2 className="font-semibold flex items-center justify-center">
        {getIcon(variant)}
        {title}
      </h2>
      {/* <p>{message}</p> */}
    </div>
  );
};

export default Alert;
