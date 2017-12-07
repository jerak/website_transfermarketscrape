var array_players = [];
//player_images get 1 empty spot because it is not show on webpage thus does not take into account header (search boxes)
var array_player_images = [""];
var array_country_images = [];
var array_player_position = [];
var array_player_club = [];
var array_player_value = [];
var array_player_goals = [];
var array_player_points = [];
var array_player_country = [];

var countrySelected = "";
var filter_name  = "";
var filter_positie = "ALLE POSITIES";
var filter_waarde = "";

var arrow_down = true;

function openModal(id){

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

	//if its the first time opening the model then fetch the data 
	if(array_players.length === 0){
			getPlayers(id);
	}else{
			highlightRows(id);
	}
}

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



function getPlayers(id){
		$.ajax({
            type: 'POST',
            url: 'ajaxcall_getplayers.php',
            dataType: 'json',
			error: function(response) { alert(JSON.stringify(response))},

            success: function(data){
            	$.each(data.playerslist, function(key, value){
            			
            			//All data is stored in arraylist but most of it is not used yet! So it is stored with no purpose!
            			var img_player = "../website_transfermarketscrape/Player_Images/" + data.playerscountry[key] + " " + data.playerslist[key] + ".jpg";
            			array_player_images.push(img_player);

            			array_player_club.push(data.playersclub[key]);

            			var img_country = "../website_transfermarketscrape/Country_Images/" + data.playerscountry[key] + ".jpg";
						array_country_images.push(img_country);

            			//change the notation of the data.playerswaarde[key] --> 2000000 becomes 2.000.000
						var playerswaarde_newnotation =  "€" + parseInt(data.playerswaarde[key]).toLocaleString('nl-NL', {minimumFractionDigits: 0}) + ",-";
						array_player_value.push(parseInt(data.playerswaarde[key]));

						array_players.push(data.playerslist[key]);
						array_player_position.push(data.playerspositie[key]);
						array_player_goals.push(data.playersgoals[key]);
						array_player_points.push(data.playerspoints[key]);
						array_player_country.push(data.playerscountry[key]);

            			$('.playerdatabase_table').append('<tr class="playerdatabase_rows"><td class="column_country_img"><img src="' + img_country + '"></img></td><td class="column_name">' + data.playerslist[key] + '</td><td class="column_positie">' + data.playerspositie[key] + '</td><td class="column_waarde">' + playerswaarde_newnotation + '</td></tr>');
						//<td class="column_player_img"><img src="' +img_player+ '"></img></td>
            	});

            highlightRows(id);

            }
        });

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
		moveArrayAround(array_player_club, array_player_club.length, array_player_club.length, tablerows.length-i-1);
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


$(document).on('click', '.playerdatabase_rows', function() {

   	var rowclicked = $(this).children('td');
   	var tablerows = document.getElementsByClassName('playerdatabase_rows');

   	OUTER_LOOP: for(i = 1; i < rowclicked.length; i++){
		for(j = 1; j < tablerows.length; j++){
			var tabledata_country = tablerows[j].getElementsByTagName('img')[0].src;
			var tabledata_name = tablerows[j].getElementsByTagName("td")[1];
			var tabledata_positie = tablerows[j].getElementsByTagName("td")[2];
			var tabledata_waarde = tablerows[j].getElementsByTagName("td")[3];			
			
			if(rowclicked[1] === tabledata_name){
				$('#playerprofile').empty();

   				$('#playerprofile').append('<div class="playerprofile_img"><img src="' +array_player_images[j]+ '"></img></div>');
   				$('#playerprofile').append('<table id="table_playerprofile"></table>');
    			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Name: </td></b><td>' + tabledata_name.innerHTML +  '</td></tr>');
  				$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Position: </td></b><td>' +tabledata_positie.innerHTML+ '</td></tr>');
    			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Value: </td></b><td>' +tabledata_waarde.innerHTML+ '</td></tr>');
    			$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Club: </td></b><td>' +array_player_club[j-1]+ '</td></tr>');
				$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Goals: </td></b><td>' +array_player_goals[j-1]+ '</td></tr>');
				$('#table_playerprofile').append('<tr class="tablerow_playerprofile"><td> <b>Country: </td></b><td>' +array_player_country[j-1]+ '</td></tr>');

				break OUTER_LOOP;
			}
	
		}

/*
   		$('#playerprofile').append("<div>" + rowclicked[i].innerHTML + "</div>");
   		console.log(array_player_images.length);*/
   	}

});




