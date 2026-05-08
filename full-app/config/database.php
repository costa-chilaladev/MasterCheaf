<?php
    $host = "localhost";
    $dbname = "mastercheaf_aoa";
    $user = "root";
    $pass = "";

    // Criamos a conexão apenas uma vez
    $connect = new mysqli($host, $user, $pass, $dbname);

    // Check for a connection error
    if ($connect->connect_error) {
        die("Connection failed: " . $connect->connect_error);
    }

    // Define o charset para evitar problemas com acentos
    $connect->set_charset("utf8");
