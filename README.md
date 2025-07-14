=======
# TOLO - Frontend

# 🚀 Tecnologías usadas
- [React](https://reactjs.org/) - Librería para construir interfaces de usuario.
- [Tailwind CSS](https://tailwindcss.com/docs) - Framework de CSS

## 📁 Estructura del proyecto

```txt
frontend/
├── public/              # Acá van imágenes que no se cambian (como íconos)
├── src/                 # Acá está todo el código principal
│   ├── assets/          # Imágenes que usamos dentro del código
│   ├── components/      # Acá se hacen los componentes
│   ├── App.jsx          # Es como el cuerpo principal de la página
│   ├── App.css          # Estilos solo para App.jsx
│   ├── index.css        # Estilos generales (y la config de Tailwind)
│   └── main.jsx         # Arranca la aplicación y muestra App.jsx en pantalla
├── index.html           # El archivo base donde se carga todo
├── package.json         # Lista de las cosas que usamos y comandos útiles
├── vite.config.js       # Configuración especial de Vite (el que inicia todo)
```


Se q da miedo ver todo eso, pero por ahora solo usen la carpeta src. Dentro esta la carpeta components. Estos (los componentes) se usan en el componente principal, App.jsx. Todo lo otro, no le den importancia por ahora

# ✅ ¿Cómo correr la aplicación?
`npm run dev`

## ⚠️ IMPORTANTE
**NO VAMOS A USAR CSS NORMAL, SOLO VAMOS A USAR TAILWIND CSS**

