<?php

    // 1. Importa a conexão e o 
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/config/database.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/src/models/Recipe.php';

    $actions = ["getAllRecipes", "createRecipe", "getAllIngredients", "getRecipeById", "getAllRecipesBasedOnSearchAnFilter", "getCategorys", "getCategoriesByRecipeId"];
    $action = $_GET["action"] ?? '';

    if (in_array($action, $actions)) {
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

                    $newRecipe = $recipeModel->createRecipe($name, $description, $ingredients, $preparationSteps, $allCategories);
                    $newRecipeId = $newRecipe;

                    if (!empty($_FILES['recipe-images'])) {
                        foreach ($_FILES['recipe-images']["tmp_name"] as $index => $tmpName) {
                            if ($_FILES['recipe-images']["error"][$index] !== UPLOAD_ERR_OK) {
                                continue;
                            }

                            $originalName = $_FILES['recipe-images']["name"][$index];
                            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
                            $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                            $safeName = trim($_POST['recipe-name'] ?? '');
                            $newFileName = $baseName . "_" . $safeName . "_" . $newRecipeId . "." . $ext;
                            
                            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/uploads/recipes/';
                            move_uploaded_file($tmpName, $uploadDir . $newFileName);
                            $recipeModel->addImageRecipe($newRecipeId, $newFileName);
                        }
                    }

                    
                    echo json_encode(["success" => true, "data" => $newRecipeId]);
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
                    $recipe = $recipeModel->getRecipeById($id);

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
            }
        } catch (Exception $e) {
            // Tratamento de erro
            http_response_code(400); // Bad Request
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }




