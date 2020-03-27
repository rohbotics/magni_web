class KeyboardTeleop {
	constructor() {	}

	bind_buttons = (input_handler, reset_handler) => {
		var on_press = (event) => {
			switch(event.key) {
				case "u":
				case "U": input_handler(1,1);	break;
				case "i":
				case "I": input_handler(1,0);	break;
				case "o":
				case "O": input_handler(1,-1);	break;

				case "j":
				case "J": input_handler(0,1);	break;
				case "k":
				case "K": input_handler(0,0);	break;
				case "l":
				case "L": input_handler(0,-1);	break;
				
				case "m":
				case "M": input_handler(-1,-1);	break;
				case ",":
				case "<": input_handler(-1,0);	break;
				case ".":
				case ">": input_handler(-1,1);	break;

			}
		}
		var on_unpress = (event) => {
			switch(event.key) {
				case "u":
				case "U":
				case "i":
				case "I":
				case "o":
				case "O":

				case "j":
				case "J":
				case "k":
				case "K":
				case "l":
				case "L":
				
				case "m":
				case "M":
				case ",":
				case "<":
				case ".":
				case ">":
					reset_handler();	break;
			}
		}
		window.addEventListener("keydown", on_press, true);
		window.addEventListener("keyup", on_unpress, true);
	}
}


