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
│   ├── pages/           # Cada archivo es una vista o página de la app
│   ├── App.jsx          # Es como el cuerpo principal de la página
│   ├── App.css          # Estilos solo para App.jsx (NO USAR - usamos Tailwind)
│   ├── index.css        # Estilos generales y configuración de Tailwind
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

## 🧑‍💻 Cómo subir cambioos

Para que todos podamos trabajar tranquilos y sin pisarnos, seguimos este flujo:

1. **Por cada componente q hagan, crear una rama nueva** con un nombre **muy claro**

```bash
git checkout -b nombre-de-tu-rama
```
2. **Para guardar un cambio:**

```bash
git add .
git commit -m "Descripción clara de lo que hiciste"
```

3. **Y por último, para subirlo:**

```bash
git push -u origin nombre-de-tu-rama
```

> ⚠️ **IMPORTANTE:**  
> NO HAGAS COMMITS DIRECTAMENTE EN MAIN para evitar conflictos y mantener el código ordenado.

### React Router

React Router es una tecnología que permite manejar diferentes **rutas** o **páginas** dentro de una aplicación React **sin recargar la página completa**, de esta manera, el sitio web es muy dinamico. Su nombre viene de que "Router" significa **enrutador**, y su función es decidir qué página mostrar según la dirección (URL) que el usuario visita.

En la carpeta `pages/` se guardan los componentes que representan cada página o vista distinta de la aplicación, como Home, Login o Register. Cada archivo en `pages/` es una ruta que se puede mostrar gracias a React Router.
