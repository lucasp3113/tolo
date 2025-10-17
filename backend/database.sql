-- Active: 1756304004613@@127.0.0.1@3306@tolo
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

--Datos de prueba(se utiliza contraseña en texto plano por simplicidad, solo desarrolo: 12345678P_)
INSERT INTO
    usuarios (
        id_usuario,
        nombre_usuario,
        email,
        contraseña,
        tipo_usuario,
        fecha_registro,
        estado
    )
VALUES (
        1,
        'Ferreteria',
        'ferreteria@gmail.com',
        '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG',
        'ecommerce',
        '2025-09-24 01:02:59',
        1
    ),
    (
        2,
        'admin',
        'luuucaspereyra31@gmail.com',
        '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG',
        'admin',
        '2025-09-24 01:05:13',
        1
    ),
    (
        3,
        'BohemianDesign',
        'bohemian@gmail.com',
        '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG',
        'ecommerce',
        '2025-09-24 01:11:54',
        1
    ),
    (
        4,
        'Cliente',
        'cliente@gmail.com',
        '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG',
        'cliente',
        '2025-09-24 01:35:30',
        1
    );

INSERT INTO
    ecommerces (
        id_ecommerce,
        id_usuario,
        nombre_ecommerce,
        descripcion,
        rango_actual,
        facturacion_acumulada
    )
VALUES (1, 1, 'LaFerre', NULL, 1, 0),
    (
        2,
        3,
        'Bohemian Design',
        NULL,
        1,
        0
    );

INSERT INTO
    productos (
        id_producto,
        id_vendedor,
        id_ecommerce,
        nombre_producto,
        descripcion,
        precio,
        stock,
        envio_gratis,
        fecha_publicacion,
        estado
    )
VALUES (
        1,
        1,
        1,
        'Taladro Trupper',
        NULL,
        1000.00,
        1000,
        1,
        '2025-09-24 01:03:32',
        1
    ),
    (
        2,
        1,
        1,
        'Taladro DrWalt',
        'Taladro eléctrico de alto rendimiento, ideal para perforar madera, metal y materiales de construcción. Su diseño ergonómico y ligero permite un uso cómodo y preciso, mientras que su motor potente garantiza eficiencia y durabilidad. Incluye múltiples brocas, ajuste de velocidad y función reversible, perfecto para proyectos domésticos o profesionales.',
        500.00,
        100,
        1,
        '2025-09-24 01:06:32',
        1
    ),
    (
        3,
        1,
        1,
        'Taladro Tolsen',
        'Taladro eléctrico de alto rendimiento, ideal para perforar madera, metal y materiales de construcción. Su diseño ergonómico y ligero permite un uso cómodo y preciso, mientras que su motor potente garantiza eficiencia y durabilidad. Incluye múltiples brocas, ajuste de velocidad y función reversible, perfecto para proyectos domésticos o profesionales.',
        4000.00,
        20,
        0,
        '2025-09-24 01:08:48',
        1
    ),
    (
        4,
        1,
        1,
        'Taladro Total',
        'Taladro eléctrico de alto rendimiento, ideal para perforar madera, metal y materiales de construcción. Su diseño ergonómico y ligero permite un uso cómodo y preciso, mientras que su motor potente garantiza eficiencia y durabilidad. Incluye múltiples brocas, ajuste de velocidad y función reversible, perfecto para proyectos domésticos o profesionales.',
        2300.00,
        1000,
        0,
        '2025-09-24 01:10:41',
        1
    ),
    (
        5,
        3,
        2,
        'Pantalon Black Gastado',
        'Pantalón oversize de corte amplio y cómodo, diseñado para un estilo urbano y moderno. Confeccionado en tela resistente y suave al tacto, ofrece libertad de movimiento y versatilidad para combinar con diferentes outfits. Ideal para uso diario, actividades casuales o streetwear, aportando comodidad y tendencia a tu look',
        3250.00,
        NULL,
        1,
        '2025-09-24 01:12:54',
        1
    ),
    (
        9,
        3,
        2,
        'Pantalon BAGGY Jean Claro',
        'Pantalón oversize de corte amplio y cómodo, diseñado para un estilo urbano y moderno. Confeccionado en tela resistente y suave al tacto, ofrece libertad de movimiento y versatilidad para combinar con diferentes outfits. Ideal para uso diario, actividades casuales o streetwear, aportando comodidad y tendencia a tu lookPantalón oversize de corte amplio y cómodo, diseñado para un estilo urbano y moderno. Confeccionado en tela resistente y suave al tacto, ofrece libertad de movimiento y versatilidad para combinar con diferentes outfits. Ideal para uso diario, actividades casuales o streetwear, aportando comodidad y tendencia a tu look',
        4000.00,
        NULL,
        0,
        '2025-09-24 01:30:00',
        1
    ),
    (
        10,
        3,
        2,
        'Pantalon BAGGY Cargo Arena',
        'Pantalón oversize de corte amplio y cómodo, diseñado para un estilo urbano y moderno. Confeccionado en tela resistente y suave al tacto, ofrece libertad de movimiento y versatilidad para combinar con diferentes outfits. Ideal para uso diario, actividades casuales o streetwear, aportando comodidad y tendencia a tu look',
        3800.00,
        NULL,
        0,
        '2025-09-24 01:32:34',
        1
    );

