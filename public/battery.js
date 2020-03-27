
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
				voltage = parseFloat(msg.voltage) * 0.3 + this.prev_voltage * 0.7;
				percentage = parseFloat(msg.percentage) * 0.3 + this.prev_percentage * 0.7;
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