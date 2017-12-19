//11 cards in HTML and adding 1 card before start sliding
var initial_amount_of_cards = 20;

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

//card to start at (1277 (1278 - 1 in method)) is the first card that is not immediately on screen
var player_counter = 1274;

//Check if cursor is right/left on screen
var cursor_on_image_carrousel_right = false;

//Checks if all methods are done running. Set to true because we first need to fetch data with ajax and place/fill the divs
var running_fillnewplayercard = true;
var running_slideplayercards = true;
var running_addnewplayercard = true;
var running_applySlideEffects = true;

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

//Methods to be run as soon as the webpage is opened
$(document).ready(function(){
	//Places the divs initially on screen (because position is absolute)
	placeinitialdivs();
	//Get the data from Ajax call
	getPlayers();
});

//Places the initial divs that have an absolute position thus needs loop to place
function placeinitialdivs(){
	var playercardsimages = $('.player_card_carrousel_img');

	for(i = playercardsimages.length-1, height_counter = 5, imageheight_counter = 1, zindexcounter = 0; i >= 0; i--){
		var marginleft = (-335 + (i * 100));
		//Define the place of each intial card (with margin left)
		$('#n' + player_counter + '_playercard').css("margin-left", marginleft);

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
            			var img_player = "/website_transfermarketscrape/Player_Images/" + data.playerscountry[key] + " " + data.playerslist[key] + ".jpg";
            			array_player_images.push(img_player);

            			//Data for club name and club image
            			array_player_club_name.push(data.playersclub[key]);
            			var img_club = "/website_transfermarketscrape/Club_Logos/" + data.playersclub[key] + ".png";
            			array_player_club_img.push(img_club);

            			var img_country = "/website_transfermarketscrape/Country_Images/" + data.playerscountry[key] + ".png";
						array_country_images.push(img_country);
						array_player_position.push(data.playerspositie[key]);

            			//change the notation of the data.playerswaarde[key] --> 2000000 becomes 2.000.000
						var playerswaarde_newnotation =  "€" + parseInt(data.playerswaarde[key]).toLocaleString('nl-NL', {minimumFractionDigits: 0}) + ",-";
						array_player_value.push(playerswaarde_newnotation);

						array_player_goals.push(data.playersgoals[key]);
						array_player_points.push(data.playerspoints[key]);
						array_player_country.push(data.playerscountry[key]);
						//$('#container_images').append('<div class="player_card_carrousel"><img class="player_card_carrousel_img" src="' + img_player + '"></img></div>');
            	});
            	success: initialfillplayercards();
            }
        });
}

