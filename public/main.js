class Twist {

	constructor(twist_topic) {
		this.continious_sending = false;
		this.linear = 0.0;
		this.angular = 0.0;
		window.setInterval(this.send_loop.bind(this), 100);

		this.cmdVel = new ROSLIB.Topic({
			ros : ros,
			name : twist_topic,
			messageType : 'geometry_msgs/Twist'
		});

	}

	send = (linear, angular) => {
		this.linear = linear;
		this.angular = angular;
		this.continious_sending = false;
		this.twist(linear,angular);
	}

	continious_send = (linear, angular) => {
		this.linear = linear;
		this.angular = angular;
		this.continious_sending = true;
		this.twist(linear,angular);
	}

	clear = () => {
		this.continious_sending = false;
		this.linear = this.angular = 0.0;
		this.twist(0, 0);
	}

	twist = (forward, rotate) => {
		if(!connected) return;

		let twist = new ROSLIB.Message({
			linear : {
				x : forward * settings.linear,
				y : 0,
				z : 0
			},
			angular : {
				x : 0,
				y : 0,
				z : rotate * settings.angular
			}
		});
		this.cmdVel.publish(twist);
	}

	send_loop = () => {
		if(this.continious_sending) {
			this.twist(this.linear,this.angular);
		}
	}
}

// Serves the purpose of the Controller for now, we
// don't need anything more complex yet
// Connect the Views and the Models
window.addEventListener('load', function() {
	
	var twist = new Twist('/cmd_vel');

	var landscape_input = new Landscape();
	landscape_input.bind_sliders(twist.continious_send, twist.clear);

	var portrait_input = new Portrait();
	portrait_input.bind_buttons(twist.continious_send, twist.clear);
	portrait_input.bind_joystick(twist.send, twist.clear);

	var battery_state = new BatteryState('/battery_state');
	var battery_view = new BatteryView();
	battery_state.bind_update(battery_view.update, 0.02);


	var videostream = new VideoStream();
});


