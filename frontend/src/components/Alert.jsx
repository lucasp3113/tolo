import { useEffect, useState } from "react";

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type === "toast" && isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false); // inicia animación (AURA)
        setTimeout(onClose, 300); // espera la animación antes de cerrar la alert
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isOpen && !visible) return null;

  const baseStyles = {
    info: "bg-blue-100 border-blue-500 text-blue-800",
    success: "bg-green-100 border-green-500 text-green-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    danger: "bg-red-100 border-red-500 text-red-800",
  };

  const variantClass = baseStyles[variant] || baseStyles.info;

  if (type === "modal") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`p-6 rounded-lg border shadow-md max-w-sm w-full ${variantClass} ${className}`}>
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            {showCancelButton && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TOAST
  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 p-4 rounded-lg border shadow-lg
        ${variantClass} ${className}
        transform transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <h2 className="font-semibold">{title}</h2>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
