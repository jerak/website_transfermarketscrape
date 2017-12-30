var array_participantlist = [];
var	array_participantpunten = [];

var array_participantteam = [];

//When the document has finished loading
$(document).ready(function(){
	getparticipants();
});

function getparticipants(){
	$.ajax({
            type: 'POST',
            url: 'getparticipants.php',
            dataType: 'json',
			error: function(response) { alert(JSON.stringify(response))},

            success: function(data){
            	$.each(data.participantlist, function(key, value){

            		array_participantlist.push(data.participantlist[key]);
             		array_participantpunten.push(data.participantpunten[key]);
            	});
            	fillparticipanttable();
            }
        });
}

function fillparticipanttable(){
	for(i = 0; i < array_participantlist.length; i++){
		$('#participants_table').append('<tr><td>' + (i + 1) + '</td><td>' + array_participantlist[i] + '</td><td>' + array_participantpunten[i] + '</td></tr>');
	}
}

//Function that is called when a row is clicked in the table
$(document).on("click", "#participants_table tr:not(:first-child)", function() {
    //Remove the class that has id inserted_row (so if another participant is clicked the current open one is removed)
    $('#inserted_row').remove();
    //Add new row with id inserted_row
    $('#participants_table > tbody > tr').eq($(this).index()).after('<tr id="inserted_row"><td colSpan="3"><table id="table_on_inserted_pitch"></table></td></tr>');

    //Set background to transparent
    $('#inserted_row').css("background-color", "transparent");
    $('#table_on_inserted_pitch').css("background-color", "transparent");

    //Define a new hover function else it gets the hover function of the outer table 
    $('#inserted_row').hover(function(){
       $(this).css("opacity", "1");
       $(this).css("cursor", "default");
   });

    //Now that a row has been inserted add a pitch and send the user clicked with it
    drawtableonpitch($(this).children('td')[1].innerHTML);
});

//Draws/Fills the table which is positioned over the pitch image
function drawtableonpitch(playerclicked){
    //The positions where jerseys need to be positioned
   
    //Add rows and table data
    for(i = 0; i < 10; i++){
        $('#table_on_inserted_pitch').append('<tr class="inserted_pitch_table_rows"></tr>');
    }
    for(j = 0; j < 11; j++){
        $('.inserted_pitch_table_rows').append('<td></td>');
    }

    //make background transparent 
    $('.inserted_pitch_table_rows').css("background-color", "transparent");

    //Define a new hover function else it gets the hover function of the outer table 
    $('.inserted_pitch_table_rows').hover(function(){
        $(this).css("opacity", "1");
        $(this).css("cursor", "default");
    });

    //check each position and make a jersey image, and 2 divs underneath it
    /*for(i = 0; i < array_jersey_positions.length; i++){
        var table = document.getElementById("table_on_inserted_pitch");
        var table_row = table.getElementsByTagName('tr')[array_jersey_positions[i][0]];
        var table_data = table_row.getElementsByTagName('td')[array_jersey_positions[i][1]];
        var img = document.createElement("img");
        img.classList.add('test_jersey');
        img.src = "/website_transfermarketscrape/Team_Shirts/Plain Shirt.png";
        img.value = array_jersey_positions_names[i];
        table_data.appendChild(img);

        var div = document.createElement("div");
        div.classList.add('name_under_jersey');
        table_data.appendChild(div);    

        var div = document.createElement("div");
        div.classList.add('value_under_jersey');
        table_data.appendChild(div);   
    }*/
    getparticipantsteam(playerclicked);
}

function getparticipantsteam(playerclicked){
    array_participantteam = [];
    var playerclickedJSON = JSON.stringify(playerclicked);
    $.ajax({
            type: 'POST',
            url: 'database_getparticipantteam.php',
            data: {playerclicked: playerclickedJSON},
            dataType: 'json',
            error: function(response) { alert(JSON.stringify(response))},

            success: function(data){
                $.each(data.participantlistteam, function(key, value){
                    array_participantteam.push(data.participantlistteam[key]);
                });

                seperateplayerandcountry();
            }
        });
}

function seperateplayerandcountry(){
    array_participantteamplayers = [];
    array_participantteamcountry = [];
    
    for(i = 0; i < array_participantteam.length; i++){
        var playerString = array_participantteam[i].replace(/ *\([^)]*\) */g, "");
        var countryString = array_participantteam[i].replace( /(^.*\(|\).*$)/g, '' );

        array_participantteamplayers.push(playerString);
        array_participantteamcountry.push(countryString);
    }

    filltablewithjerseys(array_participantteamplayers, array_participantteamcountry);

}

function filltablewithjerseys(array_participantteamplayers, array_participantteamcountry){
    var array_jersey_positions = [[6,5],[4,2],[5,3],[5,7],[4,8],[3,3],[4,5],[3,7],[2,4],[2,5],[2,6]];
    var array_jersey_positions_names = ['dm','la','lcv','rcv','ra','lm','cm','rm','lb','sp','rb'];

    for(i = 0; i < array_jersey_positions.length; i++){
        var table = document.getElementById("table_on_inserted_pitch");
        var table_row = table.getElementsByTagName('tr')[array_jersey_positions[i][0]];
        var table_data = table_row.getElementsByTagName('td')[array_jersey_positions[i][1]];
        var img_jersey = document.createElement("img");
        img_jersey.classList.add('test_jersey');

        img_jersey.src = "/website_transfermarketscrape/Team_Shirts/" + array_participantteamcountry[i] + ".png";

        img_jersey.onerror = function(){
            console.log("OK");
        }


        img_jersey.value = array_jersey_positions_names[i];
        table_data.appendChild(img_jersey);

        var div = document.createElement("div");
        div.classList.add('name_under_jersey');
        div.innerHTML = array_participantteamplayers[i];
        table_data.appendChild(div);    

        var div = document.createElement("div");
        div.classList.add('value_under_jersey');
        table_data.appendChild(div);   
    }
}