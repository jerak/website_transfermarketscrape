//Postion on pitch
var array_jersey_positions = [[6,5],[4,2],[5,3],[5,7],[4,8],[4,4],[3,5],[4,6],[2,4],[2,5],[2,6]];
var array_jersey_positions_names = ['dm','la','lcv','rcv','ra','lm','cm','rm','lb','sp','rb'];
var array_jersey_positions_titles = ['KEEPER','VERDEDIGER','VERDEDIGER','VERDEDIGER','VERDEDIGER','MIDDENVELDER','MIDDENVELDER','MIDDENVELDER','AANVALLER','AANVALLER','AANVALLER'];

//11 cards in HTML and adding 1 card before start sliding
var initial_amount_of_cards = 20;
var marginLeft;

//Arrays to put data in fetched with ajax call
var array_players = [];
var array_player_images = [];
var array_country_images = [];
var array_player_position = [];
var array_player_club_name = [];
var array_player_club_img = [];
var array_player_value = [];
var array_player_goals = [];
var array_player_points = [];
var array_player_country = [];

//Arrays for sorting so the original stays the same
var sortable_array_player_images = [];
var sortable_array_player_club_name = [];
var sortable_array_player_club_img = [];
var sortable_array_player_goals = [];
var sortable_array_player_country = [];

//card to start at (1277 (1278 - 1 in method)) is the first card that is not immediately on screen
var player_counter = 1274;

//Check if cursor is right/left on screen
var cursor_on_image_carrousel_right = false;

//Checks if all methods are done running. Set to true because we first need to fetch data with ajax and place/fill the divs
var running_fillnewplayercard = true;
var running_slideplayercards = true;
var running_addnewplayercard = true;
var running_applySlideEffects = true;

//Variable for filling the pitch
var array_userteamplayers = [];
var array_userteamcountry = [];
//varaiable for the account that is logged into
var accountdetails;

//Variables for the modal 
//countrySelected us to check if currently a country is selected
var countrySelected = "";
//Filters for whether a name, position or waarde has been put in the search boxes
var filter_name  = "";
var filter_positie = "ALLE POSITIES";
var filter_waarde = "";
//Variable for check whether value is ascending or descending
var arrow_down = true;
//variable for only filling modal once
var modal_filled = false;

//Variables for the rules_wrapper
//Players that are yet selected
var array_players_selected = [];
//Total amount that can be used
var total_amount_to_be_used = 70000000;

//Methods to be run as soon as the webpage is opened
$(document).ready(function(){
	//Load the team of the one that logs in
	if (localStorage.getItem('account') != null) {
  		getTeamofUser();
	} else if (localStorage.getItem('team') != null){
		var team = localStorage.getItem('team');
		localStorage.removeItem('team');

		//decodes a string data encoded using base-64
	   	team = atob(team);
	   	//parses to Object the JSON string
	   	team = JSON.parse(team);

	   	array_userteamplayers = team.userteamplayers;
		array_userteamcountry = team.userteamcountry;
	}
	//Places the divs initially on screen (because position is absolute)
	placeinitialdivs();
	//Get the data from Ajax call
	getPlayers();
});


//Draws/Fills the table which is positioned over the pitch image
function drawtableonpitch(array_userteamplayers, array_userteamcountry){
	
	//Draw table rows and table data	
	for(i = 0; i < 10; i++){
		$('#table_on_pitch').append('<tr class="pitch_table_rows"></tr>');
	}
	for(j = 0; j < 11; j++){
		$('.pitch_table_rows').append('<td></td>');
	}

	//For each position (keeper, striker etc) we create an image and 2 divs (name of player and value) and add it to its table cell
	for(i = 0; i < array_jersey_positions.length; i++){
		var table = document.getElementById("table_on_pitch");
		var table_row = table.getElementsByTagName('tr')[array_jersey_positions[i][0]];
		var table_data = table_row.getElementsByTagName('td')[array_jersey_positions[i][1]];
		var img = document.createElement("img");
		img.classList.add('test_jersey');
		
		if(array_userteamcountry.length > 0){
	        img.src = "../Team_Shirts/" + array_userteamcountry[i] + ".png";
		}else{
			img.src = "../Team_Shirts/Plain Shirt.png";
		}

		img.value = array_jersey_positions_names[i];
		img.title = array_jersey_positions_titles[i];

		table_data.appendChild(img);

		var div_name = document.createElement("div");
		div_name.classList.add('name_under_jersey');

		var div_value = document.createElement("div");
		div_value.classList.add('value_under_jersey');



		if(array_userteamcountry.length > 0){
			div_name.innerHTML = array_players_selected[i][0];
			div_value.innerHTML = array_players_selected[i][1];
		}
		
		table_data.appendChild(div_name);	
		table_data.appendChild(div_value);		
	}
}

//function that seperates the player and country--> thus Robin van Persie (Netherlands) becomes Robin van Persie (array1) and Netherlands (array2)
function seperateplayerandcountry(array_userteam){
    
    for(i = 0; i < array_userteam.length; i++){
        var playerString = array_userteam[i].replace(/ *\([^)]*\) */g, "");
        var countryString = array_userteam[i].replace( /(^.*\(|\).*$)/g, '' );

        array_userteamplayers.push(playerString);
        array_userteamcountry.push(countryString);
    }
    
}

function getTeamofUser(){
	var array_userteam = [];
	accountdetails = localStorage.getItem('account');
	localStorage.removeItem('account');

	//decodes a string data encoded using base-64
   	accountdetails = atob(accountdetails);
   	//parses to Object the JSON string
   	accountdetails = JSON.parse(accountdetails);

    var usernameJSON = JSON.stringify(accountdetails.username[0]);
    var passwordJSON = JSON.stringify(accountdetails.password[0]);

    $.ajax({
            type: 'POST',
            url: 'database_getuserteam.php',
            data: {username: usernameJSON, password: passwordJSON},
            dataType: 'json',
            error: function(response) { alert(JSON.stringify(response))},

            success: function(data){
                $.each(data.participantlistteam, function(key, value){
                    array_userteam.push(data.participantlistteam[key]);
                });

                //Run method so player and country gets seperated --> Robin van Persie (Netherlands) becomes Robin van Persie (array1) and Netherlands (array2)
                seperateplayerandcountry(array_userteam);
            }
        });

}

