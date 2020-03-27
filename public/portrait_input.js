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

// Joystick is still global state because settings interacts with it
var joystick = undefined;
class Portrait {
	constructor() {
		this.portrait_last_pressed = undefined;
	}

	bind_buttons = (input_handler, reset_handler) => {
		var on_press = (e) => {
			var target = event.target
			switch(target.id){
				case "pforward_left": 	input_handler(1,1);	break;
				case "pforward":	input_handler(1,0);	break;
				case "pforward_right":	input_handler(1,-1);	break;

				case "pleft":		input_handler(0,1);	break;
				case "pstop":		input_handler(0,0);	break;
				case "pright":		input_handler(0,-1);	break;

				case "pbackward_left":	input_handler(-1,-1);	break;
				case "pbackward":	input_handler(-1,0);	break;
				case "pbackward_right":	input_handler(-1,1);	break;
				default: return;
			}

			Visuals.hover(target);
			this.portrait_last_pressed = target;
		}
		var on_unpress = (e) => {
			if(this.portrait_last_pressed != undefined){
				Visuals.unhover(this.portrait_last_pressed);
				this.portrait_last_pressed = undefined;
				reset_handler();
			}
		}
		document.documentElement.addEventListener('mousedown', on_press);
		document.documentElement.addEventListener('touchstart', on_press);

		document.documentElement.addEventListener('mouseup', on_unpress);
		document.documentElement.addEventListener('touchend', on_unpress);

		// Needed for Joystick support on mouse based systems
		// Moving the joystick gets interpreted as a drag-and-drop event and
		// doesn't trigger the mouseup
		document.documentElement.ondragstart = function () {	
			return false;	
		};
	}

	bind_joystick = (input_handler, reset_handler) => {
		var polling = () => {
			let portraitmode = window.innerWidth < window.innerHeight;

			if(settings.use_joystick)
			{	
				if(portraitmode){
					if(joystick == undefined)
						Settings.show_joystick();
				}else if(joystick != undefined)
					Settings.hide_joystick();
			}
			else if(joystick != undefined)
				Settings.hide_joystick();

			if(settings.use_joystick && portraitmode){
				if(joystick._pressed) {
					let ang = 0;
					let lin = 0;

					if(Math.sqrt(Math.pow(joystick.deltaX(),2) + Math.pow(joystick.deltaY(),2)) > joystick._stickRadius * 0.1)
					{
						ang = -joystick.deltaX()/joystick._stickRadius;
						lin = -joystick.deltaY()/joystick._stickRadius;
					}

					if(lin < 0)
						ang = -ang;

					console.log("joy: lin="+lin.toFixed(2)+" ang="+ang.toFixed(2));
					input_handler(lin,ang);
				} else {
					reset_handler();
				}
			} 
		}
		setInterval(polling, 100);
	}
}

