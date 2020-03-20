
var state = {
	linear: 0.0,
	angular: 0.0,
	continious_sending: false,
	is_touchscreen: false,
};

var scaleSize = "scale(1.5)";
var joystick = undefined;

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
	if(settings.use_joystick && window.innerWidth < window.innerHeight){

		if(joystick._pressed)
			state.continious_sending = true;

		if(state.continious_sending)
		{
			let ang = 0;
			let lin = 0;

			if(Math.sqrt(Math.pow(joystick.deltaX(),2) + Math.pow(joystick.deltaY(),2)) > joystick._stickRadius * 0.1)
			{
				ang = -joystick.deltaX()/joystick._stickRadius;
				lin = -joystick.deltaY()/joystick._stickRadius;
			}

			if(!joystick._pressed){
				lin = ang = 0;
				state.continious_sending = false;
			}

			console.log("joy: lin="+lin.toFixed(2)+" ang="+ang.toFixed(2));
			ROSLink.twist(lin, ang);
		}

	}else if(state.continious_sending){

		console.log("cmd_vel: lin="+state.linear+" ang="+state.angular);
		ROSLink.twist(state.linear, state.angular);

	}

}, 100);