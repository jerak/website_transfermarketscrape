<?php
	include_once('database_connection.php');
	
	$username =  $_POST['username'];
	$password =  $_POST['password'];
		
	$sql_login = "SELECT deelnemerpunten FROM `deelnemerdatabase` WHERE deelnemernaam ='$username' AND password = '$password'";
	$sql_register = "INSERT INTO deelnemerdatabase (deelnemernaam, deelnemerpunten, password) VALUES ('$username', 0, '$password')";
		
	if($username != "" && $password != ""){
		if (isset($_POST['login'])){
			$sql_result = mysqli_query($conn, $sql_login);
			if(mysqli_num_rows($sql_result) > 0)
				echo "Succesfully found user";
			else
				echo "User not found in database";
		} else if(isset($_POST['register'])){
			mysqli_query($conn, $sql_register);
			echo "Succesfully registered";
		}
	}else{
		echo "Empty fields!";
	}
	
	//Redirects to new page after the above code has run
	header('Location: http://localhost/main_dashboard.html');

			
?>