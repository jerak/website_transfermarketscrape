var currentSlideIndex = 0;

//Automatic slideshow
function slideShow(slideIndex){
	var slides = document.getElementsByClassName("slide_images");
	var dots = document.getElementsByClassName("slide_dot");

	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
		dots[i].style.background = "silver";
	}

	slides[slideIndex].style.display = "block";
	dots[slideIndex].style.background = "#717171";
	currentSlideIndex++;

	if(slides.length === currentSlideIndex){
		currentSlideIndex = 0;
	}
}

//Clicking a dot 
$('.slide_dot').on('click', function(){
	var slides = document.getElementsByClassName("slide_images");
	var dots = document.getElementsByClassName("slide_dot");

	for (i = 0; i < dots.length; i++) {
		slides[i].style.display = "none";
		dots[i].style.background = "silver";

		if($(this).is(dots[i])){
			slides[i].style.display = "block";
			dots[i].style.background = "#717171";

			if(slides.length === i){
				currentSlideIndex = 0;
			}else{
				currentSlideIndex = i;
			}

		}
	}

});

window.setInterval(function(){
	slideShow(currentSlideIndex);
}, 5000);