//Places the initial divs that have an absolute position thus needs loop to place
function placeinitialdivs(){
	var playercardsimages = $('.player_card_carrousel_img');


	for(i = playercardsimages.length-1, height_counter = 5, imageheight_counter = 1, zindexcounter = 0; i >= 0; i--){
		//Just a way to roughly calculate positions of the cards
		var marginLeft = -(screen.width/4) + (document.getElementsByClassName('player_card_carrousel')[10].offsetWidth/1.6);
		marginLeft = marginLeft + (i * 100);

		//Define the place of each intial card (with margin left)
		$('#n' + player_counter + '_playercard').css("margin-left", marginLeft);

		if(Math.floor((playercardsimages.length/2)) <= i){
			height_counter++;
			imageheight_counter++;
			zindexcounter++;
		}else{
			height_counter--;
			imageheight_counter--;
			zindexcounter--;
		}

		//Height of playercard and its image calculated
		var height = height_counter * 25;
		var imageheight = imageheight_counter * 15;

		//Set height of playercard, image and set z-index
		$('#n' + player_counter + '_playercard').css("height", height);
		playercardsimages[i].style.height = imageheight + "px";
		$('#n' + player_counter + '_playercard').css("zIndex", zindexcounter);


		player_counter++;
		
		//not using array_players.length because ajax call has not been made yet
		if(player_counter === 1283){
			player_counter = 0;
		}
	}

	player_counter = 1274;
}

function getPlayers(){
	$.ajax({
            type: 'POST',
            url: 'ajaxcall_getplayers.php',
            dataType: 'json',
			error: function(response) { alert(JSON.stringify(response))},

            success: function(data){
            	$.each(data.playerslist, function(key, value){
  						array_players.push(data.playerslist[key]);

            			//All data is stored in arraylist but most of it is not used yet! So it is stored with no purpose!
            			var img_player = "/website_transfermarketscrape_umbrella_folder/Player_Images/" + data.playerscountry[key] + " " + data.playerslist[key] + ".jpg";
            			array_player_images.push(img_player);
						sortable_array_player_images.push(img_player);

            			//Data for club name and club image
            			array_player_club_name.push(data.playersclub[key]);
            			sortable_array_player_club_name.push(data.playersclub[key]);
            			var img_club = "/website_transfermarketscrape_umbrella_folder/Club_Logos/" + data.playersclub[key] + ".png";
            			array_player_club_img.push(img_club);
            			sortable_array_player_club_img.push(img_club);

            			var img_country = "/website_transfermarketscrape_umbrella_folder/Country_Images/" + data.playerscountry[key] + ".png";
						array_country_images.push(img_country);
						array_player_position.push(data.playerspositie[key]);

            			//change the notation of the data.playerswaarde[key] --> 2000000 becomes 2.000.000
						var playerswaarde_newnotation = changecurrencynotation(data.playerswaarde[key]);
						array_player_value.push(playerswaarde_newnotation);

						array_player_goals.push(data.playersgoals[key]);
						sortable_array_player_goals.push(data.playersgoals[key]);
						array_player_points.push(data.playerspoints[key]);
						array_player_country.push(data.playerscountry[key]);
						sortable_array_player_country.push(data.playerscountry[key]);
						//$('#container_images').append('<div class="player_card_carrousel"><img class="player_card_carrousel_img" src="' + img_player + '"></img></div>');
            	});
            	//Fill the divs in the playercardlooper
            	initialfillplayercards();
            	//if the user logins in and already chose a team we need to update the array list
            	fillcurrentselectedplayers();
            	//Fill the pitch
                drawtableonpitch(array_userteamplayers, array_userteamcountry);
                //Update the Rules wrapper 
                calculatemoneyleft();
            }
        });
}

//If the user had a team already in the database we need to fill the array_players_selected arraylist accordinly 
function fillcurrentselectedplayers(){
	for(i = 0; i < array_userteamplayers.length; i++){
		for(j = 0; j < array_players.length; j++){
			//compare when player in team is same as player in database if so add its details in arraylist array_players_selected
			if(array_userteamplayers[i] === array_players[j]){
				array_players_selected.push(new Array(array_players[j], array_player_value[j], array_player_country[j], array_jersey_positions_names[i]));
			}
		}
	}
}

