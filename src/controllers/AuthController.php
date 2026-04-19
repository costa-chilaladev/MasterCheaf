<?php
    
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/config/database.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterCheaf/src/models/user.php';

    $userModel = new user($connect);

    $actions = ["signup", "login"];
    $action = $_GET['action'] ?? '';

    if (!in_array($action, $actions)) {
        echo json_encode(['success' => false, 'message' => 'invalid action']);
        exit();
    }

    try {
        switch ($action) {
            case 'signup':
                $name = $_POST['userName'];
                $email = $_POST['email'];
                $password = $_POST['password'];

                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                $userModel->createUser($name, $email, $passwordHash);
                echo json_encode(['success' => true, 'message' => 'User registered successfully']);
                break;

            case 'login':
                $email = $_POST['email'];
                $password = $_POST['password'];
                
                if ($userModel->authUser($email, $password)) {
                    echo json_encode(["success" => true, "message" => "user logged successfully"]);
                }
                else {
                    echo json_encode(["success" => false, "message" => "..."]);
                }
                break;
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }