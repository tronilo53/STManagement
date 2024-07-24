<?php

	require "cors.php";
	require "connection.php";

	$json = file_get_contents('php://input');
	$params = json_decode($json);

	switch ($params->code) {
		//INSERTAR NUEVO USUARIO (ZONA ADMIN)
		case '001':
			//Comprueba si existe el usuario
			$stmt = $pdo -> prepare('SELECT COUNT(*) FROM usuarios WHERE nombre_usuario = ?');
			$stmt -> execute([ $params->data->nombre_usuario ]);
			//Si existe el usuario Se manda la respuesta
			if($stmt -> fetchColumn() > 0) $res = ['response' => '001'];
			//Si no existe el usuario...
			else {
				//Se encripta la contraseña
				$password_encrypt = password_hash($params->data->clave, PASSWORD_DEFAULT);
				//Se inserta el usuario
				$stmt = $pdo -> prepare('INSERT INTO usuarios (nombre, nombre_usuario, clave) VALUES (?,?,?)');
				$stmt -> execute([ $params->data->nombre, $params->data->nombre_usuario, $password_encrypt ]);
				//Si el usuario se inserta correctamente...
				if($stmt) $res = ['response' => '002'];
				//Si el usuario no se inserta correctamente...
				else $res = ['response' => '003'];
			}
		break;
		//OBTENER TODOS LOS USUARIOS
		case '002':
			//Obtiene todos los usuarios
			$stmt = $pdo -> prepare('SELECT * FROM usuarios');
			$stmt -> execute();
			$res = $stmt -> fetchAll(PDO::FETCH_ASSOC);
		break;
		//HABILITAR O DESHABILITAR EL USUARIO
		case '003':
			//Usuario deshabilitado por defecto
			$habilitada = 'N';
			//Si se habilita el usuario se cambia la variable '$habilitada' a 'S'
			if($params->data->checked) $habilitada = 'S';
			//Se modifica el usuario
			$stmt = $pdo -> prepare('UPDATE usuarios SET habilitada = ? WHERE id = ?');
			$stmt -> execute([ $habilitada, $params->data->id ]);
			//Si se modifica el usuario...
			if($stmt) $res = ['response' => '001' . $habilitada];
			//Si no se modifica el usuario...
			else $res = ['response' => '002'];
		break;
		//INICIAR SESIÓN
		case '004':
			//Comprueba que exista el usuario
			$stmt = $pdo -> prepare('SELECT COUNT(*) FROM usuarios WHERE nombre_usuario = ?');
			$stmt -> execute([ $params->data->nombre_usuario ]);
			//Si el usuario existe...
			if($stmt -> fetchColumn() > 0) {
				//Se seleccionan todos los campos del usuario
				$stmt = $pdo -> prepare('SELECT * FROM usuarios WHERE nombre_usuario = ?');
				$stmt -> execute([ $params->data->nombre_usuario ]);
				//Se recorren todos los campos
				foreach ($stmt -> fetchAll() as $rows) {
					//Si la contraseña coincide...
					if(password_verify($params->data->clave, $rows['clave'])) {
						//Si la cuenta está habilitada...
						if($rows['habilitada'] === 'S') {
							$res = [
								'response' => '001', 
								'data' => [
									'nombre' => $rows['nombre'],
									'nombre_usuario' => $rows['nombre_usuario'],
									'avatar' => $rows['avatar'],
									'tema' => $rows['tema'],
									'tipo_usuario' => $rows['tipo_usuario']
								]
							];
						//Si la cuenta no está habilitada...
						}else $res = ['response' => '004'];
					//Si la contraseña no coincide...
					}else $res = ['response' => '003'];
				}
			//Si el usuario no existe...
			}else $res = ['response' => '002'];
		break;
		//CAMBIO DE AVATAR O TEMA
		case '005':
			//Si es avatar...
			if($params->data->item === 'avatar') {
				//Actualiza el avatar
				$stmt = $pdo -> prepare('UPDATE usuarios SET avatar = ? WHERE nombre_usuario = ?');
				$stmt -> execute([ $params->data->avatar, $params->data->nombre_usuario ]);
			//Si es tema...
			}else {
				//Actualiza el tema
				$stmt = $pdo -> prepare('UPDATE usuarios SET tema = ? WHERE nombre_usuario = ?');
				$stmt -> execute([ $params->data->tema, $params->data->nombre_usuario ]);
			}
			//Si se actualiza correctamente...
			if($stmt) $res = ['response' => '001'];
			//Si no se actualiza...
			else $res = ['response' => '002'];
		break;
	}

	header('Content-Type: application/json');

	echo json_encode($res);

?>