//Fill the initially placed div with data from ajax
function initialfillplayercards(){
	var playercarddivs = $('.player_card_carrousel');
	var playercardsimages = $('.player_card_carrousel_img');

	//loop over the cards visible
	for(i = playercardsimages.length-1; i >= 0; i--){
		playercardsimages[i].src = 	array_player_images[player_counter];
		var playercard = $("#n"+ player_counter + "_playercard");

		playercard.append('<img class="playerprofile_arrowleft" src="../other_images/left_arrow.png"></img>');
   		playercard.append('<img class="playerprofile_arrowright" src="../other_images/right_arrow.png"></img>');

		//Append a table to put in name, position, value, club, goals and country
		playercard.append('<table id="table_playerprofile_carrousel"></table>');
    	$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Name: </td></b><td colspan="2">' + array_players[player_counter] +  '</td></tr>');
    	$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Club: </td></b><td><img class="tablerow_playerprofile_carrousel_club_img" src="' + array_player_club_img[player_counter] + '"></img></td><td>' +array_player_club_name[player_counter]+ '</td></tr>');  		
  		$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Position: </td></b><td colspan="2">' +array_player_position[player_counter]+ '</td></tr>');
    	$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Value: </td></b><td colspan="2">' +array_player_value[player_counter]+ '</td></tr>');
		$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Goals: </td></b><td colspan="2">' +array_player_goals[player_counter]+ '</td></tr>');
		$('#n' + player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Country: </td></b><td colspan="2">' +array_player_country[player_counter]+ '</td></tr>');
		
		player_counter++;

		if(player_counter === array_players.length){
			player_counter = 0;
		}
	}

	//Now the interval looper can start (should not start before divs are filled)
	running_fillnewplayercard = false;
	running_slideplayercards = false;
	running_addnewplayercard = false;
	running_applySlideEffects = false;
}


//This function is called with an interval, its basically the beginning of the whole loop
function slideplayercards(player_counter, callback_fillnewplayercard, callback_addnewplayercard, callback_applySlideEffects){
	//console.log(running_fillnewplayercard + " " + running_slideplayercards + " " +  running_addnewplayercard + " " + running_applySlideEffects );

	//Check if a method is still running if answer is yes then we dont run the code inside this if loop
	if(!running_fillnewplayercard && !running_slideplayercards && !running_addnewplayercard && !running_applySlideEffects){
		running_fillnewplayercard = true;
		running_slideplayercards = true;
		running_addnewplayercard = true;
		running_applySlideEffects = true;	

		//The global variable player_counter is copied in a local variable
		var local_player_counter = player_counter;

		//wait until animation is done
		var waitforanimation;

		if(player_counter-1 < 0){
			waitforanimation = 1282;
		}else{
			waitforanimation = player_counter -1;
		}

		//wait until animation is done
		$('#n' + (waitforanimation) + "_playercard").promise().done(function(){
			for(i = 0; i < initial_amount_of_cards; i++, local_player_counter--){
				//if its the first loop, we add a player card (if not we start the animation (in else part)		
				if(i === 0){
					//If cursor is on right side of screen the local_player_counter should be decreased by the amount of cards
					if(cursor_on_image_carrousel_right){
						//recalculate the local_player_counter because if its <0 it should not go to minus but start at 1282 and substract the rest
						if(local_player_counter - initial_amount_of_cards < 0){
							var local_player_counter_left = array_players.length + (local_player_counter - initial_amount_of_cards);
						}else{
							var local_player_counter_left = local_player_counter - initial_amount_of_cards;
						}
						//Run method to add a new playercard
						callback_addnewplayercard(local_player_counter_left);
						local_player_counter--;
						if(local_player_counter < 0){
							local_player_counter = array_players.length-1;	
						}

					//Else we can use the current local_player_counter (which is always +1 compared to the first div, thus rooney (5) is currently on screen local_player_counter is 6)	
					}else{
						callback_addnewplayercard(local_player_counter);
					}

				}else{					
					//If cursor is on right side of screen the divs should move to the left side 
					if(cursor_on_image_carrousel_right){
						if(i != initial_amount_of_cards-1){
							$('#n' + local_player_counter + '_playercard').animate({left: '-=100px'}, {duration: 500, queue: false});																
						}
					//If cursor is not on right side of screen (left side or not in div) the divs move to the right side
					}else{
						$('#n' + local_player_counter + '_playercard').animate({left: '+=100px'}, {duration: 500, queue: false});											
					}
				}

				if(local_player_counter === 0){
					local_player_counter = array_players.length;
				}
			}
			
			//Call the function apply slide effects (which include setting height and blur)
			callback_applySlideEffects(player_counter);
			//Call the function fill new player card (fill the div) this is done after applyslideeffects due the build up of this function
			callback_fillnewplayercard(player_counter);
			
		});
	//the check variable is set to false (this method is done running)
	running_slideplayercards = false;
	}
}

//Add the new player card
function addnewplayercard(local_player_counter){	
	//var marginLeft = -(screen.width/4) + (document.getElementById('n0_playercard').offsetWidth/1.6);
	var marginLeft = -(screen.width/4) + (document.getElementsByClassName('player_card_carrousel')[10].offsetWidth/1.6);

	//if cursor is on left side of screen we need to append (last in row) the div --> append doesnt really matter because absolute position but with relative position this is applicable
	if(cursor_on_image_carrousel_right){
		$('#container_images').append('<div class="player_card_carrousel" id="n' + local_player_counter + "_playercard" + '"></div>'); 
		//Most left placed playercard is the marginLeft, since we add on the right side we need to get the initial amount of cards -2 * 100 to get the position of the most right player card
		var marginLeft = marginLeft + ((initial_amount_of_cards-2) * 100);

		$('#n' + local_player_counter + '_playercard').css("margin-left", marginLeft);
		$('#n' + local_player_counter + '_playercard').addClass('player_card_carrousel_blur');
	//else we need to prepend (first in div) --> append doesnt really matter because absolute position but with relative position this is applicable
	}else{
		$('#container_images').prepend('<div class="player_card_carrousel" id="n' + local_player_counter + "_playercard" + '"></div>');
		//The left margin is the position of the most left playercard, since we are adding on the left this is what the new card gets
		$('#n' + local_player_counter + '_playercard').css("margin-left", marginLeft);
		$('#n' + local_player_counter + '_playercard').addClass('player_card_carrousel_blur');
	}
	//the check variable is set to false (this method is done running)
	running_addnewplayercard = false;
}


$('#container_images').on('click', '.playerprofile_arrowleft', function(){
	window.clearInterval(windowinterval);
	cursor_on_image_carrousel_right = false;
	slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
});

$('#container_images').on('click', '.playerprofile_arrowright', function(){
	window.clearInterval(windowinterval);
	cursor_on_image_carrousel_right = true;
	slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);	
});

