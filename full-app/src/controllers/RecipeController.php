<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['id'])) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(["success" => false, "message" => "Usuário não autenticado"]);
        exit();
    }
    
    $userId = $_SESSION["id"];

    // 1. Importa a conexão e o 
    require_once __DIR__ . '/../../config/database.php';
    require_once __DIR__ . '/../models/Recipe.php';

    $actions = [
        "getAllRecipes", 
        "createRecipe", 
        "getAllIngredients",
        "getRecipeById", 
        "getAllRecipesBasedOnSearchAnFilter", 
        "getCategorys", 
        "getCategoriesByRecipeId", 
        "getMeasurements",
        "recipeInteraction",
        "deleteComment",
        "sendComment"
    ];

    $action = $_GET["action"] ?? '';

    if (in_array($action, $actions)) {
        header('Content-Type: application/json; charset=utf-8');
        try {
            // 2. Instancia o modelo passando a variável $connect (que vem do database.php)
            $recipeModel = new Recipe($connect);

            // 3. Chama o método para buscar os 
            switch ($action) {
                case "getAllRecipes":
                    $recipes = $recipeModel->getAllRecipes();
                    echo json_encode(["success" => true, "data" => $recipes]);
                    break;

                case "createRecipe":
                    // Validação de entrada
                    $name = trim($_POST['recipe-name'] ?? '');
                    $description = trim($_POST['recipe-description'] ?? '');
                    $ingredients = $_POST['recipe-ingredients'] ?? [];
                    $preparationSteps = $_POST['recipe-preparation-steps'] ?? [];
                    $multipleChoiceType = $_POST['categories'] ?? [];
                    $ingredientNumbers = $_POST["ingredient-number"] ?? [];
                    $measuraments = $_POST["measuraments"] ?? [];
                    $meal = $_POST['meal'] ?? ''; 
                    $type = $_POST['type'] ?? '';

                    $allCategories = array_filter(array_merge(
                        [$meal],
                        [$type],
                        $multipleChoiceType
                    ));

                    if (empty($name)) {
                        throw new Exception("Nome da receita é obrigatório");
                    }

                    $connect->begin_transaction();
                    $uploadedFiles = [];

                    try {
                        $newRecipeId = $recipeModel->createRecipe($name, $description, $ingredients, $preparationSteps, $allCategories, $measuraments, $ingredientNumbers);

                        if (!empty($_FILES['recipe-images']) && is_array($_FILES['recipe-images']["tmp_name"])) {
                            foreach ($_FILES['recipe-images']["tmp_name"] as $index => $tmpName) {
                                if ($_FILES['recipe-images']["error"][$index] !== UPLOAD_ERR_OK) {
                                    continue;
                                }

                                $originalName = $_FILES['recipe-images']["name"][$index];
                                $baseName = pathinfo($originalName, PATHINFO_FILENAME);
                                $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                                $safeName = preg_replace('/[^A-Za-z0-9_-]/', '_', trim($_POST['recipe-name'] ?? ''));
                                $newFileName = $baseName . "_" . $safeName . "_" . $newRecipeId . "." . $ext;
                                $uploadDir = __DIR__ . '/../../uploads/recipes/';
                                $destination = $uploadDir . $newFileName;

                                if (!move_uploaded_file($tmpName, $destination)) {
                                    throw new Exception("Erro ao mover imagem para o servidor");
                                }

                                $uploadedFiles[] = $destination;
                                $recipeModel->addImageRecipe($newRecipeId, $newFileName);
                            }
                        }

                        $connect->commit();
                        $connect->autocommit(true);
                        echo json_encode(["success" => true, "data" => $newRecipeId]);
                    } catch (Exception $e) {
                        $connect->rollback();
                        $connect->autocommit(true);

                        foreach ($uploadedFiles as $filePath) {
                            if (file_exists($filePath)) {
                                @unlink($filePath);
                            }
                        }

                        throw $e;
                    }
                    break;

                case "getAllIngredients":
                    $ingredients = $recipeModel->getAllIngredients();
                    echo json_encode(["success" => true, "data" => $ingredients]);
                    break;

                case "getRecipeById":
                    $id = $_GET['id'] ?? '';
                    if (empty($id)) {
                        throw new Exception("ID da receita é obrigatório");
                    }
                    $recipe = $recipeModel->getRecipeById($id, $userId);

                    echo json_encode(["success" => true, "data" => $recipe]);
                    break;

                case "getAllRecipesBasedOnSearchAnFilter":
                    $searchTerm = trim($_POST['searchTerm'] ?? '');
                    
                    $multipleChoiceType = $_POST['categories'] ?? [];
                    $meal = $_POST['meal'] ?? ''; 
                    $type = $_POST['type'] ?? '';

                    $allCategories = array_filter(array_merge(
                        [$meal],
                        [$type],
                        $multipleChoiceType
                    ));

                    $recipes = $recipeModel->getAllRecipesBasedOnSearchAnFilter($searchTerm, $allCategories);

                    echo json_encode(["success" => true, "data" => $recipes]);
                    break;

                case "getCategorys":
                    $categorys = $recipeModel->getCategorys();

                    echo json_encode(["success" => true, "data" => $categorys]);
                    break;

                case "getCategoriesByRecipeId":
                    $id = $_GET["id"] ?? '';
                    $categories = $recipeModel->getRecipeCategories($id);

                    echo json_encode((["success" => true, "data" => $categories]));
                    break;

                case "getMeasurements":
                    $measurements = $recipeModel->getMeasurements();

                    echo json_encode(["success" => true, "data" => $measurements]);
                    break;

                case "recipeInteraction": 
                    $data = json_decode(file_get_contents("php://input"), true);

                    $recipeId = $data['recipeId'] ?? null;
                    $option = $data['option'] ?? null;

                    $response = $recipeModel->toggleInteraction($recipeId, $option, $userId);
                    echo json_encode(["success" => true, "data" => $response]);
                    break;

                case "deleteComment":
                    $commentId = $_GET["id"];

                    $response = $recipeModel->deleteComment($commentId, $userId);
                    echo json_encode(["success" => true, "data" => $response]);
                    break;

                case "sendComment":
                    $json = file_get_contents("php://input");

                    $data = json_decode($json, true);

                    $recipeId = $data["id"] ?? null;
                    $comment = $data["comment"] ?? null;
                    $rating = $data["rating"] ?? null;

                    $response = $recipeModel->addComment($recipeId, $userId, $comment, $rating);

                    echo json_encode([
                        "comment" => $comment,
                        "rating" => $rating
                    ]);

                    break;

                case "createIngredient":
                    throw new Exception("Criação de ingredientes não é permitida");
                    break;
            }
        } catch (Exception $e) {
            http_response_code(400); 
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }




