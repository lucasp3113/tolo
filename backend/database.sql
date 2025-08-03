-- Active: 1753920206856@@localhost@3306@tolo
CREATE DATABASE tolo;


USE tolo;

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    tipo_usuario ENUM(
        'cliente',
        'vendedor_particular',
        'ecommerce'
    ) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

DELETE FROM usuarios;

SELECT nombre_usuario, contraseña FROM usuarios WHERE nombre_usuario = "Lucas";

ALTER TABLE usuarios AUTO_INCREMENT = 1;

SELECT * FROM usuarios;
SELECT * FROM ecommerces;

CREATE TABLE rangos (
    id_rango INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_rango ENUM(
        'junior',
        'amateur',
        'semi_senior',
        'senior',
        'elite'
    ) NOT NULL DEFAULT 'junior',
    facturacion_minima INT NOT NULL DEFAULT 0,
    porcentaje_comision DECIMAL(4, 2) NOT NULL
);

INSERT INTO
    rangos (
        nombre_rango,
        facturacion_minima,
        porcentaje_comision
    )
VALUES 
    ('junior', 0, 10),
    ('amateur', 7000, 8),
    ('semi_senior', 25000, 6),
    ('senior', 75000, 4),
    ('elite', 350000, 2)

SELECT * FROM rangos;

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
    id_categoria INT UNSIGNED NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_vendedor) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces (id_ecommerce) ON DELETE SET NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE RESTRICT
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
    estado ENUM(
        'pendiente',
        'pagada',
        'enviado',
        'entregado',
        'cancelada'
    ) NOT NULL DEFAULT 'pendiente',
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

CREATE TABLE metodos_pagos (
    id_metodo_pago INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_metodo VARCHAR(50) NOT NULL
);

CREATE TABLE pagos (
    id_pago INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    id_metodo_pago INT UNSIGNED NOT NULL,
    estado_pago ENUM(
        'pendiente',
        'completado',
        'fallido',
        'cancelado'
    ) NOT NULL DEFAULT 'pendiente',
    referencia_transaccion VARCHAR(255),
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pagos (id_metodo_pago) ON DELETE RESTRICT
);

CREATE TABLE envios (
    id_envio INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    metodo_envio VARCHAR(255),
    direccion_entrega TEXT NOT NULL,
    estado_envio ENUM(
        'pendiente',
        'enviado',
        'entregado',
        'devuelto'
    ) NOT NULL DEFAULT 'pendiente',
    tracking VARCHAR(255),
    fecha_estimada_entrega DATE,
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE
);

CREATE TABLE notificaciones (
    id_notificacion INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    tipo ENUM('email', 'interna') NOT NULL DEFAULT 'interna',
    mensaje TEXT,
    estado ENUM('enviado', 'leído', 'error') NOT NULL DEFAULT 'enviado',
    fecha_envio DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);