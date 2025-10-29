import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import logoTolo from '../assets/logoTolo.webp'
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function Account() {
    const [color, setColor] = useState(null)
    const [goodContrast, setGoodContrast] = useState(true)
    const { ecommerce: nameEcommerce } = useParams();

    useEffect(() => {
        nameEcommerce && (
            nameEcommerce && axios.post("/api/show_custom_store.php", {
                ecommerce: nameEcommerce
            })
                .then((res) => {
                    setColor(res.data.data.header_color)
                })
                .catch((res) => console.log(res))
        )
    }, [nameEcommerce])



    useEffect(() => {
        if (color) {
            setGoodContrast(hasGoodContrast('#FFFFFF', color, 1.45));
        }
    }, [color]);


    function hasGoodContrast(color1, color2, threshold = 1.1) {
        if (!color1 || !color2) return true;

        const getLuminance = (hex) => {
            if (!hex || !hex.startsWith('#')) return 0;

            const rgb = parseInt(hex.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;

            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });

            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        const contrast = (brightest + 0.05) / (darkest + 0.05);

        return contrast >= threshold;
    }

    const [isLogin, setIsLogin] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [logoEcommerce, setLogoEcommerce] = useState(null);
    const [headerColor, setHeaderColor] = useState(null)

    const toggleForm = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsLogin(!isLogin);

        setTimeout(() => setIsAnimating(false), 800);
    };

    useEffect(() => {
        if (!nameEcommerce) {
            setLogoEcommerce(null);
            return;
        }

        axios.post("/api/show_profile_picture.php", { nameEcommerce })
            .then(res => {
                setLogoEcommerce(res.data.logo.logo);
            })
            .catch(err => {
                console.error(err);
                setLogoEcommerce(null);
            });

        if (!nameEcommerce) {
            setHeaderColor("#075985");
            setMainColor("#FFFFFF");
            setFooterColor("#075985");
        }
        nameEcommerce && axios.post("/api/show_custom_store.php", {
            ecommerce: nameEcommerce
        })
            .then((res) => {
                setHeaderColor(res.data.data.header_color)
            })
            .catch((res) => console.log(res))
        return () => setLogoEcommerce(null);
    }, [nameEcommerce]);

    function hexToHSL(hex) {
        hex = hex.replace("#", "");
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }

    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function darkenHex(hex, amount = 10) {
        let [h, s, l] = hexToHSL(hex);
        l = Math.max(0, l - amount);
        return hslToHex(h, s, l);
    }

    const gradientColors = headerColor
        ? `from-[${headerColor}] via-[${darkenHex(headerColor, 10)}] to-[${darkenHex(headerColor, 20)}]`
        : "from-gray-600 via-gray-500 to-gray-400";



    return (
        <section
            className={`h-screen w-screen flex items-center justify-center overflow-hidden ${!headerColor ? "bg-gradient-to-b from-sky-950 via-sky-900 to-sky-800" : ""
                }`}
            style={
                headerColor
                    ? {
                        background: `linear-gradient(to bottom, ${headerColor}, ${darkenHex(
                            headerColor,
                            10
                        )}, ${darkenHex(headerColor, 20)})`,
                    }
                    : {}
            }
        >


            <div className="w-full h-full relative">
                <div className="flex h-full relative">
                    <div
                        className={`absolute top-0 w-1/2 h-full flex flex-col justify-center items-center p-8 text-white bg-transparent transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-20 ${isLogin ? 'left-1/2' : 'left-0'
                            }`}
                    >
                        <section className='flex items-center justify-center w-34 h-18 scale-120 cursor-pointer'>
                            <img src={logoEcommerce ? `/api/${logoEcommerce}` : logoTolo} loading='lazy' className={`${logoEcommerce && "mb-12 scale-75"} object-contain`} alt="Logo" />
                        </section>
                        {/* <h1 className="text-5xl text-white md:text-6xl font-bold text-center mb-6">
                            {isLogin ? '¡Bienvenido!' : '¡Hola!'}
                        </h1> */}
                        <p className={`text-lg font-quicksand font-semibold text-center mb-4 ${goodContrast ? "text-sky-100" : "text-gray-700"}`}>
                            {isLogin
                                ? '¿No tienes cuenta? Regístrate ahora'
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </p>
                        <button
                            onClick={toggleForm}
                            disabled={isAnimating}
                            className={`${goodContrast ? "bg-white/20 hover:bg-white/30 border-white" : "bg-black "} border-2 text-white font-semibold text-lg px-10 py-3 rounded-full  hover:scale-105 transition-all duration-300 disabled:opacity-50`}
                        >
                            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                        </button>
                    </div>

                    <div
                        className={`absolute top-0 w-1/2 h-full bg-transparent transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-10 overflow-y-auto ${isLogin ? 'left-0 ' : 'left-1/2 '
                            }`}
                    >
                        <div className={`h-full !overflow-hidden bg-white flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="w-full overflow-hidden px-4">
                                {isLogin ? <Login pc={true} /> : <Register pc={true} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}