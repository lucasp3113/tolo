<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$config = require __DIR__ . '/../config.php';
$data_base = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database']
);

$color_categories = [
    "Electrónica",
    "Ropa hombre",
    "Ropa mujer",
    "Ropa niño",
    "Ropa niña",
    "Ropa unisex",
    "Calzado",
    "Accesorios",
    "Juguetes",
    "Hogar y Cocina",
    "Salud y Belleza",
    "Deportes y Aire libre",
    "Bebés y niños",
    "Computación",
    "Celulares y accesorios",
    "Oficina y papelería",
    "Automotriz",
    "Jardín y exteriores",
    "Vehículos",
    "Repuestos y autopartes",
    "Motocicletas",
    "Náutica",
    "Electrodomésticos",
    "Instrumentos Musicales"
];

$size_categories = [
    "Ropa hombre",
    "Ropa mujer",
    "Ropa niño",
    "Ropa niña",
    "Ropa unisex",
    "Calzado",
];

if ($data_base->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false
    ]);
    exit;
} else {
    $body = json_decode(file_get_contents("php://input"), true);
    $id_product = $body["idProducto"];
    $query = $data_base->prepare(
        "SELECT c.nombre_categoria
        FROM productos p
        JOIN productos_categorias pc ON pc.id_producto = p.id_producto
        JOIN categorias c ON c.id_categoria = pc.id_categoria
        WHERE p.id_producto = ?"
    );
    $query->bind_param("i", $id_product);
    if ($query->execute()) {
        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
        $trueSize = false;
        $trueColor = false;

        for ($i = 0; $i < count($result); $i++) {
            $categoria = $result[$i]["nombre_categoria"];

            if (in_array($categoria, $size_categories)) {
                $trueSize = true;
            }

            if (in_array($categoria, $color_categories)) {
                $trueColor = true;
            }
        }

        if ($trueSize) {
            $query = $data_base->prepare(
                "SELECT p.id_producto, p.nombre_producto, p.descripcion, p.precio, p.envio_gratis, p.fecha_publicacion, c.nombre, c.id_color, t.talle, t.stock, t.id_talle_color_producto, car.caracteristica, e.nombre_ecommerce
                FROM productos p
                JOIN colores_producto c ON c.id_producto = p.id_producto
                JOIN talles_color_producto t ON t.id_color = c.id_color
                JOIN caracteristicas_producto car ON car.id_producto = p.id_producto
                JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
                WHERE p.id_producto = ?"
            );
            $query->bind_param("i", $id_product);
            if ($query->execute()) {
                $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
                $data = [
                    "id_producto" => $result[0]["id_producto"],
                    "nombre_producto" => $result[0]["nombre_producto"],
                    "descripcion" => $result[0]["descripcion"],
                    "precio" => $result[0]["precio"],
                    "envio_gratis" => $result[0]["envio_gratis"],
                    "fecha_publicacion" => $result[0]["fecha_publicacion"],
                    "nombre_ecommerce" => $result[0]["nombre_ecommerce"],
                    "colores" => [],
                    "caracteristicas" => []
                ];

                $coloresProcessed = [];

                foreach ($result as $row) {
                    $color = $row["nombre"];
                    $colorId = $row["id_color"];
                    $size = $row["talle"];
                    $feature = $row["caracteristica"];

                    if (!isset($data["colores"][$color])) {
                        $data["colores"][$color] = [
                            "id_color" => $colorId,
                            "talles" => [],
                            "imagenes" => []
                        ];
                    }

                    if (!in_array($feature, $data["caracteristicas"])) {
                        $data["caracteristicas"][] = $feature;
                    }

                    $talleExiste = false;
                    foreach ($data["colores"][$color]["talles"] as $talleExistente) {
                        if ($talleExistente["talle"] === $size) {
                            $talleExiste = true;
                            break;
                        }
                    }

                    if (!$talleExiste) {
                        $data["colores"][$color]["talles"][] = [
                            "talle" => $size,
                            "stock" => $row["stock"],
                            "id_talle_color_producto" => $row["id_talle_color_producto"]
                        ];
                    }

                    if (!in_array($colorId, $coloresProcessed)) {
                        $coloresProcessed[] = $colorId;

                        $queryImg = $data_base->prepare(
                            "SELECT i.ruta_imagen
                            FROM imagenes_color_producto i
                            WHERE i.id_color = ?"
                        );
                        $queryImg->bind_param("i", $colorId);
                        if ($queryImg->execute()) {
                            $resultImg = $queryImg->get_result()->fetch_all(MYSQLI_ASSOC);
                            foreach ($resultImg as $img) {
                                $data["colores"][$color]["imagenes"][] = $img["ruta_imagen"];
                            }
                        }
                    }
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $data
                ]);
                exit;
            }
        } elseif ($trueColor) {
            $query = $data_base->prepare(
                "SELECT p.id_producto, p.nombre_producto, p.descripcion, p.precio, p.envio_gratis, p.fecha_publicacion, c.id_color, c.nombre, c.stock, car.caracteristica, e.nombre_ecommerce
                FROM productos p
                JOIN colores_producto c ON c.id_producto = p.id_producto
                JOIN caracteristicas_producto car ON car.id_producto = p.id_producto
                JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
                WHERE p.id_producto = ?"
            );
            $query->bind_param("i", $id_product);
            if ($query->execute()) {
                $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
                $data = [
                    "id_producto" => $result[0]["id_producto"],
                    "nombre_producto" => $result[0]["nombre_producto"],
                    "descripcion" => $result[0]["descripcion"],
                    "precio" => $result[0]["precio"],
                    "envio_gratis" => $result[0]["envio_gratis"],
                    "fecha_publicacion" => $result[0]["fecha_publicacion"],
                    "nombre_ecommerce" => $result[0]["nombre_ecommerce"],
                    "colores" => [],
                    "caracteristicas" => []
                ];

                $coloresProcessed = [];

                foreach ($result as $row) {
                    $color = $row["nombre"];
                    $colorId = $row["id_color"];
                    $feature = $row["caracteristica"];

                    $colorExiste = false;
                    foreach ($data["colores"] as $colorExistente) {
                        if ($colorExistente["nombre"] === $color) {
                            $colorExiste = true;
                            break;
                        }
                    }

                    if (!$colorExiste) {
                        $data["colores"][] = [
                            "id_color" => $colorId,
                            "nombre" => $color,
                            "stock" => $row["stock"],
                            "imagenes" => []
                        ];

                        $queryImg = $data_base->prepare(
                            "SELECT i.ruta_imagen
                            FROM imagenes_color_producto i
                            WHERE i.id_color = ?"
                        );
                        $queryImg->bind_param("i", $colorId);
                        if ($queryImg->execute()) {
                            $resultImg = $queryImg->get_result()->fetch_all(MYSQLI_ASSOC);
                            $lastIndex = count($data["colores"]) - 1;
                            foreach ($resultImg as $img) {
                                $data["colores"][$lastIndex]["imagenes"][] = $img["ruta_imagen"];
                            }
                        }
                    }

                    if (!in_array($feature, $data["caracteristicas"])) {
                        $data["caracteristicas"][] = $feature;
                    }
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $data
                ]);
                exit;
            }
        } else {
            $query = $data_base->prepare(
                "SELECT p.id_producto, p.nombre_producto, p.descripcion, p.precio, p.stock, p.envio_gratis, p.fecha_publicacion, car.caracteristica, e.nombre_ecommerce
                FROM productos p
                JOIN caracteristicas_producto car ON car.id_producto = p.id_producto
                JOIN ecommerces e ON e.id_ecommerce = p.id_ecommerce
                WHERE p.id_producto = ?"
            );
            $query->bind_param("i", $id_product);
            if ($query->execute()) {
                $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);
                $data = [
                    "id_producto" => $result[0]["id_producto"],
                    "nombre_producto" => $result[0]["nombre_producto"],
                    "descripcion" => $result[0]["descripcion"],
                    "precio" => $result[0]["precio"],
                    "stock" => $result[0]["stock"],
                    "envio_gratis" => $result[0]["envio_gratis"],
                    "fecha_publicacion" => $result[0]["fecha_publicacion"],
                    "nombre_ecommerce" => $result[0]["nombre_ecommerce"],
                    "caracteristicas" => [],
                    "imagenes" => []
                ];

                foreach ($result as $row) {
                    $feature = $row["caracteristica"];
                    if (!in_array($feature, $data["caracteristicas"])) {
                        $data["caracteristicas"][] = $feature;
                    }
                }

                $queryImg = $data_base->prepare(
                    "SELECT i.ruta_imagen
                    FROM imagenes_productos i
                    WHERE i.id_producto = ?"
                );
                $queryImg->bind_param("i", $id_product);
                if ($queryImg->execute()) {
                    $resultImg = $queryImg->get_result()->fetch_all(MYSQLI_ASSOC);
                    foreach ($resultImg as $img) {
                        $data["imagenes"][] = $img["ruta_imagen"];
                    }
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $data
                ]);
                exit;
            }
        }

    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false
        ]);
        exit;
    }
}