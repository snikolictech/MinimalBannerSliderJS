//Extremely simple JPG banner animation based on minimal JS/CSS
//By default, autoplays banner change (via fadeInOut animation) or changes when user clicks arrows

(function (){ 
	
	var autoPlay;
	const autoSpeed = 4000;

	var settings = {
		elementID: "slideImg",
		maxImages: 2,
		fadeSpeed: 20,
		lowestOpacity: 0,
		highestOpacity: 100,
		links: ["LINK #1 GOES HERE", "LINK #2 GOES HERE"]
	};

	var fadeInOut = (function() {

		var slideNum = { index: 1 }; //increment/decrement for slide image

		return function(settings, clickObject) {
			var element = document.getElementById(settings.elementID);
			var counter = settings.highestOpacity;
			var loadImage;
			var rewind;
						
			var anim = setInterval(function() {	
				clicked = clickObject.id != undefined;
				if (clicked)
				{
					clearInterval(anim - 1);
					autoPlay = clearInterval(autoPlay);
				} //records when a click occurs, kills previous animation and ends autoplay
								
				if (!rewind) {
					if (counter > settings.lowestOpacity) {
						counter -= 10;
						element.style.opacity = counter / 100;						
					}
					else {
						if (loadImage)
							return;
						
						clickObject.id == "slidePrev" ? slideNum.index-- : slideNum.index++;			
						if (slideNum.index > settings.maxImages) { slideNum.index = 1; }
						if (slideNum.index < 1) { slideNum.index = settings.maxImages; }
						
						var image = document.getElementById("slideImg");
						image.src = "slider/slide".concat(slideNum.index).concat(".jpg");
						image.onload = function() {
							rewind = true;
							loadImage = false;
						}
						
						loadImage = true;
						
						var link = document.getElementById("slideLink");
						link.href = settings.links[slideNum.index - 1];
					}
				}
				else 
				{
					if (counter < settings.highestOpacity) {
						counter += 10;
						element.style.opacity = counter / 100;
					}
					else {
						clearInterval(anim); //kills animation event once it completes
					}
				}
			
			}, settings.fadeSpeed);
		  }
	})();
	

	//Set Manual-click and Auto Events
	setManualClick("slideNext");
	setManualClick("slidePrev");

	window.onload = function() {	
		clearAndSetAuto(); //onload used to fix Chrome/Safari not calling onfocus after page loads
	}
	
	window.onfocus = function() {	
		clearAndSetAuto(); //enables autoplay, including when killed with switching tabs as described below
	}
	
	window.onblur = function() {
		autoPlay = clearInterval(autoPlay); //kills autoplay when switching tabs. Fixes accumulations of events when switching back.
	}

	
	//Manual and Auto function defs
	function setManualClick(clickedDirection) {
		document.getElementById(clickedDirection).addEventListener("click", function() {
			fadeInOut(settings, this);
		});
	}
	
	function clearAndSetAuto() {
		//Clear Autoplay if already set
		autoPlay = clearInterval(autoPlay);
	
		autoPlay = setInterval(function() { 
			fadeInOut(settings, this)
		}, autoSpeed); 
	}
})();