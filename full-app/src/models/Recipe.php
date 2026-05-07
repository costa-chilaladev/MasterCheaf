<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

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

    public function getAllRecipesBasedOnSearchAnFilter($search, $categories) {
        $search = "%$search%";
        $recipes = [];

        // base da query
        $sql = "
            SELECT DISTINCT r.*
            FROM recipes r
        ";

        $params = [];
        $types = "";

        // se houver categorias, faz JOIN
        if (!empty($categories)) {
            $placeholders = implode(',', array_fill(0, count($categories), '?'));

            $sql .= "
                JOIN recipe_categories rc ON rc.recipe_id = r.id
                WHERE r.name LIKE ?
                AND rc.category_id IN ($placeholders)
            ";

            $types .= "s" . str_repeat("i", count($categories));
            $params[] = $search;

            foreach ($categories as $cat) {
                $params[] = $cat;
            }
        } else {
            $sql .= "
                WHERE r.name LIKE ?
            ";

            $types .= "s";
            $params[] = $search;
        }

        $sql .= " ORDER BY r.name ASC LIMIT 20";

        $stmt = $this->db->prepare($sql);

        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        $result = $stmt->get_result();

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

    public function createRecipe($name, $description, $ingredients, $preparationSteps, $allCategories, $measuraments, $ingredientNumbers) {
        if (!is_array($ingredients) || !is_array($measuraments) || !is_array($ingredientNumbers)) {
            throw new Exception("Dados de ingredientes inválidos");
        }

        if (count($ingredients) !== count($measuraments) || count($ingredients) !== count($ingredientNumbers)) {
            throw new Exception("Dados de ingredientes incompletos");
        }

        $sql = $this->db->prepare("INSERT INTO recipes (name, description) VALUES (?, ?)");
        $sql->bind_param("ss", $name, $description);
        
        if (!$sql->execute()) {
            throw new Exception("Erro ao criar receita: " . $sql->error);
        }
        
        $id = $this->db->insert_id; 
        $ingredientSql = $this->db->prepare("INSERT INTO recipe_ingredients (recipe_id, ingredient_id, number, measurements_id) VALUES (?, ?, ?, ?)");

        foreach ($ingredients as $index => $ingredientId) {
            $measurementId = $measuraments[$index] ?? null;
            $ingredientNumber = $ingredientNumbers[$index] ?? null;

            if (!is_numeric($ingredientId) || !is_numeric($measurementId) || !is_numeric($ingredientNumber)) {
                throw new Exception("Ingrediente ou unidade inválida na linha " . ($index + 1));
            }

            $ingredientSql->bind_param("iiii", $id, $ingredientId, $ingredientNumber, $measurementId);
            if (!$ingredientSql->execute()) {
                throw new Exception("Erro ao associar ingrediente: " . $ingredientSql->error);
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

    public function getRecipeById($id, $userId) {
        $sql = $this->db->prepare("SELECT * FROM recipes WHERE id = ?");
        $sql->bind_param("i", $id);
        $sql->execute();
        $sqlResult = $sql->get_result();
        $recipe = $sqlResult->fetch_assoc();

        if (!$recipe) {
            throw new Exception("Receita não encontrada");
        }

        $stmt = $this->db->prepare("SELECT 
            ri.number, 
            i.name AS ingredient_name, 
            m.name AS measurement_name
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        JOIN measurements m ON ri.measurements_id = m.id
        WHERE ri.recipe_id = ?");

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

        $stmt = $this->db->prepare("SELECT * FROM user_recipe_interactions where recipe_id = ? and active = 1");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $state = [];

        while ($row = $result->fetch_assoc()) {
            $state[] = $row["type"];
        }

        $recipe["state"] = $state; 

        $stmt = $this->db->prepare("
            SELECT 
                c.*, 
                u.username,     
                (c.user_id = ?) AS is_mine 
            FROM comments c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.recipe_id = ? 
            AND c.active = 1
            ORDER BY is_mine DESC, c.id DESC
        ");


        $stmt->bind_param("ii", $userId, $id);
        $stmt->execute();

        $result = $stmt->get_result();
        $comments = [];

        while ($comment = $result->fetch_assoc()) {
            $comments[] = $comment;
        }

        $recipe["comments"] = $comments;

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

    public function getMeasurements() {
        $stmt = $this->db->prepare("SELECT * FROM measurements");
        $stmt->execute();
        $result = $stmt->get_result();

        $row = [];

        while ($row = $result->fetch_assoc()) {
            $measurements[] = $row;
        }

        return $measurements;
    }

    public function toggleInteraction($id, $option, $userId) {
        if (!in_array($option, ['save', 'favorite'])) {
            return ["error" => "Invalid option"];
        }

        $stmt = $this->db->prepare("
            SELECT active FROM user_recipe_interactions 
            WHERE recipe_id = ? AND user_id = ? AND type = ?
        ");
        $stmt->bind_param("iis", $id, $userId, $option);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $newState = $row["active"] ? 0 : 1;
            $sql = $this->db->prepare("
                UPDATE user_recipe_interactions SET active = ? 
                WHERE recipe_id = ? AND user_id = ? AND type = ?
            ");
            $sql->bind_param("iiis", $newState, $id, $userId, $option);
            $sql->execute();

            return [
                "active" => (bool)$newState,
                "type" => $option
            ];
        }

        $stmt = $this->db->prepare("
            INSERT INTO user_recipe_interactions (recipe_id, user_id, type, active) 
            VALUES (?, ?, ?, 1)
        ");
        $stmt->bind_param("iis", $id, $userId, $option);
        $stmt->execute();

        return [
            "active" => true,
            "type" => $option
        ];
    }

    public function deleteComment($commentId, $userId) {
        $stmt = $this->db->prepare("UPDATE comments SET active = FALSE WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $commentId, $userId);
        $stmt->execute();

        return [
            "Comment Deleted"
        ];
    }

    public function addComment($recipeId, $userId, $comment, $rate) {
        $stmt = $this->db->prepare("SELECT * FROM comments WHERE recipe_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $recipeId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $stmt = $this->db->prepare("UPDATE comments SET active = TRUE, comment = ?, rate = ? WHERE user_id = ? and recipe_id = ?");
            $stmt->bind_param("siii", $comment, $rate, $userId, $recipeId);
            if ($stmt->execute()) {
                return ["message" => "Comment added"];
            } else {
                return ["error" => "Failed to add comment"];
            }
        }
        else {
            $stmt = $this->db->prepare("INSERT INTO comments (recipe_id, user_id, comment, rate) VALUES (?,?,?,?)");
            $stmt->bind_param("iisi", $recipeId, $userId, $comment, $rate);
            if ($stmt->execute()) {
                return ["message" => "Comment added"];
            } else {
                return ["error" => "Failed to add comment"];
            }
        }
    }
}
