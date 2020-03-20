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
		this.load();
	}

	static use_joystick(checkbox){
		settings.use_joystick = checkbox.checked;

		if(settings.use_joystick)
			alert("If using a mobile device, go to browser settings and select \"Add to Home screen\" to remove the address bar and use as a fullscreen app. \n\nJoystick use causes address bar autohide problems.")

		this.save();
		this.load();
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
		this.reconfigure();
		this.save();
	}

	static reconfigure(){
		motor_reconfigure.callService(new ROSLIB.ServiceRequest({
			config: {
				bools: [],
				ints: [],
				strs: [],
				doubles: [
					{
						name: 'left_wheel_radius_multiplier', 
						value: settings.wheel_left
					},
					{
						name: 'right_wheel_radius_multiplier', 
						value: settings.wheel_right
					},
				],
				groups: []
			}
		}), function(result) {
			console.log('Result for service call on '+motor_reconfigure.name+ ': '+JSON.stringify(result, null, 2));
		});
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
				Settings.reconfigure();
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

		if(settings.use_joystick){
			document.getElementById("arrows1").style.visibility = "hidden";
			document.getElementById("arrows2").style.visibility = "hidden";
			document.getElementById("arrows3").style.visibility = "hidden";

			document.getElementById("larrows1").style.visibility = "hidden";
			document.getElementById("larrows2").style.visibility = "hidden";
			document.getElementById("joystick1").style.visibility = "";
			document.getElementById("joystick2").style.visibility = "";
		}else{
			document.getElementById("arrows1").style.visibility = "";
			document.getElementById("arrows2").style.visibility = "";
			document.getElementById("arrows3").style.visibility = "";

			document.getElementById("larrows1").style.visibility = "";
			document.getElementById("larrows2").style.visibility = "";
			document.getElementById("joystick1").style.visibility = "hidden";
			document.getElementById("joystick2").style.visibility = "hidden";
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

	static show_joystick(){
		let rect = document.getElementById("controlbox").getBoundingClientRect();

		let radius = window.innerHeight*0.8 - window.innerWidth * 0.75;
		if(radius > window.innerWidth*0.95)
			radius = window.innerWidth*0.95;

		var base = document.createElement("img");
		base.src = "assets/img/joystick_base.svg";
		base.style = "width: "+radius+"px; height: "+radius+"px;";

		var stick = document.createElement("img");
		stick.src = "assets/img/joystick_stick.svg";
		stick.style = "width: "+radius*0.4+"px; height: "+radius*0.4+"px;";

		joystick = new VirtualJoystick({
			stickElement: stick,
			baseElement: base,
			mouseSupport: true,
			stationaryBase: true,
			baseX: window.innerWidth/2,
			baseY: (rect.bottom + rect.top)/2,
			limitStickTravel: true,
			stickRadius: radius/2,
		});
	}

	static hide_joystick(){
		joystick.destroy();
		joystick = undefined;
	}
}