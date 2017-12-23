<?php
	include_once('..\website_transfermarketscrape\database_connection.php');


	$sql_selectplayers = "SELECT * FROM spelers ORDER BY waarde DESC" ;
	mysqli_query($conn, "SET NAMES utf8");


	$sql_result = mysqli_query($conn, $sql_selectplayers);

	if ($conn->connect_error) {
   		die("Connection failed: " . $conn->connect_error);
	}	

	$array_playerslist = array();
	$array_playerscountry = array();
	$array_playersclub = array();
	$array_playerspositie = array();
	$array_playerswaarde = array();

	while ($row = $sql_result->fetch_assoc()){
		$array_playerslist[] = $row['naam'];
		$array_playerscountry[] = $row['land'];
		$array_playersclub[] = $row['club'];
		$array_playerspositie[] = $row['positie'];	
		$array_playerswaarde[] = $row['waarde'];	

	}

	
	$sql_selectgoals = "SELECT * FROM spelergoals WHERE goals > 0";
	$sql_result_goals = mysqli_query($conn, $sql_selectgoals);

	$array_playersgoals = array();


	foreach($array_playerslist as $player){
		$already_added_goals_for_player = false;

		while ($row = $sql_result_goals->fetch_assoc()){
			if($row['naam'] === $player){
				$array_playersgoals[] = $row['goals'];
				//reset fetch_assoc back to before first result row (else it continues where it stopped)
				mysqli_data_seek($sql_result_goals, 0);
				$already_added_goals_for_player = true;
				break;
			}
		}

		mysqli_data_seek($sql_result_goals, 0);

		//if not yet added goals for this $player then he has scored no goals
		if($already_added_goals_for_player === false){
			$array_playersgoals[] = "0";
		}
	}


	$sql_selectpoints = "SELECT * FROM spelerpuntentotaal";
	$sql_result_points = mysqli_query($conn, $sql_selectpoints);

	$array_playerspoints = array();

	foreach($array_playerslist as $player){
		while ($row = $sql_result_points->fetch_assoc()){
			if($row['naam'] === $player){
				$array_playerspoints[] = $row['punten'];
				//reset fetch_assoc back to before first result row (else it continues where it stopped)
				mysqli_data_seek($sql_result_points, 0);
				break;
			}
		}
	}


	echo json_encode(array('playerslist'=>$array_playerslist, 'playerscountry'=>$array_playerscountry, 'playersclub'=>$array_playersclub, 'playerspositie'=>$array_playerspositie, 'playerswaarde'=>$array_playerswaarde, 'playersgoals'=>$array_playersgoals, 'playerspoints'=>$array_playerspoints));
	


?>
