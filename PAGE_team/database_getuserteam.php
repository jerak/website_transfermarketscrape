<?php
	include_once('..\database_connection_documents\database_connection_playerscores.php');
	mysqli_query($conn, "SET NAMES utf8");

	if ($conn->connect_error) {
   		die("Connection failed: " . $conn->connect_error);
	}

	$username = json_decode(stripslashes($_POST['username']));
	$password = json_decode(stripslashes($_POST['password']));

	//With username but without password
	$sql_selectparticipantsteams = "SELECT * FROM deelnemerteamsgf WHERE deelnemernaam = '" .$username. "'";
	//With username and password
	//$sql_selectparticipantsteams = "SELECT * FROM deelnemerteamsgf WHERE deelnemernaam = '" .$username. "' AND password = '" .$password. "'";


	$sql_result = mysqli_query($conn, $sql_selectparticipantsteams);

	$array_participantlistteam = array();

	while ($row = $sql_result->fetch_assoc()){
		$array_participantlistteam[] = $row['dm'];
		$array_participantlistteam[] = $row['la'];
		$array_participantlistteam[] = $row['lcv'];
		$array_participantlistteam[] = $row['rcv'];
		$array_participantlistteam[] = $row['ra'];
		$array_participantlistteam[] = $row['lm'];
		$array_participantlistteam[] = $row['cm'];
		$array_participantlistteam[] = $row['rm'];
		$array_participantlistteam[] = $row['lb'];
		$array_participantlistteam[] = $row['sp'];
		$array_participantlistteam[] = $row['rb'];
	}
	
	echo json_encode(array('participantlistteam'=>$array_participantlistteam));


?>