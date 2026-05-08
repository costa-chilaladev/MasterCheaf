<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

class User {
    private $db;

    public function __construct($connection) {
        $this->db = $connection;
    }

    public function createUser($name, $email, $passwordHash) {
        $sql = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        $sql->bind_param("sss", $name, $email, $passwordHash);
        
        if (!$sql->execute()) {
            throw new Exception("Error registering: " . $this->db->error);
        }
        return true;
    }

    public function authUser($email, $password) {
        $sql = $this->db->prepare("SELECT id, password_hash FROM users WHERE email = ? LIMIT 1");
        $sql->bind_param("s", $email);

        if (!$sql->execute()) {
            return false;
        }

        $result = $sql->get_result()->fetch_assoc();

        if ($result && password_verify($password, $result["password_hash"])) {
            
            session_regenerate_id(true);
            
            $_SESSION["id"] = $result["id"];
            return true;
        }

        return false; 
    }
}
