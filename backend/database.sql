-- Active: 1753920206856@@localhost@3306@tolo
CREATE DATABASE tolo;

USE tolo;

SELECT * from usuarios

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

SELECT * FROM usuarios

DELETE FROM categorias;

SELECT nombre_usuario, contraseña
FROM usuarios
WHERE
    nombre_usuario = "Lucas";

ALTER TABLE imagenes_productos AUTO_INCREMENT = 1;

SELECT * FROM usuarios;

DELETE FROM usuarios WHERE nombre_usuario = "lucas";

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

SELECT * FROM rangos

INSERT INTO
    rangos (
        nombre_rango,
        facturacion_minima,
        porcentaje_comision
    )
VALUES ('junior', 0, 10),
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

SELECT logo from ecommerces

CREATE TABLE categorias (
    id_categoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(30) NOT NULL,
    descripcion TEXT DEFAULT NULL
);

SELECT * FROM productos

SELECT p.id_producto, p.id_ecommerce, p.nombre_producto, p.precio, p.stock, c.nombre_categoria, (
        SELECT i.ruta_imagen
        FROM imagenes_productos i
        WHERE
            p.id_producto = i.id_producto
        ORDER BY i.id_imagen ASC
        LIMIT 1
    ) AS ruta_imagen
FROM
    productos p
    JOIN productos_categorias pc ON pc.id_producto = p.id_producto
    JOIN categorias c ON c.id_categoria = pc.id_categoria
WHERE
    nombre_producto = "Taladro";

(
    SELECT i.ruta_imagen
    FROM imagenes_productos i
    WHERE
        p.id_producto = i.id_producto
    ORDER BY i.id_imagen ASC
    LIMIT 1
) AS ruta_imagen

INSERT INTO
    categorias (nombre_categoria, descripcion)
VALUES (
        'Electrónica',
        'Dispositivos y gadgets electrónicos'
    ),
    (
        'Ropa hombre',
        'Prendas de vestir para hombres'
    ),
    (
        'Ropa mujer',
        'Prendas de vestir para mujeres'
    ),
    (
        'Ropa niño',
        'Prendas de vestir para niños'
    ),
    (
        'Ropa niña',
        'Prendas de vestir para niñas'
    ),
    (
        'Rop unisex',
        'Prendas de vestir para cualquier género'
    ),
    (
        'Calzado',
        'Zapatos, zapatillas y sandalias'
    ),
    (
        'Accesorios',
        'Complementos de moda y uso diario'
    ),
    (
        'Libros',
        'Material de lectura y estudio'
    ),
    (
        'Juguetes',
        'Productos para la diversión de niños'
    ),
    (
        'Hogar y Cocina',
        'Artículos para el hogar y utensilios de cocina'
    ),
    (
        'Salud y Belleza',
        'Productos para cuidado personal y estética'
    ),
    (
        'Deportes y Aire libre',
        'Equipamiento deportivo y actividades al aire libre'
    ),
    (
        'Herramientas y Ferretería',
        'Herramientas manuales y eléctricas'
    ),
    (
        'Mascotas',
        'Productos para el cuidado de mascotas'
    ),
    (
        'Bebés y niños',
        'Artículos para bebés y niños pequeños'
    ),
    (
        'Videojuegos',
        'Juegos y consolas para entretenimiento digital'
    ),
    (
        'Computación',
        'Hardware y software para computadoras'
    ),
    (
        'Celulares y accesorios',
        'Teléfonos móviles y complementos'
    ),
    (
        'Oficina y papelería',
        'Suministros para oficina y escritura'
    ),
    (
        'Automotriz',
        'Repuestos y accesorios para vehículos'
    ),
    (
        'Música y Películas',
        'Material audiovisual y equipos de sonido'
    ),
    (
        'Jardín y exteriores',
        'Productos para jardín y espacios exteriores'
    ),
    (
        'Alimentos y Bebidas',
        'Comestibles y bebidas para consumo'
    ),
    (
        'Vehículos',
        'Automóviles, motos y otros vehículos'
    ),
    (
        'Agro e insumos rurales',
        'Productos agrícolas y suministros rurales'
    ),
    (
        'Maquinaria agrícola',
        'Equipos y maquinaria para agricultura'
    ),
    (
        'Animales y ganado',
        'Productos para animales de granja'
    ),
    (
        'Herramientas de campo',
        'Herramientas específicas para campo y agro'
    ),
    (
        'Alimentos agroindustriales',
        'Productos alimenticios industriales'
    ),
    (
        'Productos orgánicos',
        'Productos naturales y ecológicos'
    ),
    (
        'Repuestos y autopartes',
        'Piezas para reparación de vehículos'
    ),
    (
        'Motocicletas',
        'Motos y accesorios'
    ),
    (
        'Náutica',
        'Equipamiento para actividades náuticas'
    ),
    (
        'Ganado bovino',
        'Productos para ganado vacuno'
    ),
    (
        'Ganado ovino',
        'Productos para ganado ovino'
    ),
    (
        'Ganado equino',
        'Productos para ganado equino'
    ),
    (
        'Ganado caprino',
        'Productos para ganado caprino'
    ),
    (
        'Aves de corral',
        'Productos para aves domésticas'
    ),
    (
        'Perros',
        'Productos específicos para perros'
    ),
    (
        'Gatos',
        'Productos específicos para gatos'
    ),
    (
        'Inmuebles',
        'Bienes raíces y propiedades'
    );

