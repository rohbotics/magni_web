var portrait_last_pressed;

class Portrait{

	static inputmux(target){

		switch(target.id){
			case "pforward_left": 	Twist.set(1,1);		break;
			case "pforward":		Twist.set(1,0);		break;
			case "pforward_right":	Twist.set(1,-1);	break;

			case "pleft":			Twist.set(0,1);		break;
			case "pstop":			Twist.set(0,0);		break;
			case "pright":			Twist.set(0,-1);	break;

			case "pbackward_left":	Twist.set(-1,-1);	break;
			case "pbackward":		Twist.set(-1,0);	break;
			case "pbackward_right":	Twist.set(-1,1);	break;
			default: return;
		}

		Visuals.hover(target);
		portrait_last_pressed = target;
	}
}

document.documentElement.addEventListener('mousedown', function(e){
	if(state.is_touchscreen)
		return;
	Portrait.inputmux(event.target);
});

document.documentElement.addEventListener('mouseup', function(e){
	if(state.is_touchscreen)
		return;
	
	if(portrait_last_pressed != undefined){
		Visuals.unhover(portrait_last_pressed);
		portrait_last_pressed = undefined;
		Twist.clear();
	}
});

document.documentElement.addEventListener('touchstart', function(e){
	Portrait.inputmux(event.target);
});

document.documentElement.addEventListener('touchend', function(e){
	if(portrait_last_pressed != undefined){
		Visuals.unhover(portrait_last_pressed);
		Twist.clear();
	}

});

