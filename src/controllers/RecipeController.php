<?php

    // 1. Importa a conexão e o 
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/config/database.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/src/models/Recipe.php';

    $actions = ["getAllRecipes", "createRecipe", "getAllIngredients", "getRecipeById"];
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

                    if (empty($name)) {
                        throw new Exception("Nome da receita é obrigatório");
                    }

                    $newRecipe = $recipeModel->createRecipe($name, $description, $ingredients);
                    echo json_encode(["success" => true, "data" => $newRecipe]);
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




