var topicsList = [];
var drives = [];

var battery = {
	voltage: 26.0,
	percentage: 0.7
};

var ros = new ROSLIB.Ros({
	url : 'ws://'+window.location.hostname+':'+9090
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
	ROSLink.update();
});

ros.on('error', function(error) {
	alert("Error connecting to websocket server:"+ error);
	document.getElementById("pvideostream").src = "assets/img/novideo.jpg";
	document.getElementById("lvideostream").src = "assets/img/novideo.jpg";
});

ros.on('close', function() {
	alert("Connection to websocket server closed.");
	document.getElementById("pvideostream").src = "assets/img/novideo.jpg";
	document.getElementById("lvideostream").src = "assets/img/novideo.jpg";
});

var cmdVel = new ROSLIB.Topic({
	ros : ros,
	name : '/cmd_vel',
	messageType : 'geometry_msgs/Twist'
});

var batterytopic = new ROSLIB.Topic({
	ros : ros,
	name : '/battery_state',
	messageType : 'sensor_msgs/BatteryState'
});

var imageTopic = new ROSLIB.Topic({
	ros : ros,
	name : '/raspicam_node/image/compressed',
	//name : '/usb_cam/image_raw/compressed',
	messageType : 'sensor_msgs/CompressedImage'
});

var topicsClient = new ROSLIB.Service({
    ros : ros,
    name : '/rosapi/topics',
    serviceType : 'rosapi/Topics'
});

var disk_list = new ROSLIB.Service({
	ros : ros,
	name : '/disk_list',
	serviceType : 'magni_web/DiskList'
});

var rosbag_recorder = new ROSLIB.Service({
	ros : ros,
	name : '/rosbag_recorder',
	serviceType : 'magni_web/BagRecord'
});

var settings_manager = new ROSLIB.Service({
	ros : ros,
	name : '/settings_manager',
	serviceType : 'magni_web/Settings'
});

var motor_reconfigure = new ROSLIB.Service({
	ros : ros,
	name : '/ubiquity_velocity_controller/set_parameters',
	serviceType : 'dynamic_reconfigure/Reconfigure'
});

imageTopic.subscribe(function(msg) {
	//console.log('Received message on ' + imageTopic.name + ': ' + JSON.stringify(msg.data));

	if(window.matchMedia("(orientation:portrait)").matches)
		document.getElementById("pvideostream").src = "data:image/jpg;base64,"+msg.data;
	else
		document.getElementById("lvideostream").src = "data:image/jpg;base64,"+msg.data
});

batterytopic.subscribe(function(msg) {
	//console.log('Received message on ' + batterytopic.name + ': ' + JSON.stringify(msg));

	battery.voltage = parseFloat(msg.voltage) * 0.1 + battery.voltage * 0.9;
	battery.percentage = parseFloat(msg.percentage) * 0.1 + battery.percentage * 0.9;

	let displayvolt = Math.round(battery.voltage*10)/10;
	let imageperc = Math.ceil(battery.percentage*4)*25;
	let displayperc = Math.round(battery.percentage*100);

	let icon;

	if(window.matchMedia("(orientation:portrait)").matches)
		icon = document.getElementById("pbatteryicon");
	else
		icon = document.getElementById("lbatteryicon");

	icon.src = "assets/img/"+imageperc+".svg";
	document.getElementById("batt_voltage").innerHTML = "Voltage: "+displayvolt.toFixed(1)+" V";
	document.getElementById("batt_percentage").innerHTML = "Percentage: "+displayperc+" %";
});

class ROSLink{

	static twist(forward, rotate){
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
		cmdVel.publish(twist);
	}

	static update(){
		Settings.fetch();
		Record.fetch();
	}
}

