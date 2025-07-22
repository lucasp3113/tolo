import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import blackHamburger from "../assets/blackHamburger.png";
import whiteHamburger from "../assets/whiteHamburger.png";

const Dropdown = ({
  text = "",
  options = [],
  className = "",
  cnhamburger = "",
  cndiv = "",
  theme = "black",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${cndiv}`}>
      <button
        onClick={toggleDropdown}
        className={`${
          text === ""
            ? "w-10 h-10 flex items-center justify-center"
            : "flex items-center px-4 py-2"
        } ${className}`}
      >
        {text === "" ? (
          <img
            src={theme === "white" ? whiteHamburger : blackHamburger}
            className={`object-contain ${cnhamburger}`}
            alt="menu"
          />
        ) : (
          <>
            <span>{text}</span>
            <svg className="fill-current h-4 w-4 ml-2" viewBox="0 0 20 20">
              <path
                d="M5.25 7.75L10 12.5l4.75-4.75"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </>
        )}
      </button>

      <ul
        className={`absolute mt-1 z-20 ${
          text === "" ? "left-1/2 -translate-x-1/2" : "left-0"
        } w-auto min-w-max bg-white text-gray-800 shadow-lg rounded-md overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            className="hover:bg-gray-200 py-3 px-6 whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
