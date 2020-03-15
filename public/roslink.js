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
	var twist = new ROSLIB.Message({
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

var twisttopic = new ROSLIB.Topic({
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
	name : '/camera/image/compressed',
	messageType : 'sensor_msgs/CompressedImage'
});

twisttopic.subscribe(function(data) {
	console.log('Received message on ' + twisttopic.name + ': ' + data);
	document.getElementById("battery").innerHTML = "Battery Voltage: "+data.linear.x+" "+data.angular.z+" V";
});

batterytopic.subscribe(function(data) {
	console.log('Received message on ' + batterytopic.name + ': ' + JSON.stringify(data));
	//document.getElementById("battery").innerHTML = "Battery Voltage: "+message.data.linear.x+" "+message.data.angular.z+" V";
});