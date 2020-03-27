class Landscape {

	constructor() {
		this.joy_linear = document.getElementById('joy_linear');
		this.joy_angular = document.getElementById('joy_angular');

		this.inputmixer = {
			linear: 0,
			angular: 0
		}
	}

	bind_sliders(input_handler, reset_handler) {
		var on_input = (event) => {
			if(event.target === this.joy_linear)
				this.inputmixer.linear = this.joy_linear.value
			else if(event.target === this.joy_angular)
				this.inputmixer.angular = this.joy_angular.value
			input_handler(this.inputmixer.linear, this.inputmixer.angular);
		}

		var on_change = (event) => {
			if(event.target === this.joy_linear)
				this.inputmixer.linear = 0
			else if(event.target === this.joy_angular)
				this.inputmixer.angular = 0

			event.target.value = 0
			if(this.inputmixer.linear == 0 && this.inputmixer.angular == 0)
				reset_handler();
			else
				input_handler(this.inputmixer.linear, this.inputmixer.angular);
		}

		this.joy_linear.addEventListener('input', on_input);
		this.joy_angular.addEventListener('input', on_input);

		this.joy_linear.addEventListener('change', on_change);
		this.joy_angular.addEventListener('change', on_change);
	}
}

