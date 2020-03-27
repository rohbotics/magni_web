var topicsList = [];
var drives = [];

var battery = {
	voltage: 26.0,
	percentage: 0.7
};

var connected = false;

var ros = new ROSLIB.Ros({
	url : 'ws://'+window.location.hostname+':'+9090
});

ros.on('connection', function() {

	console.log('Connected to websocket server.');

	connected = true;
	document.getElementById("lconnstatus").innerHTML = "Connected.";
	document.getElementById("lconnstatus").style.color = "lightgray";

	ROSLink.update();
});

ros.on('error', function(error) {

	if(connected)
		alert("Error connecting to websocket server:"+ error);

	document.getElementById("pvideostream").src = "assets/img/novideo.jpg";
	document.getElementById("lvideostream").src = "assets/img/novideo.jpg";

	connected = false;
	document.getElementById("lconnstatus").innerHTML = "Disconnected.";
	document.getElementById("lconnstatus").style.color = "red";
});

ros.on('close', function() {

	if(connected)
		alert("Connection to websocket server closed.");

	document.getElementById("pvideostream").src = "assets/img/novideo.jpg";
	document.getElementById("lvideostream").src = "assets/img/novideo.jpg";

	connected = false;
	document.getElementById("lconnstatus").innerHTML = "Disconnected.";
	document.getElementById("lconnstatus").style.color = "red";
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

class ROSLink {

	static update(){
		Settings.fetch();
		Record.fetch();
	}
}