//Fill the new player card
function fillnewplayercard(local_player_counter){
		//This if loop set the right local_player_counter because the global variable always ends with the most left (so if we are sliding right we need to substract all cards visible first)		
		if(cursor_on_image_carrousel_right){
			//if the loop reaches the point of 0 it should start at 1282 minus the rest instead of e.g. -4
			if(local_player_counter - initial_amount_of_cards < 0){
				local_player_counter = array_players.length + (local_player_counter - initial_amount_of_cards);
			}else{
				//else we can just substract to get the right local_player_counter
				local_player_counter = local_player_counter - initial_amount_of_cards;
			}
		}

		//Get the player card and image
		var playercard = $("#n"+ local_player_counter + "_playercard");
   		$('#n' + local_player_counter + "_playercard").append('<img class="player_card_carrousel_img" id="n' + local_player_counter + '_playercard_image" src="' +array_player_images[local_player_counter]+ '"></img>');

   		playercard.append('<img class="playerprofile_arrowleft" src="../other_images/left_arrow.png"></img>');
   		playercard.append('<img class="playerprofile_arrowright" src="../other_images/right_arrow.png"></img>');

		playercard.append('<table id="table_playerprofile_carrousel"></table>');

	   	$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Name: </td></b><td colspan="2">' + array_players[local_player_counter] +  '</td></tr>');
   		$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Club: </td></b><td><img class="tablerow_playerprofile_carrousel_club_img" src="' + array_player_club_img[local_player_counter] + '"></img></td></td></b><td>' +array_player_club_name[local_player_counter]+ '</td></tr>');		
		$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Position: </td></b><td colspan="2">' +array_player_position[local_player_counter]+ '</td></tr>');
   		$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Value: </td></b><td colspan="2">' +array_player_value[local_player_counter]+ '</td></tr>');
		$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Goals: </td></b><td colspan="2">' +array_player_goals[local_player_counter]+ '</td></tr>');
		$('#n' + local_player_counter + "_playercard" + ' #table_playerprofile_carrousel').append('<tr class="tablerow_playerprofile_carrousel"><td> <b>Country: </td></b><td colspan="2">' +array_player_country[local_player_counter]+ '</td></tr>');

		$('#n' + local_player_counter + "_playercard_image").css("height", "90px");
	

		//If cursor is on left side of screen first div needs to be removed
		if(cursor_on_image_carrousel_right){
			$('#container_images').children().first().remove();
			player_counter--;
		//Else last div needs to be removed
		}else{
			$('#container_images').children().last().remove();
			player_counter++;
		}


		if(player_counter === array_players.length){
			player_counter = 0;
		} else if(player_counter < 0){
			player_counter = array_players.length - 1;
		}
	//the check variable is set to false (this method is done running)
	running_fillnewplayercard = false;
}

function applySlideEffects(){
	//set the global variable to a local variable
	var local_player_counter = player_counter;

	//Return 12 because the last added div is already there (this method is called after addnewplayercard())
	var playercards = $('.player_card_carrousel');

	if(cursor_on_image_carrousel_right){
		//height 2 lower than 'usually' because 1: the extra div added at the front, 2: the divs should now increase 1 extra (because sliding to the left)
		height_counter = 3;
		imageheight_counter = -1;
	}else{
		height_counter = 5;
		imageheight_counter = 1;
	}

	for(i = playercards.length-1, zindexcounter = 0; i >= 0; i--, local_player_counter--){

		if(((playercards.length/2))< (i)){
			zindexcounter++;
			height_counter++;
			imageheight_counter++;
		
		}else if(i === ((playercards.length/2))){				
			imageheight_counter++;
			height_counter++;
			zindexcounter++;	

			if(!cursor_on_image_carrousel_right){
				if(local_player_counter -1 < 0){
					$('#n' + (array_players.length - 1) + '_playercard').removeClass('player_card_carrousel_blur_fade_in');
					$('#n' + (array_players.length - 1) + '_playercard').addClass('player_card_carrousel_blur_fade_out');
				}else{
					$('#n' + (local_player_counter-1) + '_playercard').removeClass('player_card_carrousel_blur_fade_in');
					$('#n' + (local_player_counter-1) + '_playercard').addClass('player_card_carrousel_blur_fade_out');
				}
				
				$('#n' + (local_player_counter) + '_playercard').addClass('player_card_carrousel_blur_fade_in');
				$('#n' + (local_player_counter) + '_playercard').removeClass('player_card_carrousel_blur');
			}
		}else{
			if(cursor_on_image_carrousel_right && (i === 9 || i === 8)){
				if(i === 8){
					$('#n' + (local_player_counter) + '_playercard').addClass('player_card_carrousel_blur_fade_in');
					$('#n' + (local_player_counter) + '_playercard').removeClass('player_card_carrousel_blur');
				}
				if(i === 9){
					$('#n' + (local_player_counter) + '_playercard').removeClass('player_card_carrousel_blur_fade_in');
					$('#n' + (local_player_counter) + '_playercard').addClass('player_card_carrousel_blur_fade_out');
				}

				imageheight_counter++;
				height_counter++;
				zindexcounter++;
			}else{
				zindexcounter--;
				imageheight_counter--;
				height_counter--;
			}
		}		

		//console.log(local_player_counter);
		//set z-index 
		$('#n' + local_player_counter + '_playercard').css('z-index', zindexcounter);

		//set playercard height
		var height = height_counter * 25;
		$('#n' + local_player_counter + '_playercard').animate({height: height}, {duration: 500, queue: false});

		//set image in playercard height
		var imageheight = imageheight_counter * 15;
		$('#n' + local_player_counter + '_playercard_image').animate({height: imageheight}, {duration: 500, queue: false});

		if(local_player_counter === 0){
			local_player_counter = 1283;
		}


	}

	running_applySlideEffects = false;
}


var cursorPos = {};
function getMousePosition(timeoutMilliSeconds) {	
	//.one ensures it only runs once
    $("#carrousel_container").one("mousemove", function (event) {
        
		cursorPos = {
      	  left: event.pageX,
      	  top: event.pageY
   		};

   		//Get the middle of the screen we use the carrousel_container div to calculate
        var div_center_X = $('#carrousel_container').offset().left + ($(this).width()/2);

        setTimeout("getMousePosition(" + timeoutMilliSeconds + ")", timeoutMilliSeconds);
        
        //if mouse position is on 'currently visible' playercard stop moving left or right
        if(cursorPos.left > div_center_X - ($('.player_card_carrousel').width()/2) && cursorPos.left < div_center_X + ($('.player_card_carrousel').width()/2)){
        	window.clearInterval(windowinterval);
        	//Cursor is not on right side of screen but in middle thus:
        	cursor_on_image_carrousel_right = false;
        	fast_interval_left = false;
        	fast_interval_right = false;
            //if cursor is on right side of screen
        }else if(cursorPos.left >= div_center_X){
	        cursor_on_image_carrousel_right = true;
        	if(fast_interval_right){
        		if(!running_fillnewplayercard && !running_slideplayercards && !running_addnewplayercard && !running_applySlideEffects){		
        			//slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
        		}
     	  		$("#carrousel_container").mouseenter();        		
        	}

	        fast_interval_right = true;
	        fast_interval_left = false;
        //else if cursor is on left side of screen	
        }else{
         	cursor_on_image_carrousel_right = false;       
			if(fast_interval_left){
				if(!running_fillnewplayercard && !running_slideplayercards && !running_addnewplayercard && !running_applySlideEffects){		
        			//slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
        		}
        		$("#carrousel_container").mouseenter();        		
        	}

			fast_interval_left = true
			fast_interval_right = false;
        }
    });
}
getMousePosition(100);