INSERT INTO
    categorias (nombre_categoria, descripcion)
VALUES (
        'Electrodomésticos',
        'Aparatos y equipos eléctricos para el hogar'
    );

INSERT INTO
    categorias (nombre_categoria, descripcion)
VALUES (
        'Instrumentos Musicales',
        'Guitarras, pianos, baterías y otros instrumentos para músicos y aficionados'
    );

INSERT INTO
    categorias (nombre_categoria, descripcion)
VALUES (
        'Alquiler de campos',
        'Campos disponibles para alquiler'
    ),
    (
        'Alquiler de casas',
        'Casas para alquilar'
    ),
    (
        'Alquiler de herramientas',
        'Herramientas disponibles para alquiler'
    );

SELECT * FROM categorias

CREATE TABLE productos (
    id_producto INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_vendedor INT UNSIGNED NOT NULL,
    id_ecommerce INT UNSIGNED,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    envio_gratis BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_vendedor) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces (id_ecommerce) ON DELETE SET NULL
);

select * from productos WHERE envio_gratis = 1

delete from compras
 

SELECT * FROM imagenes_productos;

DELETE FROM imagenes_productos;

SELECT * FROM detalles_compras;

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

SELECT p.id_producto, p.id_ecommerce, p.nombre_producto, p.precio, p.stock, c.nombre_categoria, (
        SELECT i.ruta_imagen
        FROM imagenes_productos i
        WHERE
            p.id_producto = i.id_producto
        ORDER BY i.id_imagen ASC
        LIMIT 1
    ) AS ruta_imagen
FROM
    productos p
    JOIN productos_categorias pc ON pc.id_producto = p.id_producto
    JOIN categorias c ON c.id_categoria = pc.id_categoria
WHERE
    c.nombre_categoria = 'Bebés y niños'
ORDER BY p.precio DESC;

SELECT * FROM categorias

SELECT p.nombre_producto, p.id_producto, p.precio, p.stock, i.ruta_imagen
FROM
    productos p
    JOIN imagenes_productos i ON p.id_producto = i.id_producto

SELECT p.nombre_producto, p.precio, p.stock, (
        SELECT i.ruta_imagen
        FROM imagenes_productos i
        WHERE
            p.id_producto = i.id_producto
        ORDER BY i.id_imagen ASC
        LIMIT 1
    ) AS ruta_imagen
FROM productos p
WHERE
    id_producto = 91

SELECT * FROM productos

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

SELECT
    c.estado,
    c.id_compra,
    d.cantidad,
    d.precio_unitario,
    p.stock,
    p.nombre_producto,
    ca.nombre_categoria,
    COALESCE(
        e.nombre_ecommerce,
        u.nombre_usuario
    ) AS vendedor,
    e.logo,
    (
        SELECT i.ruta_imagen
        FROM imagenes_productos i
        WHERE
            i.id_producto = p.id_producto
        LIMIT 1
    ) AS ruta_imagen
FROM
    compras c
    JOIN detalles_compras d ON d.id_compra = c.id_compra
    JOIN productos p ON p.id_producto = d.id_producto
    LEFT JOIN ecommerces e ON e.id_usuario = p.id_vendedor
    LEFT JOIN usuarios u ON u.id_usuario = p.id_vendedor
    JOIN productos_categorias pd ON pd.id_producto = p.id_producto
    JOIN categorias ca on ca.id_categoria = pd.id_categoria
WHERE
    c.id_cliente = 3;

select nombre_categoria from categorias


SELECT * FROM productos

SELECT * FROM ecommerces

ALTER TABLE compras AUTO_INCREMENT = 1;

DELETE FROM compras

SELECT * FROM compras;

SELECT * FROM detalles_compras

SELECT * FROM usuarios

DELETE FROM compras WHERE id_compra = 1

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
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

SELECT * FROM compras

SELECT * FROM productos

SELECT * FROM usuarios