INSERT INTO
    colores_producto (
        id_color,
        id_producto,
        nombre,
        stock
    )
VALUES (1, 5, 'Negro Gastado', NULL),
    (4, 9, 'Claro', NULL),
    (5, 10, 'Arena', NULL);

INSERT INTO
    talles_color_producto (
        id_talle_color_producto,
        id_color,
        talle,
        stock
    )
VALUES (1, 1, 'M', 100),
    (2, 1, 'L', 100),
    (3, 1, 'XL', 1000),
    (9, 4, 'M', 30),
    (10, 4, 'L', 50),
    (11, 4, 'XL', 35),
    (12, 5, 'M', 30),
    (13, 5, 'L', 58),
    (14, 5, 'XL', 10);

INSERT INTO
    imagenes_productos (
        id_imagen,
        id_producto,
        ruta_imagen
    )
VALUES (
        1,
        1,
        'uploads/products/68d36d9414373_1758686612.png'
    ),
    (
        2,
        2,
        'uploads/products/68d36e488a33a_1758686792.jpg'
    ),
    (
        3,
        3,
        'uploads/products/68d36ed02448a_1758686928.jpg'
    ),
    (
        4,
        4,
        'uploads/products/68d36f41e215c_1758687041.jpg'
    );

INSERT INTO
    imagenes_color_producto (
        id_imagen_color_producto,
        id_color,
        ruta_imagen
    )
VALUES (
        1,
        1,
        'color_1_68d36fe9b7f1a.png'
    ),
    (
        2,
        1,
        'color_1_68d36fe9b9138.png'
    ),
    (
        3,
        1,
        'color_1_68d36fe9b9e38.png'
    ),
    (
        4,
        1,
        'color_1_68d36fe9bad4a.png'
    ),
    (
        12,
        4,
        'color_4_68d373e800294.png'
    ),
    (
        13,
        4,
        'color_4_68d373e801101.png'
    ),
    (
        14,
        4,
        'color_4_68d373e801e62.png'
    ),
    (
        15,
        5,
        'color_5_68d374b1428c1.png'
    ),
    (
        16,
        5,
        'color_5_68d374b144366.png'
    ),
    (
        17,
        5,
        'color_5_68d374b1484cf.png'
    );

INSERT INTO
    productos_categorias (id_producto, id_categoria)
VALUES (1, 14),
    (2, 14),
    (3, 14),
    (4, 14),
    (5, 2),
    (9, 2),
    (10, 2);

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (1, 'Potencia de 750W'),
    (1, 'Velocidad variable'),
    (1, 'Mandril de 13mm'),
    (
        1,
        'Apto para trabajos de bricolaje'
    );

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (
        2,
        'Motor de alto rendimiento'
    ),
    (
        2,
        'Diseño ergonómico y ligero'
    ),
    (2, 'Función reversible'),
    (2, 'Incluye kit de brocas');

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (
        3,
        'Potencia profesional de 1200W'
    ),
    (3, 'Construcción robusta'),
    (
        3,
        'Control de velocidad avanzado'
    ),
    (3, 'Ideal para uso continuo');

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (4, 'Compacto y ligero'),
    (4, 'Mango antideslizante'),
    (
        4,
        'Mandril metálico reforzado'
    ),
    (
        4,
        'Uso profesional y doméstico'
    );

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (5, 'Corte oversize'),
    (
        5,
        'Tela resistente de algodón'
    ),
    (5, 'Color negro desgastado'),
    (5, 'Estilo urbano casual');

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (9, 'Corte amplio tipo baggy'),
    (9, 'Tela de jean azul claro'),
    (9, 'Alta comodidad'),
    (9, 'Perfecto para streetwear');

INSERT INTO
    caracteristicas_producto (id_producto, caracteristica)
VALUES (10, 'Diseño oversize cargo'),
    (10, 'Color arena neutro'),
    (
        10,
        'Bolsillos laterales amplios'
    ),
    (
        10,
        'Resistente para uso diario'
    );

SELECT * FROM ecommerces;

SELECT * FROM usuarios;

SELECT ()