var fast_interval_left = false;
var fast_interval_right = false;

//When mouse enters carrousel_container set variable to true
$("#carrousel_container").mouseenter(function(){
	//Clearing the interval
	window.clearInterval(windowinterval);
	//Setting a new interval which goes faster
	windowinterval = window.setInterval(function(){
		slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
	}, 300);
});

//When mouse leaves carrousel_container set variable to false
$("#carrousel_container").mouseleave(function(){
	//Clearing the interval of mouseenter
	window.clearInterval(windowinterval);

	//Since on mouse enter we cleared the interval and set a new one, we need to clear and set the normal interval again
	windowinterval = window.setInterval(function(){
		slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
	}, 4000);

	cursor_on_image_carrousel_right = false;
	fast_interval_left = false;
	fast_interval_right = false;
});


var windowinterval = window.setInterval(function(){
	slideplayercards(player_counter, fillnewplayercard, addnewplayercard, applySlideEffects);
}, 4000);

//Function called when a jersey on the pitch is clicked
$('#table_on_pitch').on('click', '.test_jersey', function(){
	//Record which jersey is clicked (global variable) so that we can update this jersey when a player is selected
	jerseyclicked = $(this);
	div_name_under_jersey = $(this).siblings()[0];
	div_value_under_jersey = $(this).siblings()[1];

	// Get the modal
	var modal = document.getElementById('myModal');
   	modal.style.display = "block";
	
	//remove the scrollbar of the webpage
	 $('#body').css("overflow-y", "hidden");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
    	modal.style.display = "none";
    	//add the scrollbar of the webpage
    	$('#body').css("overflow-y", "auto");
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
    	if (event.target == modal) {
    	    modal.style.display = "none";
    	    //add the scrollbar of the webpage
    	   	$('#body').css("overflow-y", "auto");
    	}
	}

	//Fill the model with content (countries, players, playercard)
	if(!modal_filled){
		fillmodal();
		modal_filled = true; 
	}
});

//Function to fill the model the moment it is clicked
function fillmodal(){
	$.each(array_players, function(key, value){
		$('.playerdatabase_table').append('<tr class="playerdatabase_rows"><td class="column_country_img"><img src="' + array_country_images[key] + '"></img></td><td class="column_name">' + array_players[key] + '</td><td class="column_positie">' + array_player_position[key] + '</td><td class="column_waarde">' + array_player_value[key] + '</td></tr>');
	});
}

//Function to highlight the rows that have the position that is clicked 
/*function highlightRows(id){
	var tablerows = document.getElementsByClassName('playerdatabase_rows');

	for(i = 1; i < tablerows.length; i++){
		var tabledata_positie = tablerows[i].getElementsByTagName("td")[2];

		if((id === "left-winger" || id === "striker" || id === "right-winger") && tabledata_positie.innerHTML.toUpperCase() === "AANVALLER"){
			tablerows[i].style.opacity = "1";
		}else if((id === "left-midfielder" || id === "centre-midfielder" || id === "right-midfielder") && tabledata_positie.innerHTML.toUpperCase() === "MIDDENVELDER"){
			tablerows[i].style.opacity = "1";	
		}else if((id === "left-back" || id === "left-centre-back" || id === "right-centre-back" || id === "right-back") &&  tabledata_positie.innerHTML.toUpperCase() === "VERDEDIGER"){
			tablerows[i].style.opacity = "1";
		}else if(id === "keeper" && tabledata_positie.innerHTML.toUpperCase() === "KEEPER"){
			tablerows[i].style.opacity = "1";
		}else if(tabledata_positie.innerHTML.toUpperCase() === "ALLE POSITIES"){
			tablerows[i].style.opacity = "1";
		}else{
			tablerows[i].style.opacity = "1";		
		}
	}
}*/

//Fires when the X is clicked in the search fields (for names as well as value)
$('input[type=search]').on('search', function () {
  search(); 
});

