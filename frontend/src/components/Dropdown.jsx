import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Dropdown = ({
  size = "30",
  text = "",
  options = [],
  className = "",
  cnhamburger = "",
  cndiv = "",
  direction = "d", // 👉 NUEVO: "d" = down, "r" = right, "l" = left
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 👉 Direcciones dinámicas
  let positionClasses = "";

  if (direction === "d") {
    positionClasses = text === "" ? "left-1/2 -translate-x-1/2 top-full" : "left-0 top-full";
  } else if (direction === "r") {
    positionClasses = "left-full top-0";
  } else if (direction === "l") {
    positionClasses = "right-full top-0";
  } else {
    positionClasses = "left-0 top-full"; // fallback
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${cndiv}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`${
          text === ""
            ? "flex items-center justify-center cursor-pointer"
            : "flex items-center px-4 py-2"
        } ${className}`}
      >
        {text === "" ? (
          <RxHamburgerMenu size={size} className={`${cnhamburger}`} />
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
        className={`absolute mt-1 z-20 ${positionClasses} w-auto min-w-max bg-white text-gray-800 shadow-lg rounded-md overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto max-h-60"
            : "opacity-0 pointer-events-none max-h-0"
        }`}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            className="hover:bg-gray-200 py-3 px-6 whitespace-nowrap cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
