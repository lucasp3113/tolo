import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const ProtectedComponent = ({ 
  children, 
  fallback = null, 
  requireAuth = true,
  showLoginPrompt = true 
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Si requiere auth y no está logueado
  if (requireAuth && !isLoggedIn) {
    
    // Interceptamos los clicks en el Rating y redirigimos
    const interceptedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          onRatingChange: handleLoginRedirect // Interceptamos el onRatingChange del Rating
        });
      }
      return child;
    });

    return interceptedChildren;

    // Código anterior comentado para referencia:
    /*
    if (fallback) {
      return fallback;
    }

    if (showLoginPrompt) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <Lock className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Autenticación requerida
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Debes iniciar sesión para usar esta funcionalidad
          </p>
          <button 
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      );
    }

    return null;
    */
  }

  // Si está logueado, renderiza el contenido normalmente
  return children;
};

export default ProtectedComponent;