//This search function takes care of the search fields names, position and value
function search(){
	var input_name = document.getElementById('column_name_searchbox');
	var input_positie = document.getElementById('column_positie_searchbox');
	var input_waarde = document.getElementById('column_waarde_searchbox');
	filter_name = input_name.value.toUpperCase();
	filter_positie = input_positie.value.toUpperCase();
	filter_waarde = input_waarde.value.toUpperCase();
	var table = document.getElementById('playerdatabase_table');
	var tablerows = document.getElementsByClassName('playerdatabase_rows');
	var odd = true;


	for(i = 1; i < tablerows.length; i++){

		//the number behind corresponds with the column number
		//this takes all the different table data within a certain row (tablerows[i]) and column ([2]/[3] or [4])
		var tabledata_country = tablerows[i].getElementsByTagName('img')[0].src;
		var tabledata_name = tablerows[i].getElementsByTagName("td")[1];
		var tabledata_positie = tablerows[i].getElementsByTagName("td")[2];
		var tabledata_waarde = tablerows[i].getElementsByTagName("td")[3];

		//change the notation of the data.playerswaarde[key] --> €2.000.000,- becomes 2000000
		var tabledata_waarde = changecurrencynotation(tabledata_waarde.innerHTML);
		

		//loop through if names are being searched for
		if(document.activeElement.id === "column_name_searchbox"){	
			if(tabledata_name.innerHTML.toUpperCase().indexOf(filter_name) > -1){
				if(filter_positie === "ALLE POSITIES" || filter_positie === tabledata_positie.innerHTML.toUpperCase()){
					if(filter_waarde === "" || tabledata_waarde <= parseInt(filter_waarde)){
						if(countrySelected === "" || countrySelected === "Earth" || tabledata_country.indexOf(countrySelected) > -1){
							tablerows[i].style.display = "";
						}else{
							tablerows[i].style.display = "none";
						}
					}else{
						tablerows[i].style.display = "none";
					}
				}else{
					tablerows[i].style.display = "none";

				}
			}else{
				tablerows[i].style.display = "none";	
			}
		}


		//loop through if positie are being searched for
		if(document.activeElement.id === "column_positie_searchbox"){	
			if(filter_positie === "ALLE POSITIES" || filter_positie === tabledata_positie.innerHTML.toUpperCase()){
				if(tabledata_name.innerHTML.toUpperCase().indexOf(filter_name) > -1){
					if(filter_waarde === "" || tabledata_waarde <= parseInt(filter_waarde)){
						if(countrySelected === "" || countrySelected === "Earth" || tabledata_country.indexOf(countrySelected) > -1){
							tablerows[i].style.display = "";
						}else{
							tablerows[i].style.display = "none";
						}
					}else{
						tablerows[i].style.display = "none";
					}
				}else{
					tablerows[i].style.display = "none";
				}
			}else{
				tablerows[i].style.display = "none";
			}
		}

		//loop through if names are being searched for
		if(document.activeElement.id === "column_waarde_searchbox"){	
			if(filter_waarde === "" || tabledata_waarde <= parseInt(filter_waarde)){
				if(tabledata_name.innerHTML.toUpperCase().indexOf(filter_name) > -1){
					if(filter_positie === "ALLE POSITIES" || filter_positie === tabledata_positie.innerHTML.toUpperCase()){
						if(countrySelected === "" || countrySelected === "Earth" || tabledata_country.indexOf(countrySelected) > -1){
							tablerows[i].style.display = "";
						}else{
							tablerows[i].style.display = "none";
						}
					}else{
						tablerows[i].style.display = "none";
					}
				}else{
					tablerows[i].style.display = "none";
				}
			}else{
				tablerows[i].style.display = "none";
			}
		}

		//Reset the odd/even background 
		if(tablerows[i].style.display === ""){
			if(odd){
				tablerows[i].style.background = "rgba(211,211,211, 0.2)";
				odd = false;
			}else{
				tablerows[i].style.background = "rgba(211,211,211, 0.25)";	
				odd = true;			
			}
		}
	}
}

//Function called when the arrow is clicked in the value search bar
$('#column_waarde_sort').click(function(){
	var table = document.getElementsByClassName('playerdatabase_table')[0];
	var tablerows = document.getElementsByClassName('playerdatabase_rows');
	
	for(i = tablerows.length-1; i > 0; i--){
		table.appendChild(tablerows[i]);	
		moveArrayAround(sortable_array_player_images, array_player_images.length, array_player_images.length, tablerows.length-i-1);
		moveArrayAround(sortable_array_player_club_name, array_player_club_name.length, array_player_club_name.length, tablerows.length-i-1);
		moveArrayAround(sortable_array_player_club_img, array_player_club_img.length, array_player_club_img.length, tablerows.length-i-1);
		moveArrayAround(sortable_array_player_goals, array_player_goals.length, array_player_goals.length, tablerows.length-i-1);
		moveArrayAround(sortable_array_player_country, array_player_country.length, array_player_country.length, tablerows.length-i-1);
	}


	if(arrow_down){
		$('#column_waarde_sort').css("transform", "rotate(-135deg)");
		$('#column_waarde_sort').css({WebkitTransform: 'rotate(-135deg)'});
		arrow_down = false;
	}else{
		$('#column_waarde_sort').css("transform", "rotate(45deg)");
		$('#column_waarde_sort').css({WebkitTransform: 'rotate(45deg)'});
		arrow_down = true;		
	}
});

function moveArrayAround(array, arrayLength, oldIndex, newIndex){
		array.splice(newIndex, 0, array[oldIndex-1]);
		array.splice(arrayLength, 1);
		return array;
}


//Function called when the country flags are clicked
$('.countrydatabase_table').click(function(event){
	var country_clicked;

	//A user can click the image or the div in which the image is placed(>userfriendly) 
	//Sets the value of the image to country_clicked (e.g. country_clicked = 'Argentina')
	if($(event.target).is('td')){
		country_clicked = $(event.target).children('img').attr('value');
	}else if($(event.target).is('img')){
		country_clicked = $(event.target).attr('value');
	}else{
		//If space in between is clicked (nothing) then we just end the function
		return;
	}

 	//Get all the tablerows 
 	//Set the global variable countrySelected to the current clicked country 
 	//Creates var called odd used for setting backgroundcolor 
	var tablerows = document.getElementsByClassName('playerdatabase_rows');
	countrySelected = country_clicked;
	var odd = true;

	//Set background of all table data to white first
	 $('.countrydatabase_table tr td').css("background-color", "transparent");
	 //Set background of the one clicked to a certain color
	 $(".countrydatabase_table tr td img[value='" + country_clicked + "']").parent('td').css("background-color", "grey");

	 //Loop over all table rows
	for(i = 1; i < tablerows.length; i++){
		//Get information in each column of each table row (the numbers behind correspond to the column row)
		var countrylinks = tablerows[i].getElementsByTagName('img')[0].src;
		var tabledata_name = tablerows[i].getElementsByTagName("td")[1];
		var tabledata_positie = tablerows[i].getElementsByTagName("td")[2];
		var tabledata_waarde = tablerows[i].getElementsByTagName("td")[3];

		//change the notation of the data.playerswaarde[key] --> €2.000.000,- becomes 2000000
		var tabledata_waarde = changecurrencynotation(tabledata_waarde.innerHTML);
		
		//If earth image is clicked then loop then we dont loop over the clicked country
		if(country_clicked === "Earth"){
			if(tabledata_name.innerHTML.toUpperCase().indexOf(filter_name) > -1){
				if(filter_positie === "ALLE POSITIES" || filter_positie === tabledata_positie.innerHTML.toUpperCase()){
					if(filter_waarde === "" || tabledata_waarde <= parseInt(filter_waarde)){
						tablerows[i].style.display = "";
					}else{
						tablerows[i].style.display = "none";
					}
				}else{
					tablerows[i].style.display = "none";
				}
			}else{
				tablerows[i].style.display = "none";
			}
		//Else if a specific country is clicked we also check if the img corresponds with the clicked country
		}else{
			if(countrylinks.indexOf(country_clicked) > -1){
				if(tabledata_name.innerHTML.toUpperCase().indexOf(filter_name) > -1){
					if(filter_positie === "ALLE POSITIES" || filter_positie === tabledata_positie.innerHTML.toUpperCase()){
						if(filter_waarde === "" || tabledata_waarde <= parseInt(filter_waarde)){
							tablerows[i].style.display = "";
						}else{
							tablerows[i].style.display = "none";
						}
					}else{
						tablerows[i].style.display = "none";
					}
				}else{
					tablerows[i].style.display = "none";
				}
			}else{
				tablerows[i].style.display = "none";
			}			
		}	
		
		//Reset the odd/even background 
		if(tablerows[i].style.display === ""){
			if(odd){
				tablerows[i].style.background = "rgba(211,211,211, 0.2)";
				odd = false;
			}else{
				tablerows[i].style.background = "rgba(211,211,211, 0.25)";	
				odd = true;			
			}
		}
	}
});

