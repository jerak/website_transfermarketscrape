
//When clicking the arrow the div gets bigger and the full text can be read
$('.continue_button').click(function(event){

	//First we set all divs to the original size 
	$('.textdiv').each(function(key){
		//Set height and width of div
		$(this).animate({height: '290px'}, {duration: 500, queue: false});
		$(this).animate({width: '300px'}, {duration: 500, queue: false});

		//Set inner unordered list height (width adjusts automatically)
		var ul_in_div = $(this).children('ul').attr('id');
		$('#' + ul_in_div).animate({height: '200px'}, {duration: 500, queue: false});

		//If its the div clicked then we do not change the arrow image
		if($(this).attr('id') != event.target.parentElement.id){
			$(this).children('.continue_button').attr('src', '../other_images/down_arrow.png');
		}	
	});

	//This loops over the div that has been clicked it checks firstly if the arrow image is down (so we know whether it is open already)
	if($(this).attr('src').indexOf("down") > 0){
		//Change arrow picture
		$(this).attr('src', '../other_images/up_arrow.png');

		//Make outer div bigger 
		var id_div = $(this).parent().attr('id');
		$('#' + id_div).animate({height: '600px'}, {duration: 500, queue: false});
		$('#' + id_div).animate({width: '400px'}, {duration: 500, queue: false});

		//Make unordered list bigger
		var ul_in_div = $(this).parent().children('ul').attr('id');
		$('#' + ul_in_div).animate({height: '510px'}, {duration: 500, queue: false});
	//If already open
	}else{
		//We change arrow picture
		$(this).attr('src', '../other_images/down_arrow.png');

		//Make outer div smaller
		var id_div = $(this).parent().attr('id');
		$('#' + id_div).animate({height: '290px'}, {duration: 500, queue: false});
		$('#' + id_div).animate({width: '300px'}, {duration: 500, queue: false});

		//Make unordered list smaller
		var ul_in_div = $(this).parent().children('ul').attr('id');
		$('#' + ul_in_div).animate({height: '200px'}, {duration: 500, queue: false});
	}
});
