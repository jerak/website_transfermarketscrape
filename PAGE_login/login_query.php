<?php
	include_once('../database_connection_documents/database_connection_playerscores.php');

	$username = json_decode(stripslashes($_POST['username']));
	$password = json_decode(stripslashes($_POST['password']));
	$buttonclicked = json_decode(stripslashes($_POST['buttonclicked']));

	//Reason why all in array is because JSON does not seem to be able to send variables (but array it does)
	$returntext = array();
	$websitehref = array();
	$username_array = array();
	$password_array = array();

	$sql_login = "SELECT deelnemerpunten FROM `deelnemerdatabase` WHERE deelnemernaam ='$username' AND wachtwoord = '$password'";
	$sql_register = "INSERT INTO deelnemerdatabase (deelnemernaam, deelnemerpunten, wachtwoord) VALUES ('$username', 0, '$password')";

	if($username != "" && $password != ""){
		if ($buttonclicked === "login"){
			$sql_result = mysqli_query($conn, $sql_login);
			if($sql_result != false && mysqli_num_rows($sql_result) > 0){
				//Redirects to new page after the above code has run
				//header('Location: http://localhost/website_transfermarketscrape/team_new.html');
				$returntext[] = "success";
				$websitehref[] = "http://localhost/website_transfermarketscrape_umbrella_folder/PAGE_team/team_new.html";
				$username_array[] = $username;
				$password_array[] = $password;

			}else{
   				$returntext[] = "notfound";

			}
		} else if($buttonclicked === "register"){
			mysqli_query($conn, $sql_register);
			$returntext[] = "register";
		}
	}else{
		$returntext[] = "emptyfields";
		//echo  "Empty fields!";
	}
	echo json_encode(array('returntext'=>$returntext, 'websitehref'=>$websitehref, 'username'=>$username_array, 'password'=>$password_array));

?>

