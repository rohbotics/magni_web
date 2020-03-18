
function setModalTopics(){
	let block = document.getElementById("rostopics");

	block.innerHTML = "";
	for (let i = 0; i < topicsList.length; i++) {
		let val = topicsList[i];
		if(val.includes("tf2_web") || val.includes("agg") || val.includes("rosbridge"))
			block.innerHTML +=  "<input class='checks' alt='"+topicsList[i]+"' type='checkbox'/> <label for='checkbox'>"+topicsList[i]+"</label> <br/>";
		else
			block.innerHTML +=  "<input class='checks' alt='"+topicsList[i]+"' type='checkbox' checked/> <label for='checkbox'>"+topicsList[i]+"</label> <br/>";
	}

	let savepath = document.getElementById("savepath");

	savepath.innerHTML = "";
	for (let i = 0; i < drives.length; i++) {
		savepath.innerHTML += "<option value='"+drives[i].path+"''>"+drives[i].tag+"</option>";
	}
}

function recording(){
	if(document.getElementById("recbutton").innerHTML == "Start recording.")
	{
		let savepath = document.getElementById("savepath");
		let block = document.getElementById("rostopics");

		let path = savepath.options[savepath.selectedIndex].value;
		let checkboxes = document.getElementsByClassName("checks");

		let topics = [];

		for (var i = 0; i < checkboxes.length; i++) {
			if(checkboxes[i].checked)
				topics.push(checkboxes[i].alt);
		}

		rosbag_recorder.callService(new ROSLIB.ServiceRequest({
			topics: topics, 
			path: path, 
			start: true

		}), function(result) {
		    document.getElementById("recbutton").innerHTML = "Stop recording.";
			document.getElementById("lrecordicon").src = "assets/img/record_on.svg";
			document.getElementById("precordicon").src = "assets/img/record_on.svg";
			closeModal("recordModal");
	    });
	}
	else
	{
		rosbag_recorder.callService(new ROSLIB.ServiceRequest({
			topics: [], 
			path: "", 
			start: false

		}), function(result) {
			document.getElementById("recbutton").innerHTML = "Start recording."
			document.getElementById("lrecordicon").src = "assets/img/record_off.svg";
			document.getElementById("precordicon").src = "assets/img/record_off.svg";
			closeModal("recordModal");
	    });
	}
}

function openModal(modalID) {
	document.getElementById(modalID).style.display = "block";
}

function closeModal(modalID) {
	document.getElementById(modalID).style.display = "none";
}

window.onclick = function(event) {
	if (event.target == document.getElementById("batteryModal")) {
		document.getElementById("batteryModal").style.display = "none";
	} else 	if (event.target == document.getElementById("recordModal")) {
		document.getElementById("recordModal").style.display = "none";
	}
}