<?php
    class user {
        private $db;

        public function __construct($connection) {
            $this->db = $connection;
        }

        public function createUser($name, $email, $passwordHash) {
            $sql = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $sql->bind_param("sss", $name, $email, $passwordHash);
            
            if (!$sql->execute()) {
                throw new Exception("Erro ao criar usuário: " . $sql->error);
                exit();
            }
        }

        public function authUser($email, $password) {
            $sql = $this->db->prepare("SELECT * FROM users WHERE email = ?");
            $sql->bind_param("s", $email);

            if (!$sql->execute()) {
                throw new Exception("Login Error" . $sql->error);
            }

            $result = $sql->get_result()->fetch_assoc();

            $passwordHash = $result["password_hash"];

            if (password_verify($password, $passwordHash)) {
                return true;
            }
        }
    }