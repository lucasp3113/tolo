<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require __DIR__ . '/../vendor/autoload.php';
use MeiliSearch\Client;

$data_base = new mysqli("localhost", "root", "", "tolo");

if ($data_base) {
    if (!empty($_POST)) {
        $username = $_POST["username"];
        $name_product = $_POST["nameProduct"];
        $product_price = $_POST["productPrice"];
        $product_stock = $_POST["productStock"];
        $product_description = $_POST["productDescription"] ?? null;
        $categories_json = $_POST["categories"] ?? "[]";
        $categories_array = json_decode($categories_json, true);
        $category_list = [];
        $shipping = !empty($_POST["shipping"]) ? 1 : 0;
        foreach ($categories_array as $item) {
            $category_list[] = $item[0];
        }

        function saveImages($product_id, $data_base)
        {
            $saved_images = [];

            if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
                return true;
            }

            $upload_dir = "uploads/products/";
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            $max_size = 5 * 1024 * 1024;

            for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
                $file_name = $_FILES['images']['name'][$i];
                $file_tmp = $_FILES['images']['tmp_name'][$i];
                $file_size = $_FILES['images']['size'][$i];
                $file_type = $_FILES['images']['type'][$i];
                $file_error = $_FILES['images']['error'][$i];

                if ($file_error !== UPLOAD_ERR_OK)
                    continue;
                if (!in_array($file_type, $allowed_types))
                    continue;
                if ($file_size > $max_size)
                    continue;

                $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
                $unique_name = uniqid() . '_' . time() . '.' . $file_extension;
                $file_path = $upload_dir . $unique_name;

                if (move_uploaded_file($file_tmp, $file_path)) {
                    $relative_path = "uploads/products/" . $unique_name;
                    $query = $data_base->prepare("INSERT INTO imagenes_productos (id_producto, ruta_imagen) VALUES (?, ?)");
                    $query->bind_param("is", $product_id, $relative_path);

                    if ($query->execute()) {
                        $saved_images[] = $relative_path;
                    } else {
                        unlink($file_path);
                    }
                }
            }
            return count($saved_images) > 0;
        }

        $query = $data_base->prepare("SELECT id_usuario, tipo_usuario FROM usuarios WHERE nombre_usuario = ?");
        $query->bind_param("s", $username);

        if ($query->execute()) {
            $result = $query->get_result()->fetch_assoc();
            $id = $result["id_usuario"];
            $user_type = $result["tipo_usuario"];

            if ($user_type === "ecommerce") {
                $query = $data_base->prepare("SELECT id_ecommerce FROM ecommerces WHERE id_usuario = ?");
                $query->bind_param("i", $id);

                if ($query->execute()) {
                    $id_ecommerce = $query->get_result()->fetch_assoc()["id_ecommerce"];
                    $query = $data_base->prepare("INSERT INTO productos(id_vendedor, id_ecommerce, nombre_producto, descripcion, precio, stock, envio_gratis) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $query->bind_param("iissdii", $id, $id_ecommerce, $name_product, $product_description, $product_price, $product_stock, $shipping);

                    if ($query->execute()) {
                        $product_id = $data_base->insert_id;

                        if (!empty($category_list)) {
                            $number_of_question_marks = implode(',', array_fill(0, count($category_list), "?"));
                            $number_of_s = str_repeat("s", count($category_list));
                            $query = $data_base->prepare("SELECT id_categoria FROM categorias WHERE nombre_categoria IN ($number_of_question_marks)");
                            $query->bind_param($number_of_s, ...$category_list);

                            if ($query->execute()) {
                                $id_categories_ugly = $query->get_result()->fetch_all(MYSQLI_NUM);
                                $id_categories_cute = array_column($id_categories_ugly, 0);

                                if (!empty($id_categories_cute)) {
                                    $number_of_ii = str_repeat("ii", count($id_categories_cute));
                                    $number_of_values = implode(",", array_fill(0, count($id_categories_cute), "(?, ?)"));

                                    $insert_values = [];
                                    foreach ($id_categories_cute as $cat_id) {
                                        $insert_values[] = $product_id;
                                        $insert_values[] = $cat_id;
                                    }

                                    $query = $data_base->prepare("INSERT INTO productos_categorias(id_producto, id_categoria) VALUES $number_of_values");
                                    $query->bind_param($number_of_ii, ...$insert_values);
                                    $query->execute();
                                }
                            }
                        }
                        $images_saved = saveImages($product_id, $data_base);

                        // 🔹 Agregar producto a MeiliSearch
                        $client = new Client('http://127.0.0.1:7700');
                        $index = $client->getIndex('productos');
                        $name_product_clean = str_replace(" ", "", $name_product);
                        $producto_index = [
                            'id' => trim($name_product_clean),
                            'name' => $name_product
                        ];
                        $index->addDocuments([$producto_index]);
                        http_response_code(200);
                        echo json_encode([
                            "success" => true,
                            "message" => "Producto creado e indexado exitosamente",
                            "product_id" => $product_id,
                            "images_uploaded" => $images_saved,
                            "shipping" => $shipping
                        ]);
                        exit;
                    } else {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false,
                            "message" => "Error al crear el producto"
                        ]);
                        exit;
                    }

                } else {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Error al obtener datos del ecommerce"
                    ]);
                    exit;
                }
            } else {
                if ($user_type === "vendedor_particular") {
                    $id_ecommerce = null;
                    $query = $data_base->prepare("INSERT INTO productos(id_vendedor, id_ecommerce, nombre_producto, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?, ?)");
                    $query->bind_param("iissdi", $id, $id_ecommerce, $name_product, $product_description, $product_price, $product_stock);
                    if ($query->execute()) {
                        $product_id = $data_base->insert_id;

                        if (!empty($category_list)) {
                            $number_of_question_marks = implode(',', array_fill(0, count($category_list), "?"));
                            $number_of_s = str_repeat("s", count($category_list));
                            $query = $data_base->prepare("SELECT id_categoria FROM categorias WHERE nombre_categoria IN ($number_of_question_marks)");
                            $query->bind_param($number_of_s, ...$category_list);

                            if ($query->execute()) {
                                $id_categories_ugly = $query->get_result()->fetch_all(MYSQLI_NUM);
                                $id_categories_cute = array_column($id_categories_ugly, 0);

                                if (!empty($id_categories_cute)) {
                                    $number_of_ii = str_repeat("ii", count($id_categories_cute));
                                    $number_of_values = implode(",", array_fill(0, count($id_categories_cute), "(?, ?)"));

                                    $insert_values = [];
                                    foreach ($id_categories_cute as $cat_id) {
                                        $insert_values[] = $product_id;
                                        $insert_values[] = $cat_id;
                                    }

                                    $query = $data_base->prepare("INSERT INTO productos_categorias(id_producto, id_categoria) VALUES $number_of_values");
                                    $query->bind_param($number_of_ii, ...$insert_values);
                                    $query->execute();
                                }
                            }
                        }
                        $images_saved = saveImages($product_id, $data_base);

                        // 🔹 Agregar producto a MeiliSearch
                        $client = new Client('http://127.0.0.1:7700');
                        $index = $client->getIndex('productos');
                        $name_product_clean = str_replace(" ", "", $name_product);
                        $producto_index = [
                            'id' => trim($name_product_clean),
                            'name' => $name_product
                        ];
                        $index->addDocuments([$producto_index]);
                        http_response_code(200);
                        echo json_encode([
                            "success" => true,
                            "message" => "Producto creado e indexado exitosamente",
                            "product_id" => $product_id,
                            "images_uploaded" => $images_saved,
                            "shipping" => $shipping
                        ]);
                        exit;
                    } else {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false,
                            "message" => "Error al crear el producto"
                        ]);
                        exit;
                    }
                } else {
                    http_response_code(403);
                    echo json_encode([
                        "success" => false,
                        "message" => "Usuario no autorizado"
                    ]);
                    exit;
                }
            }

        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Error al verificar usuario"
            ]);
            exit;
        }

    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos POST"
        ]);
        exit;
    }

} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}
?>