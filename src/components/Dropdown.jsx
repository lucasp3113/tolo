import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ text = "Seleccionar", options = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // para redirección

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`pt-2 px-4 inline-flex items-center hover:cursor-pointer ${className}`}
      >
        {text}
        <svg className="fill-current h-4 w-4 ml-2" viewBox="0 0 20 20">
          <path
            d="M5.25 7.75L10 12.5l4.75-4.75"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      <ul
        className={`absolute left-0 w-full overflow-hidden bg-white text-gray-800 transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={onClick}
            className="hover:bg-gray-200 py-2 px-4 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;

