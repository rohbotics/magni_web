var forward = 0.0;
var rotate = 0.0;
var prevElement;
var spamTwist = false;

var isTouchscreen = false;
var scaleSize = "scale(1.75)";

function setHover(element, toggle){
	if(toggle){
		element.style.transform = scaleSize;
		element.style.webkitTransform = scaleSize;
		element.style.msTransform  = scaleSize;
	}
	else{
		element.style.transform = "scale(1.0)";
		element.style.webkitTransform = "scale(1.0)";
		element.style.msTransform  = "scale(1.0)";
	}
}

function setTwist(fwd, rotat){
	forward = fwd;
	rotate = rotat;
	spamTwist = true;
}

function endTwist(){
	if(spamTwist){
		spamTwist = false;
		forward = rotate = 0.0;
		console.log("cmd_vel: x="+forward+" rz="+rotate);
		ROSLink.twist(forward, rotate);
		setHover(prevElement, false);
	}
}

function touchEvent(fwd, rotat, id){
	setTwist(fwd, rotat)

	if(prevElement != undefined && prevElement.style.transform == scaleSize){
		setHover(prevElement, false);
	}

	prevElement = document.getElementById(id);
	setHover(prevElement, true);
}

function mouseEvent(fwd, rotat, id){
	if(isTouchscreen)
		return;
	touchEvent(fwd, rotat, id);
}

document.documentElement.addEventListener('mouseup', function(e){
	if(isTouchscreen)
		return;
	endTwist();
});

document.documentElement.addEventListener('touchend', function(e){
	endTwist();
});

document.documentElement.addEventListener('touchstart', function(e){
	isTouchscreen = true;
	scaleSize = "scale(2.25)";
});

setInterval(function(){
	if(spamTwist){
		console.log("cmd_vel: x="+forward+" rz="+rotate);
		ROSLink.twist(forward, rotate);
	}

}, 100);

//document.body.webkitRequestFullscreen();
