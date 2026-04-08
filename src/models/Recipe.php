<?php
// models/recipe.php

class Recipe {
    private $db;

    public function __construct($connection) {
        $this->db = $connection;
    }

    public function getAllRecipes() {
        $sql = "SELECT * FROM recipes";
        $result = $this->db->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
