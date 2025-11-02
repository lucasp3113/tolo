-- Active: 1756304004613@@127.0.0.1@3306@tolo

DROP DATABASE tolo;

-- Active: 1758104807084@@127.0.0.1@3306
CREATE DATABASE tolo;
USE tolo;

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NULL,
    tipo_usuario ENUM(
        'cliente',
        'vendedor_particular',
        'ecommerce',
        'admin'
    ) NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,
    tolo_coins DECIMAL (10,2) DEFAULT 0 
);

INSERT INTO usuarios (nombre_usuario, email, contraseña, tipo_usuario)
VALUES ('admin', 'tolostudiooficial@gmail.com', '$2y$10$nQZNQkcq6aB4sEgRq4US3uKy3p9JyuAgqad8Hq3pAUHw2950oqnRG', 'admin');


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
INSERT INTO rangos (
        nombre_rango,
        facturacion_minima,
        porcentaje_comision
    )
VALUES ('junior', 0, 10),
    ('amateur', 7000, 8),
    ('semi_senior', 25000, 6),
    ('senior', 75000, 4),
    ('elite', 350000, 2);
    
CREATE TABLE ecommerces (
    id_ecommerce INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED UNIQUE,
    nombre_ecommerce VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT DEFAULT NULL,
    rango_actual INT UNSIGNED DEFAULT 1,
    facturacion_acumulada INT DEFAULT 0,
    map TEXT DEFAULT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    home VARCHAR(255) DEFAULT NULL 
    favicon VARCHAR(255) DEFAULT NULL
    REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (rango_actual) REFERENCES rangos (id_rango)
);

SELECT * FROM ecommerces


CREATE TABLE categorias (
    id_categoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(30) NOT NULL,
    descripcion TEXT DEFAULT NULL
);

INSERT INTO categorias (nombre_categoria, descripcion)
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
        'Ropa unisex',
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
INSERT INTO categorias (nombre_categoria, descripcion)
VALUES (
        'Electrodomésticos',
        'Aparatos y equipos eléctricos para el hogar'
    );

INSERT INTO
    categorias (nombre_categoria, descripcion)
INSERT INTO categorias (nombre_categoria, descripcion)
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
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces (id_ecommerce) ON DELETE
    SET NULL
);

SELECT 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto, 
    p.precio, 
    SUM(d.cantidad) AS cantidad_vendida,
    COUNT(DISTINCT c.id_cliente) AS compradores_distintos,
    (
    SELECT i.ruta_imagen FROM imagenes_productos i
    WHERE i.id_producto = p.id_producto
    LIMIT 1
    ) AS ruta_imagen
FROM productos p
JOIN ecommerces e 
    ON e.id_ecommerce = p.id_ecommerce
JOIN detalles_compra d 
    ON d.id_producto = p.id_producto
JOIN compras c 
    ON c.id_compra = d.id_compra
WHERE e.nombre_ecommerce = 'Bohemian Design'
GROUP BY 
    p.id_producto, 
    p.id_ecommerce, 
    p.nombre_producto,
    p.precio
ORDER BY cantidad_vendida DESC
LIMIT 30;



SELECT * FROM usuarios

UPDATE usuarios SET tolo_coins = 0

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



CREATE TABLE comentarios_productos (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (
        rating >= 0
        AND rating <= 5
    ),
    comentario TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (id_usuario, id_producto)
);
CREATE TABLE carrito (
    id_carrito INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    id_ecommerce INT UNSIGNED NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces(id_ecommerce) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_ecommerce (id_usuario, id_ecommerce)
);

CREATE TABLE items_carrito (
    id_item INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_carrito INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    id_color INT UNSIGNED NULL,
    id_talle_color_producto INT UNSIGNED NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_color) REFERENCES colores_producto(id_color) ON DELETE SET NULL,
    FOREIGN KEY (id_talle_color_producto) REFERENCES talles_color_producto(id_talle_color_producto) ON DELETE SET NULL,
    UNIQUE KEY unique_item_variant (id_carrito, id_producto, id_color, id_talle_color_producto)
);

SELECT * FROM items_carrito



CREATE TABLE compras (
    id_compra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    id_ecommerce INT UNSIGNED NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    comision_plataforma DECIMAL(10, 2) DEFAULT 0,
    estado ENUM(
        'pendiente',
        'pagada',
        'enviado',
        'entregado',
        'cancelada'
    ) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ecommerce) REFERENCES ecommerces(id_ecommerce) ON DELETE RESTRICT,
    INDEX idx_ecommerce_fecha (id_ecommerce, fecha_compra)
);

CREATE TABLE detalles_compra (
        id_detalle INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        id_compra INT UNSIGNED NOT NULL,
        id_producto INT UNSIGNED NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        comision DECIMAL(10, 2) NOT NULL DEFAULT 0,
        FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT
    );

SELECT p.id_producto,
    p.id_ecommerce,
    p.nombre_producto,
    p.precio,
    SUM(d.cantidad) AS cantidad_vendida,
    COUNT(DISTINCT c.id_cliente) AS compradores_distintos,
    (
        SELECT i.ruta_imagen
        FROM imagenes_productos i
        WHERE i.id_producto = p.id_producto
        LIMIT 1
    ) AS ruta_imagen
FROM productos p
    JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
    JOIN detalles_compra d ON d.id_producto = p.id_producto
    JOIN compras c ON c.id_compra = d.id_compra
WHERE e.nombre_ecommerce = 'LaFerre'
GROUP BY p.id_producto,
    p.id_ecommerce,
    p.nombre_producto,
    p.precio
ORDER BY cantidad_vendida DESC
LIMIT 30;

CREATE TABLE pagos (
    id_pago INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    mercadopago_payment_id VARCHAR(100),
    payment_method_id VARCHAR(50),
    estado_pago ENUM(
        'pendiente',
        'aprobado',
        'rechazado',
        'cancelado'
    ) NOT NULL DEFAULT 'pendiente',
    monto DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    external_resource_url TEXT,
    payment_reference VARCHAR(100),
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
    INDEX idx_mp_payment (mercadopago_payment_id)
);
CREATE TABLE envios (
    id_envio INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED NOT NULL,
    metodo_envio VARCHAR(255),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    celular VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(100),
    departamento VARCHAR(60) NOT NULL,
    ciudad VARCHAR(60) NOT NULL,
    direccion_entrega TEXT NOT NULL,
    estado_envio ENUM(
        'pendiente',
        'enviado',
        'entregado',
        'devuelto'
    ) NOT NULL DEFAULT 'pendiente',
    tracking VARCHAR(255),
    fecha_estimada_entrega DATE,
    FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE,
    UNIQUE KEY unique_compra_envio (id_compra)
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

SELECT * FROM productos



SELECT * FROM talles_color_producto WHERE id_talle_color_producto IN (49);

SELECT * FROM items_carrito

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

CREATE TABLE visitas (
    id_visita INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME
);

SELECT * FROM visitas;

CREATE TABLE respuestas_comentario (
    id_respuesta INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_comentario INT NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    respuesta TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_comentario) REFERENCES comentarios_productos (id_comentario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);



