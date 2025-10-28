import React, {useState, useEffect} from "react";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

export default function Footer({ color }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFbClick = () => {
        window.open("https://www.facebook.com", "_blank");
    };

    const handleIgClick = () => {
        window.open("https://www.instagram.com", "_blank");
    };

    const handleXClick = () => {
        window.open("https://www.x.com", "_blank");
    };

    const handlePoliciesClick = () => {
        window.open(
            "https://support.google.com/webmasters/answer/2445990?hl=es",
            "_blank"
        );
    };

    return (
        <footer style={{ backgroundColor: color || "#075985" }} className={`w-full bg-sky-800 flex flex-col items-center justify-center mt-0 border-gray-300 p-4 
 text-gray-400 
  md:bg-sky-800 md:text-white
    lg:bg-sky-800 lg:text-white`}>
            <p className="text-center text-xl md:text-sm lg-text-sm mb-4 max-w-4xl">
                ℠ Tolo 2025.
            </p>

            <nav className="flex gap-6 items-center justify-center">
                <FaFacebookSquare
                    className="text-3xl md:text-4xl lg:text-4xl cursor-pointer hover:text-blue-900 transition-all duration-300"
                    onClick={handleFbClick}
                />
                <FaInstagram
                    className="text-3xl md:text-4xl lg:text-4xl cursor-pointer hover:text-pink-500 transition-all duration-300"
                    onClick={handleIgClick}
                />
                <FaXTwitter
                    className="text-3xl md:text-4xl lg:text-4xl cursor-pointer hover:text-black transition-all duration-300"
                    onClick={handleXClick}
                />
                <button
                    onClick={handlePoliciesClick}
                    className="md:text-sm lg:text-sm  hover:text-sky-700 hover:underline transition-colors duration-300"
                >
                    Políticas de Privacidad
                </button>
            </nav>
        </footer>
    );
}