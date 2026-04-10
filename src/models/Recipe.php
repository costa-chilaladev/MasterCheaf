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

    public function createRecipe($name, $description, $ingredients) {
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

        return $recipe;
    }
}
