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
}
