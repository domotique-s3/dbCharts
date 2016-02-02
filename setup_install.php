<?php

	print("--- DBCHARTS SETUP --- \n\n");

	print("\nEnter the path to dbData : ");

	if (PHP_OS == 'WINNT') {
		$dbData_path = stream_get_line(STDIN, 1024, PHP_EOL);
	} else {
		$dbData_path = readline();
	}

	$toPrint = array('path' => $dbData_path);


	if(is_file("config.json")){
		unlink("config.json");
	}

	$file = fopen('config.json', 'w');
	fwrite($file, json_encode($toPrint));



?>