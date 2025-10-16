import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

export default function Footer({color}) {
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
        <footer style={{ backgroundColor: color || "#1F2937" }} className="w-full flex flex-col items-center justify-center mt-10 border-t border-gray-300 p-4 
 text-gray-400 
  md:bg-gray-800 md:text-white
    lg:bg-gray-800 lg:text-white">
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