<?php

    // 1. Importa a conexão e o 
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/config/database.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/src/models/Recipe.php';

    $actions = ["getAllRecipes"];
    $action = $_GET["action"];

    if (in_array($action, $actions))    {
        // 2. Instancia o modelo passando a variável $connect (que vem do database.php)
        $recipeModel = new Recipe($connect);

        // 3. Chama o método para buscar os 
        switch ($action) {
            case "getAllRecipes":
                $recipes = $recipeModel->getAllRecipes();
                echo json_encode($recipes);
            break;
        }
    }




