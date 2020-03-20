
var state = {
	linear: 0.0,
	angular: 0.0,
	continious_sending: false,
	is_touchscreen: false,
};

var scaleSize = "scale(1.5)";

class Visuals{

	static hover(el){
		el.style.transform = scaleSize;
		el.style.webkitTransform = scaleSize;
		el.style.msTransform  = scaleSize;
	}

	static unhover(el){
		el.style.transform = "scale(1.0)";
		el.style.webkitTransform = "scale(1.0)";
		el.style.msTransform  = "scale(1.0)";
	}

}

class Twist{

	static set(linear, angular){
		state.linear = linear;
		state.angular = angular;
		state.continious_sending = true;
	}

	static clear(){
		if(state.continious_sending){

			state.continious_sending = false;
			state.linear = state.angular = 0.0;
			ROSLink.twist(0, 0);
		}
	}
}

document.documentElement.addEventListener('touchstart', function(e){
	state.is_touchscreen = true;
});

document.documentElement.ondragstart = function () {
	return false;
};

setInterval(function(){
	if(state.continious_sending){
		console.log("cmd_vel: x="+state.linear+" rz="+state.angular);
		ROSLink.twist(state.linear, state.angular);
	}

}, 100);


function addJoystick(){
	let rect = document.getElementById("touchpad").getBoundingClientRect()

	var joystick = new VirtualJoystick({
		mouseSupport: true,
		stationaryBase: true,
		baseX: window.innerWidth/2,
		baseY: (rect.bottom + rect.top)/2,
		limitStickTravel: true,
		stickRadius: window.innerWidth*0.3,
	});
}

setTimeout(addJoystick,1000);