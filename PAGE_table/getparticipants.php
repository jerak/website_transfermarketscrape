<?php
	include_once('..\database_connection_documents\database_connection_playerscores.php');

	$sql_selectparticipants = "SELECT * FROM deelnemerdatabase ORDER BY deelnemerpunten DESC, deelnemernaam ASC" ;
	mysqli_query($conn, "SET NAMES utf8");

	$sql_result = mysqli_query($conn, $sql_selectparticipants);

	if ($conn->connect_error) {
   		die("Connection failed: " . $conn->connect_error);
	}

	$array_participantlist = array();
	$array_participantpunten = array();

	while ($row = $sql_result->fetch_assoc()){
		$array_participantlist[] = $row['deelnemernaam'];
		$array_participantpunten[] = $row['deelnemerpunten'];
	}

	echo json_encode(array('participantlist'=>$array_participantlist, 'participantpunten'=>$array_participantpunten));


?>