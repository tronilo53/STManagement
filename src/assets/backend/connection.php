<?php

	require "config.php";

	$con = "mysql:host=$db_host;dbname=$db_name;charset=utf8";

	$pdo = new PDO($con, $db_user, $db_pass);

?>