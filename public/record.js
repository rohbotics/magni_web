
class Record{

	static fetch() {

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

	static populate_topics(){
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

	static toggle(){

		document.body.style.cursor = 'wait';

		if(document.getElementById("recbutton").innerHTML == "Start Recording ●")
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
				document.body.style.cursor = 'default';
			    document.getElementById("recbutton").innerHTML = "Stop Recording";
				document.getElementById("lrecordicon").src = "assets/img/record_on.svg";
				document.getElementById("precordicon").src = "assets/img/record_on.svg";
				Modal.close("recordModal");
		    });
		}
		else
		{
			rosbag_recorder.callService(new ROSLIB.ServiceRequest({
				topics: [], 
				path: "", 
				start: false

			}), function(result) {
				document.body.style.cursor = 'default';
				document.getElementById("recbutton").innerHTML = "Start Recording"
				document.getElementById("lrecordicon").src = "assets/img/record_off.svg";
				document.getElementById("precordicon").src = "assets/img/record_off.svg";
				Modal.close("recordModal");
				alert("Recording saved.")
		    });
		}
	}

}