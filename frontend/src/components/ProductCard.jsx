import React, { useState, useEffect } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { FaPen } from "react-icons/fa";
import axios from "axios";
import Rating from './Rating';

export default function ProductCard({ name, price, image, stock, freeShipping, phone = false, client = true, onDelete, onUpdate, onClick, cart = false, amount = null, idItem = null, admin = false, rating = null }) {
  const [useOverlayLayout, setUseOverlayLayout] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  let stockMessage = "";
  let stockColor = "";
  if (stock === 0) {
    stockMessage = "Sin stock";
    stockColor = "text-red-500";
  } else if (stock <= 10) {
    stockMessage = "¡Quedan pocos!";
    stockColor = "text-orange-500";
  } else if (stock <= 100) {
    stockMessage = "Disponible";
    stockColor = "text-green-500";
  } else {
    stockMessage = "+ de 100 disponibles";
    stockColor = "text-green-600";
  }

  function deleteCart() {
    axios.post("/api/delete_to_cart.php", {
      id_item: idItem
    })
      .then(res => {
        if (onDelete) onDelete(idItem);
      })
      .catch(err => console.log(err))
  }


  useEffect(() => {
    if (phone && image) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setUseOverlayLayout(aspectRatio > 1.3);
        setImageLoaded(true);
      };
      img.src = image;
    }
  }, [image, phone]);

  // celu cuando la imagen es grande
  if (phone && useOverlayLayout && imageLoaded) {
    return (
      <div onClick={onClick} className={`z-50 cursor-pointer relative p-2 mb-0.5 bg-white shadow overflow-hidden flex items-center justify-center w-full m-0 ${cart ? "h-34" : ""}`}>
        <div className="w-44 aspect-square flex-shrink-0 bg-gray-100">
          <img
            loading="lazy"
            src={image}
            alt={name}
            className={`${cart ? "w-36" : "w-44"} h-full sm:h-full md:h-full object-cover`}
          />
        </div>

        <div className="p-6 flex flex-col w-full justify-center space-y-3">
          {amount && (
            <p className={`text-xl font-light text-gray-900`}>
              Cantidad: {amount}
            </p>
          )}
          {cart && (
            <div onClick={() => deleteCart()} className="flex w-full justify-end -mb-2">
              <ImBin className="text-gray-600 hover:text-red-600 text-xl -translate-y-2 translate-x-4 cursor-pointer transition-colors duration-200" />
            </div>
          )}

          <h2 className={`${cart ? "text-4xl text-amber-600" : "text-lg"} font-medium text-gray-900 line-clamp-2 leading-tight`}>{name}</h2>
          <p className="text-2xl font-semibold text-gray-900">
            ${price.toLocaleString()}
          </p>

          <div className="flex flex-col space-y-1">
            {freeShipping && (
              <span className="text-green-600 text-sm font-medium">Envío gratis</span>
            )}
            <span className={`text-sm font-medium ${stockColor}`}>{stockMessage}</span>
          </div>
          {admin && (
            <ImBin onClick={() => onDelete()} className="text-3xl text-red-600" />
          )}
          {!client && (
            <div className="flex gap-2 pt-4 absolute bottom-0">
              <Button color={"blue"} size={"md"} className={" !bg-transparent !m-0 !mt-1 !shadow-none !rounded-lg"} text={<FaPen className="text-3xl text-sky-800" />} onClick={onUpdate} />
              <Button color={"red"} size={"md"} className={" !bg-transparent !m-0 !shadow-none !rounded-lg"} text={<ImBin className="text-3xl !mt-1 text-red-600" />} onClick={onDelete} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // celu cuando la imagen es chica
  if (phone) {
    return (
      <div onClick={onClick} className={`cursor-pointer relative p-2 mb-0.5 bg-white shadow overflow-hidden flex items-center justify-center w-full m-0 ${cart ? "h-34" : ""}`}>
        <section className="flex flex-col items-center justify-center">
          {rating > 0 && (
            <Rating
              id="product-average"
              value={rating}
              readonly={true}
              showValue={true}
              size="sm"
              text="text-sm!"
            />
          )}
          <img
            loading="lazy"
            src={image}
            alt={name}
            className={`${cart ? "w-36" : "w-44"} h-full sm:h-full md:h-full object-cover`}
          />
        </section>
        <div className="p-5 flex flex-col w-full justify-center space-y-2">
          {cart && (
            <div className="flex w-full justify-end -mb-2">
              <ImBin onClick={() => deleteCart()} className="text-gray-600 hover:text-red-600 text-xl -translate-y-5 translate-x-4 cursor-pointer transition-colors duration-200" />
            </div>
          )}

          <section className={`${cart ? "justify-start" : "justify-center"} w-full flex items-center `}>
            <h2 className={`${cart ? "-translate-y-8 font-semibold" : "text-xl font-medium"}  text-gray-900 line-clamp-2 leading-tight font-semibold font-quicksand`}>{name}</h2>
          </section>

          <section className={`flex ${cart ? "translate-y-6 justify-between" : "justify-center"}`}>
            <p className={`${cart ? "font-normal " : "font-semibold"} text-xl text-gray-900`}>
              ${price.toLocaleString()}
            </p>
            {amount && (
              <p className={`text-xl font-light text-gray-900`}>
                Cantidad: {amount}
              </p>
            )}
          </section>
          {admin && (
            <ImBin onClick={() => onDelete()} className="text-3xl text-red-600" />
          )}
          {!cart && (
            <div className="flex flex-col space-y-1">
              {freeShipping && (
                <span className="text-green-600 text-sm font-medium">Envío gratis</span>
              )}
              <span className={`text-sm font-medium ${stockColor}`}>{stockMessage}</span>
            </div>
          )}

          {!client && (
            <div className="flex gap-2 pt-4 absolute bottom-0">
              <Button color={"blue"} size={"md"} className={" !bg-transparent !m-0 !mt-1 !shadow-none !rounded-lg"} text={<FaPen className="text-3xl text-sky-800" />} onClick={onUpdate} />
              <Button color={"red"} size={"md"} className={" !bg-transparent !m-0 !shadow-none !rounded-lg"} text={<ImBin className="text-3xl !mt-1 text-red-600" />} onClick={onDelete} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // compu
  return (
    <div onClick={onClick} className={`cursor-pointer relative p-2 bg-white shadow overflow-hidden flex items-center justify-center ${client ? "h-100" : "h-104"} w-56 flex-col m-5 hover:shadow-lg transition-shadow`}>
      {rating > 0 && (
        <Rating
          className="absolute top-3 left-2"
          id="product-average"
          value={rating}
          readonly={true}
          showValue={true}
          size="sm"
          text="text-sm!"
        />
      )}
      <div className={`w-full h-48 ${client ? "mt-9" : "mt-0"}`}>
        <img
          loading="lazy"
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`p-6 flex flex-col w-full items-center justify-center ${cart ? "space-y-2" : "space-y-4"}`}>


        <h2 className="text-lg font-medium text-gray-900 line-clamp-2 text-center leading-tight">{name}</h2>

        <p className="text-2xl font-semibold text-gray-900">
          ${price.toLocaleString()}
        </p>
        {amount && (
          <p className={`text-xl font-light text-gray-900`}>
            Cantidad: {amount}
          </p>
        )}
        {!cart && (
          <div className="flex flex-col items-center space-y-1">
            {freeShipping && (
              <span className="text-green-600 text-sm font-medium">Envío gratis</span>
            )}
            <span className={`text-sm font-medium ${stockColor}`}>{stockMessage}</span>
          </div>
        )}
        {cart && (
          <div className="flex w-full justify-end -mb-2">
            <ImBin onClick={() => deleteCart()} className="text-gray-600 hover:text-red-600 text-2xl translate-y-2 translate-x-4 cursor-pointer transition-colors duration-200" />
          </div>
        )}
        {admin && (
          <ImBin onClick={() => onDelete()} className="text-3xl text-red-600" />
        )}
        {!client && (
          <div className="flex gap-2 pt-4 absolute bottom-0">
            <Button color={"blue"} size={"md"} className={" !bg-transparent !m-0 !mt-1 !shadow-none !rounded-lg"} text={<FaPen className="text-3xl text-sky-800" />} onClick={onUpdate} />
            <Button color={"red"} size={"md"} className={" !bg-transparent !m-0 !shadow-none !rounded-lg"} text={<ImBin className="text-3xl !mt-1 text-red-600" />} onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}