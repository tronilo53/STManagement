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
		//OBTENER TODOS LOS COMPONENTES
		case '006':
			$stmt = $pdo -> prepare('SELECT * FROM componentes');
			$stmt -> execute();
			$res = $stmt -> fetchAll(PDO::FETCH_ASSOC);
		break;
		//OBTENER TODOS LOS COMPONENTES FILTRADOS
		case '007':
			$stmt = $pdo -> prepare('SELECT * FROM componentes WHERE categoria = ?');
			$stmt -> execute([ $params->categoria ]);
			$res = $stmt -> fetchAll(PDO::FETCH_ASSOC);
		break;
		//OBTENER TODOS LOS APARATOS
		case '008':
			$stmt = $pdo -> prepare('SELECT * FROM aparatos');
			$stmt -> execute();
			$res = $stmt -> fetchAll(PDO::FETCH_ASSOC);
		break;
		//OBTENER TODOS LOS APARATOS FILTRADOS
		case '009':
			$stmt = $pdo -> prepare('SELECT * FROM aparatos WHERE categoria = ?');
			$stmt -> execute([ $params->categoria ]);
			$res = $stmt -> fetchAll(PDO::FETCH_ASSOC);
		break;
		//AGREGAR NUEVO APARATO
		case '010':
			$stmt = $pdo -> prepare('SELECT COUNT(*) FROM aparatos WHERE codigo = ?');
			$stmt -> execute([ $params->data->codigo ]);
			if($stmt -> fetchColumn() > 0) $res = ['response' => '002'];
			else {
				$stmt = $pdo -> prepare('INSERT INTO aparatos (codigo, categoria, imagen) VALUES (?,?,?)');
				$stmt -> execute([ $params->data->codigo, $params->data->categoria, $params->data->imagen ]);
				if($stmt) $res = ['response' => '001'];
				else $res = ['response' => '003'];
			}
		break;
		//AGREGAR NUEVO COMPONENTE
		case '011':
			//Si es un componente nuevo...
			if($params->data->nombre !== '') {
				//Comprobamos que el nombre no exista
				$stmt = $pdo -> prepare('SELECT COUNT(*) FROM componentes WHERE nombre = ?');
				$stmt -> execute([ $params->data->nombre ]);
				//Si el nombre ya existe...
				if($stmt -> fetchColumn() > 0) $res = ['response' => '001'];
				//Si el nombre no existe...
				else {
					$stmt = $pdo -> prepare('INSERT INTO componentes (nombre, referencias, categoria, cantidad) VALUES (?,?,?,?)');
					$stmt -> execute([ $params->data->nombre, $params->data->referencias, $params->data->categoria, $params->data->cantidad ]);
					//Si el componente se inserta con éxito...
					if($stmt) $res = ['response' => '002'];
					//Si el componente no se inserta
					else $res = ['response' => '003'];
				}
			//Si es un componente existente...
			}else {
				//Se obtiene el componente
				$stmt = $pdo -> prepare('SELECT * FROM componentes WHERE id = ?');
				$stmt -> execute([ $params->data->id ]);
				//Se guarda el componente
				$row = $stmt -> fetch(PDO::FETCH_ASSOC);
				//Se parsean las referencias tanto pasadas como existentes del componente
				$referencias_nuevas = json_decode($params->data->referencias, true);
				$referencias_existentes = json_decode($row['referencias'], true);
				//Se fusionan las referencias y se convierten a string las haya o no las haya
				$referencias_fusionadas = json_encode(array_merge($referencias_existentes, $referencias_nuevas));
				//Se suman las cantidades
				$cantidad_nueva = $row['cantidad'] + $params->data->cantidad;
				//Se actualiza el componente con los nuevos datos
				$stmt = $pdo -> prepare('UPDATE componentes SET referencias = ?, cantidad = ? WHERE id = ?');
				$stmt -> execute([ $referencias_fusionadas, $cantidad_nueva, $params->data->id ]);
				//Si se actualiza correctamente...
				if($stmt) $res = ['response' => '004'];
				else $res = ['response' => '005'];
			}
		break;
	}

	header('Content-Type: application/json');

	echo json_encode($res);

?>