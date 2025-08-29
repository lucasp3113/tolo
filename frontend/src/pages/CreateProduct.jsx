import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Button from '../components/Button'
import logoToloBlue from '../assets/logoToloBlue.png'
import { FaBoxOpen } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import Dropdown from '../components/Dropdown';
import axios from 'axios'

export default function CreateProduct({ edit = false, onCancel, id }) {
  const [isMobile, setIsMobile] = useState(false);
  const [characteristics, setCharacteristics] = useState([{ nombre: '', valor: '' }]);
  const [colors, setColors] = useState([{ nombre: '', imagenes: [] }]);
  
  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = payload.user
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Funciones para manejar características
  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { nombre: '', valor: '' }]);
  };

  const removeCharacteristic = (index) => {
    if (characteristics.length > 1) {
      setCharacteristics(characteristics.filter((_, i) => i !== index));
    }
  };

  const updateCharacteristic = (index, field, value) => {
    const updated = [...characteristics];
    updated[index][field] = value;
    setCharacteristics(updated);
  };

  // Funciones para manejar colores
  const addColor = () => {
    setColors([...colors, { nombre: '', imagenes: [] }]);
  };

  const removeColor = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColorName = (index, value) => {
    const updated = [...colors];
    updated[index].nombre = value;
    setColors(updated);
  };

  const updateColorImages = (index, files) => {
    const updated = [...colors];
    updated[index].imagenes = Array.from(files);
    setColors(updated);
  };

  function addProduct(data) {
    const filteredArray = [];
    const categoryList = [];
    const valuesData = Object.entries(data);
    
    valuesData.forEach((v) => {
      if (v[1]) {
        if (v[1] === true) {
          categoryList.push(v);
        } else {
          filteredArray.push(v);
        }
      }
    });

    const cleanData = Object.fromEntries(filteredArray);
    const formData = new FormData();
    
    for (const key in cleanData) {
      formData.append(key, cleanData[key]);
    }
    
    formData.append("username", user);
    formData.append("categories", JSON.stringify(categoryList));
    
    // Agregar características
    const validCharacteristics = characteristics.filter(char => 
      char.nombre.trim() !== '' && char.valor.trim() !== ''
    );
    formData.append("characteristics", JSON.stringify(validCharacteristics));
    
    // Agregar colores y sus imágenes
    const validColors = colors.filter(color => color.nombre.trim() !== '');
    formData.append("colors", JSON.stringify(validColors.map(color => ({
      nombre: color.nombre,
      imageCount: color.imagenes.length
    }))));
    
    // Agregar imágenes por color
    validColors.forEach((color, colorIndex) => {
      if (color.imagenes && color.imagenes.length > 0) {
        Array.from(color.imagenes).forEach((file, fileIndex) => {
          formData.append(`color_${colorIndex}_images[]`, file);
        });
      }
    });

    // Imágenes generales del producto (si las hay)
    if (watchedFiles && watchedFiles.length > 0) {
      Array.from(watchedFiles).forEach((file) => {
        formData.append('general_images[]', file);
      });
      formData.append("generalImageCount", watchedFiles.length);
    }

    axios.post("/api/create_product.php", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      console.log(res);
      if (res.data.success) {
        alert('Producto creado exitosamente');
        // Resetear el formulario o redirigir
      }
    })
    .catch(err => {
      console.log(err);
      alert('Error al crear el producto');
    });
  }

  function updateProduct(data, productId) {
    // Similar lógica para actualización
    const filteredArray = [];
    const categoryList = [];
    const valuesData = Object.entries(data);
    
    valuesData.forEach((v) => {
      if (v[1]) {
        if (v[1] === true) {
          categoryList.push(v);
        } else {
          filteredArray.push(v);
        }
      }
    });

    const cleanData = Object.fromEntries(filteredArray);
    const formData = new FormData();
    
    for (const key in cleanData) {
      formData.append(key, cleanData[key]);
    }
    
    formData.append("username", user);
    formData.append("categories", JSON.stringify(categoryList));
    formData.append("id_publicacion", productId);
    
    // Agregar características
    const validCharacteristics = characteristics.filter(char => 
      char.nombre.trim() !== '' && char.valor.trim() !== ''
    );
    formData.append("characteristics", JSON.stringify(validCharacteristics));
    
    // Agregar colores
    const validColors = colors.filter(color => color.nombre.trim() !== '');
    formData.append("colors", JSON.stringify(validColors.map(color => ({
      nombre: color.nombre,
      imageCount: color.imagenes.length
    }))));
    
    // Agregar imágenes por color
    validColors.forEach((color, colorIndex) => {
      if (color.imagenes && color.imagenes.length > 0) {
        Array.from(color.imagenes).forEach((file, fileIndex) => {
          formData.append(`color_${colorIndex}_images[]`, file);
        });
      }
    });

    if (watchedFiles && watchedFiles.length > 0) {
      Array.from(watchedFiles).forEach((file) => {
        formData.append('general_images[]', file);
      });
      formData.append("generalImageCount", watchedFiles.length);
    }

    axios.post("/api/update_product.php", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      console.log(res);
      if (res.data.success) {
        alert('Producto actualizado exitosamente');
      }
    })
    .catch(err => {
      console.log(err);
      alert('Error al actualizar el producto');
    });
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  
  // Observar cambios en el input de archivos usando watch
  const watchedFiles = watch("images");
  
  // Convertir FileList a Array para el preview
  const selectedFiles = watchedFiles ? Array.from(watchedFiles) : [];

  // [Aquí van todos tus componentes de dropdown existentes - VestimentaDropdown, TecnologiaDropdown, etc.]
  // Los omito por brevedad, pero mantenlos igual que los tienes

  const VestimentaDropdown = () => (
    <Dropdown text="Vestimenta" cndiv="px-3" direction='b'
      options={[{
        type: "custom", content: (
          <fieldset className='flex flex-col items-start justify-center'>
            <Input type="checkbox" name="Calzado" label="Calzado" register={register} errors={errors} className='!flex-row' />
            <Input type="checkbox" name="Ropa hombre" label="Ropa hombre" register={register} errors={errors} className='!flex-row' />
            <Input type="checkbox" name="Ropa mujer" label="Ropa mujer" register={register} errors={errors} className='!flex-row' />
            <Input type="checkbox" name="Rop unisex" label="Rop unisex" register={register} errors={errors} className='!flex-row' />
            <Input type="checkbox" name="Ropa niño" label="Ropa niño" register={register} errors={errors} className='!flex-row' />
            <Input type="checkbox" name="Ropa niña" label="Ropa niña" register={register} errors={errors} className='!flex-row' />
          </fieldset>
        )
      }]}
    />
  );

  // ... [Resto de los dropdowns] ...

  const renderCharacteristicsSection = () => (
    <div className="m-3">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Características del producto
        </label>
        <Button
          type="button"
          onClick={addCharacteristic}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
        >
          <FaPlus size={12} />
          Agregar
        </Button>
      </div>
      
      {characteristics.map((char, index) => (
        <div key={index} className="flex gap-2 mb-2 items-end">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nombre (ej: Marca)"
              value={char.nombre}
              onChange={(e) => updateCharacteristic(index, 'nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Valor (ej: Yamaha)"
              value={char.valor}
              onChange={(e) => updateCharacteristic(index, 'valor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <Button
            type="button"
            onClick={() => removeCharacteristic(index)}
            disabled={characteristics.length === 1}
            className={`px-3 py-2 rounded-md text-sm ${
              characteristics.length === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <FaMinus size={12} />
          </Button>
        </div>
      ))}
    </div>
  );

  const renderColorsSection = () => (
    <div className="m-3">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Colores disponibles
        </label>
        <Button
          type="button"
          onClick={addColor}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
        >
          <FaPlus size={12} />
          Agregar Color
        </Button>
      </div>
      
      {colors.map((color, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3">
          <div className="flex gap-2 mb-2 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nombre del color (ej: Blanco)"
                value={color.nombre}
                onChange={(e) => updateColorName(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <Button
              type="button"
              onClick={() => removeColor(index)}
              disabled={colors.length === 1}
              className={`px-3 py-2 rounded-md text-sm ${
                colors.length === 1 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <FaMinus size={12} />
            </Button>
          </div>
          
          <div className="mt-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => updateColorImages(index, e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {color.imagenes && color.imagenes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {color.imagenes.length} imagen(es) seleccionada(s) para {color.nombre || 'este color'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render móvil y desktop (mantén tus funciones existentes)
  const renderMobileCategories = () => (
    <fieldset className='flex flex-col items-start justify-center w-100'>
      <section className='grid grid-cols-2 gap- w-full'>
        <VestimentaDropdown />
        {/* Agrega el resto de tus dropdowns */}
      </section>
      {/* ... resto de tu código móvil ... */}
    </fieldset>
  );

  const renderDesktopCategories = () => (
    <fieldset className='flex flex-col items-start justify-center w-full max-w-full'>
      <section className='grid grid-cols-3 gap-6 w-full'>
        <VestimentaDropdown />
        {/* Agrega el resto de tus dropdowns */}
      </section>
      {/* ... resto de tu código desktop ... */}
    </fieldset>
  );

  return (
    <form onSubmit={handleSubmit(!edit ? addProduct : (data) => updateProduct(data, id))} className='w-85 mb-100 m-auto mt-5 bg-white p-3 shadow rounded-xl'>
      <img src={logoToloBlue} className='w-16 h-10 object-contain' alt="Logo" />
      <div className="flex flex-col mt-3 ml-3 items-start ">
        <h2 className='font-[Montserrat,sans-serif] text-2xl font-semibold'>{edit ? "Editar publicación" : "Crear publicación"}</h2>
        <p className="text-sm whitespace-nowrap text-gray-600">{edit ? "Completá el formulario para editar la publicación." : "Completá el formulario para crear una publicación."}</p>
      </div>

      <Input name={"nameProduct"} label={"Nombre del producto"} placeholder={"Nombre del producto"} register={register} errors={errors} required={true} minLength={3} maxLength={25} icon={<FaBoxOpen />} />
      
      <Input type={"number"} name={"productPrice"} label={"Precio del producto"} placeholder={"Precio del producto"} register={register} errors={errors} required={true} icon={<FaDollarSign />} maxLength={20} validate={value => Number(value) > 0 || "El precio no puede ser negativo ni 0"} />
      
      <Input type={"number"} name={"productStock"} label={"Stock del producto"} placeholder={"Stock del producto"} register={register} errors={errors} required={true} icon={<FaBoxes />} validate={value => Number(value) >= 0 || "El stock no puede ser negativo"} />

      {/* Nueva sección de características */}
      {renderCharacteristicsSection()}

      {/* Nueva sección de colores */}
      {renderColorsSection()}

      <Dropdown text="Categorias" cndiv="m-3 flex flex-col items-center justify-center Ñ" className="w-full m-auto px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center text-gray-800" options={[
        { type: "custom", content: isMobile ? renderMobileCategories() : renderDesktopCategories() }
      ]} />

      <Input type="file" name="images" label="Imágenes generales del producto (opcional)" register={register} errors={errors} multiple={true} />

      {selectedFiles.length > 0 && (
        <div className="m-3">
          <p className="text-sm text-gray-600 mb-2">
            {selectedFiles.length} imagen(es) general(es) seleccionada(s):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => {
              const imageUrl = URL.createObjectURL(file);
              return (
                <div key={index} className="relative">
                  <img src={imageUrl} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" onLoad={() => URL.revokeObjectURL(imageUrl)} />
                  <div className="mt-1">
                    <span className="text-xs text-gray-500 block truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Input type={"textarea"} name={"productDescription"} label={"Descripción del producto"} placeholder={"Descripción del producto"} register={register} errors={errors} maxLength={2000} />

      {edit ? (
        <section className='flex items-center justify-center'>
          <Button className={"w-50"} color={"green"} size={"md"} text={"Editar producto"} />
          <Button className={"w-50"} color={"blue"} size={"md"} type='button' text={"Cancelar"} onClick={() => onCancel()} />
        </section>
      ) : (
        <Button className={"w-50"} color={"blue"} size={"md"} text={"Añadir producto"} />
      )}
    </form>
  )
}