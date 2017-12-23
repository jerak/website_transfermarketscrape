<?php
	include_once('..\website_transfermarketscrape\database_connection.php');
	mysqli_query($conn, "SET NAMES utf8");

	if ($conn->connect_error) {
   		die("Connection failed: " . $conn->connect_error);
	}

	$managername = json_decode(stripslashes($_POST['managername']));
	$password = json_decode(stripslashes($_POST['password']));
	$datafromjavascript = json_decode(stripslashes($_POST['selectedplayers']));

	$array_jersey_positions_names = ['dm','la','lcv','rcv','ra','lm','cm','rm','lb','sp','rb'];
	$array_positions = [];
	foreach($array_jersey_positions_names as $position){
		foreach($datafromjavascript as $arrays){
			if($position == $arrays[3]){
				array_push($array_positions, array($arrays[0], $arrays[1], $arrays[2], $arrays[3]));
			}
		}
	}

	$dm = $array_positions[0][0] . ' (' . $array_positions[0][2] . ')';
	$la = $array_positions[1][0] . ' (' . $array_positions[1][2] . ')';
	$lcv = $array_positions[2][0] . ' (' . $array_positions[2][2] . ')';
	$rcv = $array_positions[3][0] . ' (' . $array_positions[3][2] . ')';
	$ra = $array_positions[4][0] . ' (' . $array_positions[4][2] . ')';
	$lm = $array_positions[5][0] . ' (' . $array_positions[5][2] . ')';
	$cm = $array_positions[6][0] . ' (' . $array_positions[6][2] . ')';
	$rm = $array_positions[7][0] . ' (' . $array_positions[7][2] . ')';
	$lb = $array_positions[8][0] . ' (' . $array_positions[8][2] . ')';
	$sp = $array_positions[9][0] . ' (' . $array_positions[9][2] . ')';
	$rb = $array_positions[10][0] . ' (' . $array_positions[10][2] . ')';

	$sql_insert = "INSERT INTO deelnemerteamsgf(deelnemernaam, password, dm, la, lcv, rcv, ra, lm, cm, rm, lb, sp, rb) VALUES ('$managername', '$password', '$dm', '$la', '$lcv', '$rcv', '$ra', '$lm', '$cm', '$rm', '$lb', '$sp', '$rb')" ;
   	mysqli_query($conn, $sql_insert);
	

  
?>