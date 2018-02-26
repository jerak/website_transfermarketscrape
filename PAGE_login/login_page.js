function span_wachtwoord(){
	document.getElementById('span_wachtwoord').innerHTML = "Clicked!";
}



$('.form_buttons').click(function(){

	var username = JSON.stringify($('form').find('input[name="username"]').val());
	var password = JSON.stringify($('form').find('input[name="password"]').val());
	var buttonclicked = JSON.stringify($(this)[0].name);

        $.ajax({
            type: 'POST',
            url: 'login_query.php',
            data: { username: username, 
                    password: password,
                	buttonclicked: buttonclicked},
            dataType: 'json',
            error: function(response){console.log(JSON.stringify(response));},
            success: function(data){
            	if(data.returntext[0] === "success"){
            		
       				var account = {
    					username: data.username,
     					password: data.password,
   					};
					//converts to JSON string the Object
					account = JSON.stringify(account);
					//creates a base-64 encoded ASCII string
					account = btoa(account);
					//save the encoded accout to web storage
					localStorage.setItem('account', account);

					window.location= data.websitehref[0]; 		

            	}else if(data.returntext[0] === "notfound"){
            		document.getElementById('div_incorrect_credentials').style.display = 'block';
					document.getElementById('div_incorrect_credentials').style.backgroundColor = 'red';
            		document.getElementById('div_incorrect_credentials').innerHTML = 'Incorrect username or password';
            	}else if(data.returntext[0] === "register"){
					document.getElementById('div_incorrect_credentials').style.display = 'block';
					document.getElementById('div_incorrect_credentials').style.backgroundColor = 'green';
            		document.getElementById('div_incorrect_credentials').innerHTML = 'Registered, you can now log in!';
            	}else if(data.returntext[0] === "emptyfields"){
            		document.getElementById('div_incorrect_credentials').style.display = 'block';
					document.getElementById('div_incorrect_credentials').style.backgroundColor = 'red';
            		document.getElementById('div_incorrect_credentials').innerHTML = 'Empty fields!';
            	}
            }

        });
        return false;
 }); 

