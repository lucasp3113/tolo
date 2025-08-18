import React from "react";
import carruseluno from "../assets/carrusel1.png";
import auris from "../assets/auris.jpg";
import pelota from "../assets/pelota.png";

export default function Carrusel() {
  return (
    <div className="w-80 max-w-12 mx-auto text-center">
      {/* <div className="relative"> */}
      <ul
        className="flex flex-col gap-y-2 h-115 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <li onClick={() => alert("Opción 1")}>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={carruseluno}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={auris}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
        <li>
          <img
            className="cursor-pointer w-[3rem] h-[3rem]"
            src={pelota}
            alt=""
          />
        </li>
      </ul>
      {/* <img
          src={carruseluno}
          alt="slide"
          className="w-full rounded-lg"
        />
        <button
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
          aria-label="Previous Slide"
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
          aria-label="Next Slide"
        >
          ›
        </button>
      </div> */}
    </div>
  );
}