//When a row is clicked inside the table get players details
$(document).on('click', '.playerdatabase_rows', function() {

	//Make a variable of the row clicked and get the amount of table rows
   	var rowclicked = $(this).children('td');
   	var tablerows = document.getElementsByClassName('playerdatabase_rows');

   	//Loop over all table rows
	for(j = 1; j < tablerows.length; j++){
		//Get variables of the player
		var tabledata_name = tablerows[j].getElementsByTagName("td")[1];
		var tabledata_positie = tablerows[j].getElementsByTagName("td")[2];
		var tabledata_waarde = tablerows[j].getElementsByTagName("td")[3];			

		//If the name and position of the player is equal to the name and position of the player clicked then fill the playercard with its details
		if(rowclicked[1] === tabledata_name && rowclicked[2] === tabledata_positie){
			$('#playerprofile').empty();
			$('#playerprofile').append('<div class="playerprofile_img"><img src="' +sortable_array_player_images[j -1]+ '"></img></div>');
			$('#playerprofile').append('<table id="table_playerprofile"></table>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Name: </td></b><td colspan="2">' + tabledata_name.innerHTML +  '</td></tr>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Club: </td></b><td><img class="tablerow_playerprofile_club_img" src="' + sortable_array_player_club_img[j-1] + '"></img></td><td>' + sortable_array_player_club_name[j-1]+ '</td></tr>');
  			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Position: </td></b><td colspan="2">' +tabledata_positie.innerHTML+ '</td></tr>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Value: </td></b><td colspan="2">' +tabledata_waarde.innerHTML+ '</td></tr>');
			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Goals: </td></b><td colspan="2">' +sortable_array_player_goals[j-1]+ '</td></tr>');
			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Country: </td></b><td colspan="2">' +sortable_array_player_country[j-1]+ '</td></tr>');

			break;
			}		
   	}
});

function errorBorder(rowclicked){
	setTimeout(function(){removeBorder(rowclicked[0], rowclicked[1], rowclicked[2], rowclicked[3])}, 2000);
	for(j = 0; j < rowclicked.length; j++){
		rowclicked[j].style.borderTop = '1px red solid';
		rowclicked[j].style.borderBottom = '1px red solid';

		if(j === 0){
			rowclicked[j].style.borderLeft = '1px red solid';
		}else if(j === 3){
			rowclicked[j].style.borderRight = '1px red solid';
		}
	}
		
	function removeBorder (firstchild, secondchild, thirdchild, fourthchild){
		firstchild.style.border = 'none';
		secondchild.style.border = 'none';
		thirdchild.style.border = 'none';
		fourthchild.style.border = 'none';
	}
}


$(document).on('dblclick', '.playerdatabase_rows', function() {
	//Make a variable of the row clicked
	var rowclicked = $(this).children('td');

	//Get the image of the country that is clicked 
	var countryimage = rowclicked[0].getElementsByTagName('img')[0];
	//Removes all before the / --> transfermarketscrape/Country_Images/Spain.png becomes Spain.png
	var stringwithPNG = /[^/]*$/.exec(countryimage.src)[0];
	//Removes all after . --> Spain.png becomes Spain
	var countrywithoutPNG = stringwithPNG.split('.')[0];
	//Remove %20 as space replacer
	var correctcountrynotation = countrywithoutPNG.replace(/%20/g, " ");
	console.log(div_name_under_jersey.innerHTML.length);
	//If no player is selected yet in this position, we check whether its already used in another position if not its added else we stop the function (return)
	A: if(div_name_under_jersey.innerHTML.length === 0){
		if(array_players_selected.length === 0){
			if(jerseyclicked[0].title != rowclicked[2].innerHTML.toUpperCase()){
				errorBorder(rowclicked);
				return;
			}
		}else{
			for(i = 0; i < array_players_selected.length; i++){
				if(jerseyclicked[0].title != rowclicked[2].innerHTML.toUpperCase() || array_players_selected[i][0] === rowclicked[1].innerHTML && array_players_selected[i][1] === rowclicked[3].innerHTML && array_players_selected[i][2] === correctcountrynotation){
					errorBorder(rowclicked);
					return;
				}	
			}
		}
		
		array_players_selected.push(new Array(rowclicked[1].innerHTML, rowclicked[3].innerHTML, correctcountrynotation, jerseyclicked[0].value));
	//Else we check whether the player is used in another position already and stop the function or we remove the player and add the new one
	}else{
		//player is used in another position
		for(i = 0; i < array_players_selected.length; i++){
			if(jerseyclicked[0].title != rowclicked[2].innerHTML.toUpperCase() || array_players_selected[i][0] === rowclicked[1].innerHTML && array_players_selected[i][1] === rowclicked[3].innerHTML && array_players_selected[i][2] === correctcountrynotation){
				errorBorder(rowclicked);
				return;
			}
		}

		//Player is not used in another position and thus the current player is removed and the newly selected player is added
		for(i = 0; i < array_players_selected.length; i++){
			if(div_name_under_jersey.innerHTML === array_players_selected[i][0] && div_value_under_jersey.innerHTML === array_players_selected[i][1]){
				array_players_selected.splice(i, 1);
				array_players_selected.splice(i, 0, new Array(rowclicked[1].innerHTML, rowclicked[3].innerHTML, correctcountrynotation, jerseyclicked[0].value));
				break A;
			}
		}
	}
	
	//Set new Image
	jerseyclicked[0].src = '../Team_Shirts/' + countrywithoutPNG + '.png';

	//If image is not found then this function is run and the plain shirt is used
	jerseyclicked[0].onerror = function(){
		jerseyclicked[0].src = '../Team_Shirts/Plain Shirt.png';	
	}

	//Set div which is in table data to the name of the player clicked
	div_name_under_jersey.innerHTML = rowclicked[1].innerHTML;
	div_value_under_jersey.innerHTML = rowclicked[3].innerHTML;

	calculatemoneyleft();

	// Get the modal
	var modal = document.getElementById('myModal');
   	modal.style.display = "none";
   	$('#body').css("overflow-y", "auto");
});