//Fill the initially placed div with data from ajax
function initialfillplayercards(){
	var playercarddivs = $('.player_card_carrousel');
	var playercardsimages = $('.player_card_carrousel_img');

	//loop over the cards visible
	for(i = playercardsimages.length-1; i >= 0; i--){
		playercardsimages[i].src = 	array_player_images[player_counter];
		var playercard = $("#n"+ player_counter + "_playercard");

		playercard.append('<img class="playerprofile_arrowleft" src="/website_transfermarketscrape/other_images/left_arrow.png"></img>');
   		playercard.append('<img class="playerprofile_arrowright" src="/website_transfermarketscrape/other_images/right_arrow.png"></img>');

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
			console.log(" ");

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
	//if cursor is on left side of screen we need to append (last in row) the div --> append doesnt really matter because absolute position but with relative position this is applicable
	if(cursor_on_image_carrousel_right){
		$('#container_images').append('<div class="player_card_carrousel" id="n' + local_player_counter + "_playercard" + '"></div>');
		var marginleft = -335 + (18 * 100);
		$('#n' + local_player_counter + '_playercard').css("margin-left", marginleft);
		$('#n' + local_player_counter + '_playercard').addClass('player_card_carrousel_blur');
	//else we need to prepend (first in div) --> append doesnt really matter because absolute position but with relative position this is applicable
	}else{
		$('#container_images').prepend('<div class="player_card_carrousel" id="n' + local_player_counter + "_playercard" + '"></div>');
		$('#n' + local_player_counter + '_playercard').css("margin-left", "-335px");
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

   		playercard.append('<img class="playerprofile_arrowleft" src="/website_transfermarketscrape/other_images/left_arrow.png"></img>');
   		playercard.append('<img class="playerprofile_arrowright" src="/website_transfermarketscrape/other_images/right_arrow.png"></img>');

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


//Clicking the jersey and thus opening the modal
$('#test_jersey').click(function(id){
	// Get which id is clicked
	var id = $(this).attr('id');
	console.log(id);

	// Get the modal
	var modal = document.getElementById('myModal');

   	modal.style.display = "block";
	
	//remove the scrollbar of the webpage
	 $('#body').css("overflow", "hidden");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
    	modal.style.display = "none";
    	//add the scrollbar of the webpage
    	$('#body').css("overflow", "auto");
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
    	if (event.target == modal) {
    	    modal.style.display = "none";
    	    //add the scrollbar of the webpage
    	   	$('#body').css("overflow", "auto");
    	}
	}

	//Fill the model with content (countries, players, playercard)
	if(!modal_filled){
		fillmodal(id);
		modal_filled = true; 
	}
});

//Function to fill the model the moment it is clicked
function fillmodal(id){
	$.each(array_players, function(key, value){
		$('.playerdatabase_table').append('<tr class="playerdatabase_rows"><td class="column_country_img"><img src="' + array_country_images[key] + '"></img></td><td class="column_name">' + array_players[key] + '</td><td class="column_positie">' + array_player_position[key] + '</td><td class="column_waarde">' + array_player_value[key] + '</td></tr>');
	});
}

//Function to highlight the rows that have the position that is clicked 
function highlightRows(id){
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
}

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
		var tabledata_waarde = tabledata_waarde.innerHTML;
		var tabledata_waarde = tabledata_waarde.substring(0, tabledata_waarde.length - 2);
		var tabledata_waarde = Number(tabledata_waarde.replace(/[^0-9\,-]+/g,""));


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
		moveArrayAround(array_player_images, array_player_images.length, array_player_images.length, tablerows.length-i);
		moveArrayAround(array_player_club_name, array_player_club_name.length, array_player_club_name.length, tablerows.length-i-1);
		moveArrayAround(array_player_club_img, array_player_club_img.length, array_player_club_img.length, tablerows.length-i-1);
		moveArrayAround(array_player_goals, array_player_goals.length, array_player_goals.length, tablerows.length-i-1);
		moveArrayAround(array_player_country, array_player_country.length, array_player_country.length, tablerows.length-i-1);
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
		var tabledata_waarde = tabledata_waarde.innerHTML;
		var tabledata_waarde = tabledata_waarde.substring(0, tabledata_waarde.length - 2);
		var tabledata_waarde = Number(tabledata_waarde.replace(/[^0-9\,-]+/g,""));


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
			$('#playerprofile').append('<div class="playerprofile_img"><img src="' +array_player_images[j -1]+ '"></img></div>');
			$('#playerprofile').append('<table id="table_playerprofile"></table>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Name: </td></b><td colspan="2">' + tabledata_name.innerHTML +  '</td></tr>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Club: </td></b><td><img class="tablerow_playerprofile_club_img" src="' + array_player_club_img[j-1] + '"></img></td><td>' +array_player_club_name[j-1]+ '</td></tr>');
  			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Position: </td></b><td colspan="2">' +tabledata_positie.innerHTML+ '</td></tr>');
    		$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Value: </td></b><td colspan="2">' +tabledata_waarde.innerHTML+ '</td></tr>');
			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Goals: </td></b><td colspan="2">' +array_player_goals[j-1]+ '</td></tr>');
			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Country: </td></b><td colspan="2">' +array_player_country[j-1]+ '</td></tr>');

			break;
			}		
   	}
});