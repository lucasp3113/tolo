import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Account() {
    const [isLogin, setIsLogin] = useState(true); 
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleForm = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsLogin(!isLogin);
        
        setTimeout(() => setIsAnimating(false), 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="flex min-h-[500px] relative">
                    <div 
                        className={`absolute top-0 w-1/2 h-full flex flex-col justify-center items-center p-8 text-white bg-sky-800 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-20 ${
                            isLogin ? 'left-1/2 rounded-r-3xl' : 'left-0 rounded-l-3xl'
                        }`}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
                            {isLogin ? '¡Bienvenido!' : '¡Hola!'}
                        </h1>
                        <p className="text-lg text-center mb-8 text-sky-100">
                            {isLogin 
                                ? '¿No tienes cuenta? Regístrate ahora' 
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </p>
                        <button
                            onClick={toggleForm}
                            disabled={isAnimating}
                            className="bg-white/20 border-2 border-white text-white font-semibold text-lg px-10 py-3 rounded-full hover:bg-white/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                        </button>
                    </div>

                    {/* Contenedor del Formulario */}
                    <div 
                        className={`absolute top-0 w-1/2 h-full bg-white transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-10 overflow-y-auto ${
                            isLogin ? 'left-0 rounded-l-3xl' : 'left-1/2 rounded-r-3xl'
                        }`}
                    >
                        <div className={`h-full flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            {/* Renderizar componente según estado */}
                            <div className="w-full px-4">
                                {isLogin ? <Login /> : <Register pc={true} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}