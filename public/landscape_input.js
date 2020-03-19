var inputmixer = {
	linear: 0,
	angular: 0
}

class Landscape{

	static get(id){
		return document.getElementById(id);
	}

	static endpress(event){

		if(event.clientX > (event.screenX/2)){

			Visuals.unhover(document.getElementById("lleft"));
			Visuals.unhover(document.getElementById("lright"));
			inputmixer.angular = 0;

		}else{

			Visuals.unhover(document.getElementById("lforward"));
			Visuals.unhover(document.getElementById("lbackward"));
			inputmixer.linear = 0;
		}

		Twist.set(inputmixer.linear, inputmixer.angular)
	}

	static inputmux(target){
		
		switch(target.id){
			case "lleft": 	inputmixer.angular	= 1;	 break;
			case "lright":	inputmixer.angular	= -1;	 break;

			case "lforward":	inputmixer.linear	= 1;	break;
			case "lbackward":	inputmixer.linear	= -1;	break;
			default: return;
		}

		Twist.set(inputmixer.linear, inputmixer.angular)
		Visuals.hover(target);
	}
}

document.documentElement.addEventListener('mousedown', function(e){
	if(state.is_touchscreen)
		return;
	Landscape.inputmux(e.target);
});

document.documentElement.addEventListener('mouseup', function(e){
	if(state.is_touchscreen)
		return;
	Landscape.endpress(e);
});

document.documentElement.addEventListener('touchstart', function(e){
	Landscape.inputmux(event.target);
});

document.documentElement.addEventListener('touchend', function(e){
	Landscape.endpress();
});

