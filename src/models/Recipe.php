<?php
// models/recipe.php

class Recipe {
    private $db;

    public function __construct($connection) {
        $this->db = $connection;
    }

    public function getAllRecipes() {
        $sql = $this->db->prepare("SELECT * FROM recipes");
        $sql->execute();
        $sqlResult = $sql->get_result();
        $result = [];

        while ($row = $sqlResult->fetch_assoc()) {
            $id = $row['id'];
            $images = [];
            
            $stmt = $this->db->prepare("SELECT image_name FROM images WHERE recipe_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $imageResult = $stmt->get_result();
            
            while ($imageRow = $imageResult->fetch_assoc()) {
                $images[] = $imageRow['image_name'];
            }
            $row['images'] = $images;
            $result[] = $row;
        }

        return $result;
    }

    public function getAllRecipesBasedOnSearch($search) {
        $search = "%$search%";

        $stmt = $this->db->prepare("
            SELECT * FROM recipes 
            WHERE name LIKE ?
            ORDER BY name ASC
            LIMIT 20
        ");

        $stmt->bind_param("s", $search);
        $stmt->execute();

        $result = $stmt->get_result();
        $recipes = [];

        while ($row = $result->fetch_assoc()) {

            $id = $row['id'];
            $images = [];

            $imgStmt = $this->db->prepare("
                SELECT image_name 
                FROM images 
                WHERE recipe_id = ?
            ");

            $imgStmt->bind_param("i", $id);
            $imgStmt->execute();
            $imageResult = $imgStmt->get_result();

            while ($imageRow = $imageResult->fetch_assoc()) {
                $images[] = $imageRow['image_name'];
            }

            $row['images'] = $images;
            $recipes[] = $row;
        }

        return $recipes;
    }

    public function getAllIngredients() {
        $sql = $this->db->prepare("SELECT * FROM ingredients");
        $sql->execute();
        $sqlResult = $sql->get_result();
        $result = [];

        while ($row = $sqlResult->fetch_assoc()) {
            $result[] = $row;
        }

        return $result;
    }

    public function createRecipe($name, $description, $ingredients, $preparationSteps, $allCategories) {
        $sql = $this->db->prepare("INSERT INTO recipes (name, description) VALUES (?, ?)");
        $sql->bind_param("ss", $name, $description);
        
        if (!$sql->execute()) {
            throw new Exception("Erro ao criar receita: " . $sql->error);
            exit();
        }
        
        $id = $this->db->insert_id; // Retorna o ID da nova receita

        foreach ($ingredients as $ingredientId) {
            $sql = $this->db->prepare("INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (?, ?)");
            $sql->bind_param("ii", $id, $ingredientId);
            if (!$sql->execute()) {
                throw new Exception("Erro ao associar ingrediente: " . $sql->error);
            }
        }

        $stmt = $this->db->prepare("
            INSERT INTO recipe_categories (recipe_id, category_id) 
            VALUES (?, ?)
        ");

        foreach ($allCategories as $category) {
            if (!is_numeric($category)) continue;
            
            $stmt->bind_param("ii", $id, $category);
            $stmt->execute();
        }

        foreach ($preparationSteps as $index => $stepDescription) {
            $stepNumber = $index + 1; // Passo 1, Passo 2, etc.
            $sql = $this->db->prepare("INSERT INTO preparation_steps (recipe_id, step_number, description) VALUES (?, ?, ?)");
            $sql->bind_param("iis", $id, $stepNumber, $stepDescription);
            if (!$sql->execute()) {
                throw new Exception("Erro ao adicionar passo de preparação: " . $sql->error);
            }
        }

        return $id;
    }

    public function getRecipeById($id) {
        $sql = $this->db->prepare("SELECT * FROM recipes WHERE id = ?");
        $sql->bind_param("i", $id);
        $sql->execute();
        $sqlResult = $sql->get_result();
        $recipe = $sqlResult->fetch_assoc();

        if (!$recipe) {
            throw new Exception("Receita não encontrada");
        }

        $stmt = $this->db->prepare("SELECT * from recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id WHERE ri.recipe_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $ingredientResult = $stmt->get_result();
        $ingredients = [];

        while ($row = $ingredientResult->fetch_assoc()) {
            $ingredients[] = $row;
        }

        $recipe['ingredients'] = $ingredients;

        $stmt = $this->db->prepare("SELECT image_name FROM images WHERE recipe_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $imageResult = $stmt->get_result();
        $images = [];

        while ($imageRow = $imageResult->fetch_assoc()) {
            $images[] = $imageRow['image_name'];
        }

        $recipe['images'] = $images;

        $stmt = $this->db->prepare("SELECT step_number, description FROM preparation_steps WHERE recipe_id = ? ORDER BY step_number ASC");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stepResult = $stmt->get_result();
        $steps = [];

        while ($row = $stepResult->fetch_assoc()) {
            $steps[] = $row;
        }

        $recipe['preparation_steps'] = $steps;


        return $recipe;
    }

    public function addImageRecipe($recipeId, $imageName) {
        $sql = $this->db->prepare("INSERT INTO images (recipe_id, image_name) VALUES (?, ?)");
        $sql->bind_param("is", $recipeId, $imageName);
        
        if (!$sql->execute()) {
            throw new Exception("Erro ao adicionar imagem: " . $sql->error);
        }

        return true;
    }

    public function getCategorys() {
        $sql = $this->db->prepare("SELECT * FROM categorys");
        if (!$sql->execute()) {
            throw new Exception("Error getting categorys: " . $sql->error);
        }
        $result = $sql->get_result();

        while($category = $result->fetch_assoc()) {
            $categorys[] = $category;
        }

        return $categorys;
    }

    public function getRecipeCategories($id) {
        $recipe_categories = [];
        $categories = [];

        $sql = $this->db->prepare("SELECT * FROM recipe_categories WHERE recipe_id = ?");
        $sql->bind_param("i", $id);
        $sql->execute();
        $result = $sql->get_result();

        while ($row = $result->fetch_assoc()) {
            $recipe_categories[] = $row;
        }

        if (empty($recipe_categories)) {
            return [];
        }

        $categoriesIds = array_column($recipe_categories, 'category_id');

        foreach ($categoriesIds as $category) {
            $stmt = $this->db->prepare("SELECT name FROM categorys WHERE id = ?");
            $stmt->bind_param("i", $category);
            $stmt->execute();

            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $categories[] = $row['name'];
            }
        }

        return $categories;
    }
}
