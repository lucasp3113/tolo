<?php
mysqli_report(MYSQLI_REPORT_OFF);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$data_base = new mysqli("localhost", "root", "", "tolo");

if ($data_base) {
    if (!empty($_POST)) {
        $username = $_POST["username"];
        $product_id = $_POST["id_publicacion"];
        $name_product = $_POST["nameProduct"];
        $product_price = $_POST["productPrice"];
        $product_stock = $_POST["productStock"];
        $product_description = $_POST["productDescription"];

        $categories_json = $_POST["categories"] ?? "[]";
        $categories_array = json_decode($categories_json, true);
        $category_list = [];
        foreach ($categories_array as $item) {
            $category_list[] = $item[0];
        }

        function updateImages($product_id, $data_base) {
            $saved_images = [];

            if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
                return true; 
            }

            $query = $data_base->prepare("SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = ?");
            $query->bind_param("i", $product_id);
            if ($query->execute()) {
                $old_images = $query->get_result()->fetch_all(MYSQLI_ASSOC);
                foreach ($old_images as $image) {
                    if (file_exists($image['ruta_imagen'])) {
                        unlink($image['ruta_imagen']);
                    }
                }
            }

            $delete_query = $data_base->prepare("DELETE FROM imagenes_productos WHERE id_producto = ?");
            $delete_query->bind_param("i", $product_id);
            $delete_query->execute();

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
                
                if ($file_error !== UPLOAD_ERR_OK) {
                    continue;
                }
                
                if (!in_array($file_type, $allowed_types)) {
                    continue;
                }
                
                if ($file_size > $max_size) {
                    continue;
                }
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
                $query = $data_base->prepare("SELECT id_ecommerce FROM ecommerces WHERE id_usuario = ? ");
                $query->bind_param("i", $id);
                if ($query->execute()) {
                    $id_ecommerce = $query->get_result()->fetch_assoc()["id_ecommerce"];
                    
                    $verify_query = $data_base->prepare("SELECT id_producto FROM productos WHERE id_producto = ? AND id_vendedor = ? AND id_ecommerce = ?");
                    $verify_query->bind_param("iii", $product_id, $id, $id_ecommerce);
                    if ($verify_query->execute() && $verify_query->get_result()->num_rows > 0) {
                        
                        $query = $data_base->prepare("UPDATE productos SET nombre_producto = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?");
                        $query->bind_param("ssdii", $name_product, $product_description, $product_price, $product_stock, $product_id);
                        if ($query->execute()) {
                            
                            $delete_categories = $data_base->prepare("DELETE FROM productos_categorias WHERE id_producto = ?");
                            $delete_categories->bind_param("i", $product_id);
                            $delete_categories->execute();
                            
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
                            $images_updated = updateImages($product_id, $data_base);
                            
                            http_response_code(200);
                            echo json_encode([
                                "success" => true,
                                "message" => "GOOOD",
                                "product_id" => $product_id,
                                "images_updated" => $images_updated
                            ]);
                            exit;
                            
                        } else {
                            http_response_code(400);
                            echo json_encode([
                                "success" => false,
                                "message" => "Error "
                            ]);
                            exit;
                        }
                    } else {
                        http_response_code(403);
                        echo json_encode([
                            "success" => false,
                            "message" => "ERROR"
                        ]);
                        exit;
                    }
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Error"
                    ]);
                    exit;
                }
            } else {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "ERROR"
                ]);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Errror"
            ]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "ERROR"
        ]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "ERROR, vuelve a  intentarlo"
    ]);
    exit;
}
?>