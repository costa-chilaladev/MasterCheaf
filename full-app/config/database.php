<?php
    $host = "localhost";
    $dbname = "mastercheaf_aoa";
    $user = "root";
    $pass = "";

    // Criamos a conexão apenas uma vez
    $connect = new mysqli($host, $user, $pass, $dbname);

    // Verifica se houve erro
    if ($connect->connect_error) {
        die("Falha na conexão: " . $connect->connect_error);
    }

    // Define o charset para evitar problemas com acentos
    $connect->set_charset("utf8");
