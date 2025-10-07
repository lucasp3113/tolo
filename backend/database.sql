-- Active: 1756346382742@@127.0.0.1@3306@tolo
-- ============================================================
-- CREACIÓN DE BASE DE DATOS
-- ============================================================

CREATE DATABASE IF NOT EXISTS tolo;
USE tolo;

-- ============================================================
-- CREACIÓN DE TABLAS (ordenadas por dependencias)
-- ============================================================

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente','vendedor_particular','ecommerce','admin') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE rangos (
    id_rango INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_rango ENUM('junior','amateur','semi_senior','senior','elite') NOT NULL DEFAULT 'junior',
    facturacion_minima INT NOT NULL DEFAULT 0,
    porcentaje_comision DECIMAL(4, 2) NOT NULL
);

CREATE TABLE ecommerces (
    id_ecommerce INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED UNIQUE,
    nombre_ecommerce VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT DEFAULT NULL,
    rango_actual INT UNSIGNED DEFAULT 1,
    facturacion_acumulada INT DEFAULT 0,
    logo VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (rango_actual) REFERENCES rangos (id_rango)
);

CREATE TABLE categorias (
    id_categoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(30) NOT NULL,
    descripcion TEXT DEFAULT NULL
);

CREATE TABLE productos (
    id_producto INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_vendedor INT UNSIGNED NOT NULL,
    id_ecommerce INT UNSIGNED,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT NULL,
    envio_gratis BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_vendedor) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces (id_ecommerce) ON DELETE SET NULL
);

CREATE TABLE productos_categorias (
    id_producto INT UNSIGNED NOT NULL,
    id_categoria INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE CASCADE
);

CREATE TABLE imagenes_productos (
    id_imagen INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE
);

CREATE TABLE compras (
    id_compra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado ENUM('pendiente','pagada','enviado','entregado','cancelada') NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

CREATE TABLE detalles_compras (
    id_detalle INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE RESTRICT
);

CREATE TABLE comentarios_productos (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comentario TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (id_usuario, id_producto)
);

CREATE TABLE metodos_pagos (
    id_metodo_pago INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_metodo VARCHAR(50) NOT NULL
);

CREATE TABLE pagos (
    id_pago INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    id_metodo_pago INT UNSIGNED NOT NULL,
    estado_pago ENUM('pendiente','completado','fallido','cancelado') NOT NULL DEFAULT 'pendiente',
    referencia_transaccion VARCHAR(255),
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pagos (id_metodo_pago) ON DELETE RESTRICT
);

CREATE TABLE envios (
    id_envio INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    metodo_envio VARCHAR(255),
    direccion_entrega TEXT NOT NULL,
    estado_envio ENUM('pendiente','enviado','entregado','devuelto') NOT NULL DEFAULT 'pendiente',
    tracking VARCHAR(255),
    fecha_estimada_entrega DATE,
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE
);

CREATE TABLE notificaciones (
    id_notificacion INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    tipo ENUM('email', 'interna') NOT NULL DEFAULT 'interna',
    mensaje TEXT,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

CREATE TABLE colores_producto (
    id_color INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    stock SMALLINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE
);

CREATE TABLE imagenes_color_producto (
    id_imagen_color_producto INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_color INT UNSIGNED NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_color) REFERENCES colores_producto (id_color) ON DELETE CASCADE
);

CREATE TABLE talles_color_producto (
    id_talle_color_producto INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_color INT UNSIGNED NOT NULL,
    talle VARCHAR(100) NOT NULL,
    stock SMALLINT NOT NULL,
    FOREIGN KEY (id_color) REFERENCES colores_producto (id_color) ON DELETE CASCADE
);

CREATE TABLE caracteristicas_producto (
    id_caracteristica INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    caracteristica VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE
);

CREATE TABLE custom_shops (
    id_custom_shop INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_ecommerce INT UNSIGNED NOT NULL UNIQUE,
    header_color VARCHAR(100) NOT NULL,
    main_color VARCHAR(100) NOT NULL,
    footer_color VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces (id_ecommerce) ON DELETE CASCADE
);

-- ============================================================
-- INSERTS (ordenados por dependencia)
-- ============================================================

INSERT INTO rangos (nombre_rango, facturacion_minima, porcentaje_comision)
VALUES 
('junior', 0, 10),
('amateur', 7000, 8),
('semi_senior', 25000, 6),
('senior', 75000, 4),
('elite', 350000, 2);

INSERT INTO usuarios (id_usuario, nombre_usuario, email, contraseña, tipo_usuario, fecha_registro, estado)
VALUES
(1, 'Ferreteria', 'ferreteria@gmail.com', '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG', 'ecommerce', '2025-09-24 01:02:59', 1),
(2, 'admin', 'luuucaspereyra31@gmail.com', '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG', 'admin', '2025-09-24 01:05:13', 1),
(3, 'BohemianDesign', 'bohemian@gmail.com', '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG', 'ecommerce', '2025-09-24 01:11:54', 1),
(4, 'Cliente', 'cliente@gmail.com', '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG', 'cliente', '2025-09-24 01:35:30', 1);

-- Categorías (todas las que tenías)
-- ⚠️ [Se puede mantener tal cual, omitido aquí por longitud]

-- Ecommerces, productos, colores, talles, imágenes y características
-- (copiá tus bloques INSERT tal cual; ya están en orden correcto en tu script)

-- ============================================================
-- CONSULTAS DE PRUEBA
-- ============================================================

-- Ver usuarios
SELECT * FROM usuarios;

-- Ver custom_shops de un ecommerce
SELECT c.header_color, c.main_color, c.footer_color
FROM custom_shops c
JOIN ecommerces e ON e.id_usuario = 1
WHERE c.id_ecommerce = e.id_ecommerce;

-- Ver todas las tiendas personalizadas
SELECT * FROM custom_shops;

SELECT * FROM productos;
