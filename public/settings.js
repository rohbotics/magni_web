var settings = {

	linear: 0.5,
	angular: 0.5,

	wheel_left: 1.0,
	wheel_right: 1.0,

	use_joystick: false,

	rotate_camera: false,

	advanced_options: false
}

class Settings{

	static advanced_options(){
		settings.advanced_options = !settings.advanced_options;

		let advanced = document.getElementById("advancedrec");
		if(settings.advanced_options)
			advanced.style="display: block";
		else
			advanced.style="display: none";

		this.save();
	}

	static rotate_camera(checkbox){
		settings.rotate_camera = checkbox.checked;
		this.save();
	}

	static use_joystick(checkbox){
		settings.use_joystick = checkbox.checked;
		this.save();
	}

	static linear(slider){
		settings.linear = slider.value;
		document.getElementById("lineartext").innerHTML = "Linear speed: "+settings.linear;
		this.save();
	}

	static angular(slider){
		settings.angular = slider.value;
		document.getElementById("angulartext").innerHTML = "Angular speed: "+settings.angular;
		this.save();
	}

	static calibrate(){
		settings.wheel_left = document.getElementById("leftwheel").value;
		settings.wheel_right = document.getElementById("rightwheel").value;
		this.save();
	}

	static isJson(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	static fetch(){

		settings_manager.callService(new ROSLIB.ServiceRequest({
			save_data: "", 
			save: false

		}), function(result) {

			if(result.load_data.startsWith("{"))
			{
				let temp;
				try {
					temp = JSON.parse(result.load_data);
				} catch (e) {
					console.log("Malformed settings savefile.")
					return;
				}
				settings = temp;
				Settings.load();
				console.log("Loaded settings: "+result.load_data)
			}
			else{
				console.log("Malformed settings savefile")
			}

	    });

		this.load();
	}

	static load(){
		document.getElementById("leftwheel").value = settings.wheel_left;
		document.getElementById("rightwheel").value = settings.wheel_right;

		document.getElementById("rotate_camera").checked = settings.rotate_camera;
		document.getElementById("use_joystick").checked = settings.use_joystick;

		document.getElementById("lineartext").innerHTML = "Linear speed: "+settings.linear;
		document.getElementById("linearSlider").value = settings.linear;

		document.getElementById("angulartext").innerHTML = "Angular speed: "+settings.angular;
		document.getElementById("angularSlider").value = settings.angular;

		if(settings.rotate_camera){
			document.getElementById("pvideostream").classList.add("flip");
			document.getElementById("lvideostream").classList.add("flip");
		}else{
			document.getElementById("pvideostream").classList.remove("flip");
			document.getElementById("lvideostream").classList.remove("flip");
		}
	}

	static save(){

		settings_manager.callService(new ROSLIB.ServiceRequest({
			save_data: JSON.stringify(settings), 
			save: true

		}), function(result) {
			console.log("Saved settings.");
	    });	
	}
}