//Checks whether rules are met or not
function rulesmet(moneyleft, numberplayersselected){
	var icon = $('#rule_withincashlimit').children().children()[0];

	//Check if more than the money limit is used 
	if(changecurrencynotation(moneyleft.innerHTML) > 0){
		icon.src = "../other_images/icon_check.png";
	}else{
		icon.src = "../other_images/icon_cross.png";
	}

	var icon = $('#rule_oneplayerpercountry').children().children()[0];
	icon.src = "../other_images/icon_check.png";


	A: for(i = 0; i < numberplayersselected.length; i++){
		var countryofplayer = numberplayersselected[i][2];
		for(j = i + 1; j < numberplayersselected.length; j++){
			var countryofplayer_2 = numberplayersselected[j][2];
			if(countryofplayer === countryofplayer_2){
				icon.src = "../other_images/icon_cross.png";
				break A;
			}			
		}
	}


	var icon = $('#rule_elevenplayersselected').children().children()[0];

	//Check if already 11 players have been selected
	if(numberplayersselected.length < 11){
		icon.src = "../other_images/icon_cross.png";
	}else{
		icon.src = "../other_images/icon_check.png";
	}
}


//Calculates the amount of money left and updates the values
function calculatemoneyleft(){
	var cells_money_table = document.getElementsByClassName('money_updater');

	//change the notation of the current amount left --> €2.000.000,- becomes 2000000
	//var integer_notation_current_amount_left = changecurrencynotation(cells_money_table[2].innerHTML);

	var current_total_money_spend = 0;

	for(i = 0; i < array_players_selected.length; i++){
		var current_total_money_spend = current_total_money_spend + changecurrencynotation(array_players_selected[i][1]);
	}

	//Update the amount of money spend
	cells_money_table[1].innerHTML = changecurrencynotation(current_total_money_spend);
	
	//Update the new amount of money left
	var currency_notation_updated_amount_left = total_amount_to_be_used - current_total_money_spend;
	cells_money_table[2].innerHTML = changecurrencynotation(currency_notation_updated_amount_left);
	rulesmet(cells_money_table[2], array_players_selected);
}

//Function that translates currency notations to integers notation and vice versa
function changecurrencynotation(number_to_be_changed){
	if(isNaN(parseInt(number_to_be_changed))){
		var current_notation = number_to_be_changed;
		var current_notation = current_notation.substring(0, current_notation.length - 2);
		var updated_notation = Number(current_notation.replace(/[^0-9\,-]+/g,""));
		return updated_notation;		
	}else{
		var updated_notation = "EU" + parseInt(number_to_be_changed).toLocaleString('nl-NL', {minimumFractionDigits: 0}) + ",-";
		return updated_notation;
	}
}

$('#confirmbutton').click(function(){
	var button = this;
	button.disabled = true;

	//Get the icons of the three rules
	var icon_cashlimit = $('#rule_withincashlimit').children().children()[0];
	var icon_oneplayer = $('#rule_oneplayerpercountry').children().children()[0];
	var icon_elevenplayers = $('#rule_elevenplayersselected').children().children()[0];

	//CHeck if the src of the icons contain the word cross if not we can confirm the team 
	if(icon_cashlimit.src.indexOf('cross') > 0){
		$(this).text('Cannot confirm!');
		//After a few seconds we change the text back to the original 
		setTimeout(changeText, 3000);
	} else if(icon_oneplayer.src.indexOf('cross') > 0){
		$(this).text('Cannot confirm!');
		//After a few seconds we change the text back to the original 
		setTimeout(changeText, 3000);
	} else if(icon_elevenplayers.src.indexOf('cross') > 0){
		$(this).text('Cannot confirm!');
		//After a few seconds we change the text back to the original 
		setTimeout(changeText, 3000);
	}else{
		$(this).text('Confirmed!');
		setTimeout(changeText, 3000);

		//Retrieve username and password
		var managername = JSON.stringify(accountdetails.username[0]);
		var password = JSON.stringify(accountdetails.password[0]);
		var selectedplayers = JSON.stringify(array_players_selected);

		$.ajax({
            type: 'POST',
            url: 'database_sendteam.php',
            data: {managername: managername, password: password, selectedplayers: selectedplayers},
            dataType: 'text',
			error: function(response) { alert(JSON.stringify(response))},
        });	

		
	}

	function changeText(){
		$('#confirmbutton').text('Confirm Team');
		button.disabled = false;
	}
});


$('#signoutbutton').click(function(){
	localStorage.clear();
	window.location= "../PAGE_login/login_page.html"; 		

});

$(window).on("unload", function(e) {
    var team = {
    	userteamplayers: array_userteamplayers,
     	userteamcountry: array_userteamcountry,
   	};
					
	//converts to JSON string the Object
	team = JSON.stringify(team);
	//creates a base-64 encoded ASCII string
	team = btoa(team);
	//save the encoded accout to web storage
	localStorage.setItem('team', team);
});

    