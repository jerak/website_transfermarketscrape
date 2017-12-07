<?php
	include_once('database_connection.php');



	$sql_selectplayers = SELECT * FROM spelers WHERE waarde > 15000000 ;


	$sql_result = mysqli_query($conn, $sql_selectplayers);


	if($sql_result->num_rows > 0){
		echo "Players selected";
	}

	echo "done";
	header('Location: http://localhost/website_transfermarketscrape/main.html');

?>