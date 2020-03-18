'use strict';

var topicsList = [];
var drives = [];

var velocity = {
	angular: 0.5,
	linear: 0.5
};

var battery = {
	voltage: 26.0,
	percentage: 0.7
};

var ros = new ROSLIB.Ros({
	url : 'ws://'+window.location.hostname+':'+9090
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
	updateTopics();
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

function updateLinear(val){
	velocity.linear = val;
	document.getElementById("lineartext").innerHTML = "Linear speed: "+velocity.linear
}

function updateAngular(val){
	velocity.angular = val;
	document.getElementById("angulartext").innerHTML = "Angular speed: "+velocity.angular
}

function sendTwist(forward, rotate){
	let twist = new ROSLIB.Message({
		linear : {
			x : forward * velocity.linear,
			y : 0,
			z : 0
		},
		angular : {
			x : 0,
			y : 0,
			z : rotate * velocity.angular
		}
	});
	cmdVel.publish(twist);
}

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



function updateTopics() {

	disk_list.callService(new ROSLIB.ServiceRequest(), function(result) {
		let list = JSON.parse(result.lsblk).blockdevices;

		drives = [];

		for (let i = 0; i < list.length; i++) {
			if(list[i].name.startsWith("sd"))
				drives.push(list[i])
		}

		for (let i = 0; i < drives.length; i++) {
			let tag = drives[i].name + " " + (parseInt(drives[i].size.split(",")[0])+1)+"GB ";

			if(drives[i].children.length == 1){
				let split = drives[i].children[0].mountpoint.split("/");
				tag += split[split.length-1];
				drives[i].path = drives[i].children[0].mountpoint;
			}
			else if (drives[i].name == "sda"){
				tag += result.homedir;
				drives[i].path = result.homedir;
			}

			drives[i].tag = tag;
		}
	});

    topicsClient.callService(new ROSLIB.ServiceRequest(), function(result) {
	    topicsList = result.topics;
    });
};