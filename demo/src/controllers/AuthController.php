<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    require_once __DIR__ . '/../../config/database.php';
    require_once __DIR__ . '/../models/user.php';

    $userModel = new User($connect);

    $actions = ["signup", "login"];
    $action = $_GET['action'] ?? '';

    header('Content-Type: application/json');

    if (!in_array($action, $actions)) {
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        exit();
    }

    try {
        switch ($action) {
            case 'signup':
                $name = trim($_POST['userName'] ?? '');
                $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
                $password = $_POST['password'] ?? '';

                if (!$name || !$email || strlen($password) < 6) {
                    throw new Exception("Dados de registo inválidos ou incompletos");
                }

                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                $userModel->createUser($name, $email, $passwordHash);
                
                echo json_encode(['success' => true, 'message' => 'Utilizador registado com sucesso']);
                break;

            case 'login':
                $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
                $password = $_POST['password'] ?? '';

                if (!$email || !$password) {
                    throw new Exception("E-mail e senha são obrigatórios");
                }

                if ($userModel->authUser($email, $password)) {
                    echo json_encode(["success" => true, "message" => "Login efetuado com sucesso"]);
                } else {
                    throw new Exception("E-mail ou senha incorretos");
                }
                break;
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
