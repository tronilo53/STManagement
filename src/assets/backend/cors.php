<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Allow: GET, POST, OPTIONS, PUT, DELETE");

	// Manejo de solicitudes OPTIONS
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	    http_response_code(200);
	    exit();
	}
?>