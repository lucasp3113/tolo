 import React from "react";

export default function Button ({
  onClick,
  color, 
  size, 
  text
  }) {

  const colors = {
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-amber-600",
    blue: "bg-sky-800",
    purple: "bg-purple-800",
    sky: "bg-sky-500",
    black: "bg-gray-900"
  };

   const sizes = {
     sm: "px-3 py-1 text-sm",
     md:"px-4 py-2 text-base",
     lg: "px-5 py-3 text-lg"
   };

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color] || "bg-gray-900"}
        ${sizes[size] || "sm"}
        text-lg
        text-white
        rounded-lg
        p-3
        flex-initial
        hover:scale-110
        transition
        duration-300
        cursor-pointer
        transform
        m-2
        shadow-2xl
      `}>
      {text}
    </button>
  );
}
