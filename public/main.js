class Twist {
	constructor(twist_topic) {
		this.continious_sending = false;
		this.linear = 0.0;
		this.angular = 0.0;
		window.setInterval(this.continious_send.bind(this), 100);

		this.cmdVel = new ROSLIB.Topic({
			ros : ros,
			name : twist_topic,
			messageType : 'geometry_msgs/Twist'
		});

	};

	set = (linear, angular) => {
		this.linear = linear;
		this.angular = angular;
		this.continious_sending = true;
		this.twist(linear,angular);
	}

	clear = () => {
		if(!this.continious_sending) return;
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

	continious_send = () => {
		if(this.continious_sending) {
			this.twist(this.linear,this.angular);
		}
	}
}

class BatteryState {
	constructor(battery_topic) {
		this.prev_percentage = -1
		this.prev_voltage = -1

		this.batterytopic = new ROSLIB.Topic({
			ros : ros,
			name : battery_topic,
			messageType : 'sensor_msgs/BatteryState'
		});
	}

	// Bind an update function to be called when the battery hits a certain level
	bind_update = (callback, threshold) => {
		this.batterytopic.subscribe(function(msg) {
			//console.log('Received message on ' + batterytopic.name + ': ' + JSON.stringify(msg));
			let voltage = 0.0
			let percentage = 0.0

			if (this.prev_percentage > 0) {
				voltage = parseFloat(msg.voltage) * 0.4 + this.prev_voltage * 0.6;
				percentage = parseFloat(msg.percentage) * 0.4 + this.prev_percentage * 0.6;
			}
			else {
				voltage = parseFloat(msg.voltage);
				percentage = parseFloat(msg.percentage);
			}

			if (Math.abs(this.prev_percentage - percentage) >= threshold) {
				callback(voltage, percentage)
			}
			this.prev_percentage = percentage
			this.prev_voltage = voltage

		}.bind(this));
	}
}

class BatteryView {
	constructor() {
		this.display_image = -1;
		this.pbatteryicon = document.getElementById('pbatteryicon');
		this.lbatteryicon = document.getElementById('lbatteryicon');
		this.modal_voltage = document.getElementById("batt_voltage");
		this.modal_percentage = document.getElementById("batt_voltage");
	}

	update = (voltage, percentage) => {
		let displayvolt = Math.round(voltage*10)/10;
		let imageperc = Math.ceil(percentage*4)*25;
		let displayperc = Math.round(percentage*100);

		if(this.display_image != imageperc) {
			this.display_image = imageperc;
			this.pbatteryicon.src = "assets/img/"+imageperc+".svg";
			this.lbatteryicon.src = "assets/img/"+imageperc+".svg";
		}

		this.modal_voltage.innerHTML = "Voltage: "+displayvolt.toFixed(1)+" V";
		this.modal_percentage.innerHTML = "Percentage: "+displayperc+" %";
	}
}

// Serves the purpose of the Controller for now, we
// don't need anything more complex yet
// Connect the Views and the Models
window.addEventListener('load', function() {
	var twist = new Twist('/cmd_vel');
	var landscape_input = new Landscape();
	landscape_input.bind_sliders(twist.set, twist.clear);
	var portrait_input = new Portrait();
	portrait_input.bind_buttons(twist.set, twist.clear);
	portrait_input.bind_joystick(twist.set, twist.clear);

	var battery_state = new BatteryState('/battery_state');
	var battery_view = new BatteryView();
	battery_state.bind_update(battery_view.update, 0.02);
});


