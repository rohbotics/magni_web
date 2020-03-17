'use strict';

//IP_ADDRESS and PORT get dynamically altered by the server, DO NOT TOUCH

var IP_ADDRESS = '10.0.42.1';
var PORT = '9090';

var ros = new ROSLIB.Ros({
	url : 'ws://'+IP_ADDRESS+':'+PORT
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
	console.log('Connection to websocket server closed.');
});

var cmdVel = new ROSLIB.Topic({
	ros : ros,
	name : '/cmd_vel',
	messageType : 'geometry_msgs/Twist'
});

function sendTwist(forward, rotate){
	let twist = new ROSLIB.Message({
		linear : {
			x : forward,
			y : 0,
			z : 0
		},
		angular : {
			x : 0,
			y : 0,
			z : rotate
		}
	});
	cmdVel.publish(twist);
}

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

imageTopic.subscribe(function(msg) {
	console.log('Received message on ' + imageTopic.name + ': ' + JSON.stringify(msg.data));

	if(window.matchMedia("(orientation:portrait)").matches)
		document.getElementById("pvideostream").src = "data:image/jpg;base64,"+msg.data;
	else
		document.getElementById("lvideostream").src = "data:image/jpg;base64,"+msg.data

});

var battery = {
	voltage: 26.0,
	percentage: 0.0
}

batterytopic.subscribe(function(msg) {
	console.log('Received message on ' + batterytopic.name + ': ' + JSON.stringify(msg));

	battery.voltage = parseFloat(msg.voltage) * 0.1 + battery.voltage * 0.9;
	battery.percentage = parseFloat(msg.percentage) * 0.1 + battery.percentage * 0.9;

	let displayvolt = Math.round(battery.voltage*10)/10;
	let displayperc = Math.round(battery.percentage)*100;

	if(window.matchMedia("(orientation:portrait)").matches)
		document.getElementById("pbattery").innerHTML = "Battery: "+displayvolt.toFixed(1)+"V "+displayperc+"%";
	else
		document.getElementById("lbattery").innerHTML = "Battery: "+displayvolt.toFixed(1)+"V "+displayperc+"%";
});