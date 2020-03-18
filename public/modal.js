
function setModalTopics(){
	let block = document.getElementById("rostopics");

	block.innerHTML = "";
	for (let i = 0; i < topicsList.length; i++) {
		let val = topicsList[i];
		if(val.includes("tf2_web") || val.includes("agg") || val.includes("rosbridge"))
			block.innerHTML +=  "<input type='checkbox'/> <label for='checkbox'>"+topicsList[i]+"</label> <br/>";
		else
			block.innerHTML +=  "<input type='checkbox' checked/> <label for='checkbox'>"+topicsList[i]+"</label> <br/>";
	}
}


function recording(){
	let recbut = document.getElementById("recbutton");
	let licon = document.getElementById("lrecordicon");
	let picon = document.getElementById("precordicon");

	if(recbut.innerHTML == "Start recording."){
		recbut.innerHTML = "Stop recording.";
		licon.src = "assets/img/record_on.svg";
		picon.src = "assets/img/record_on.svg";
	}
	else{
		recbut.innerHTML = "Start recording."
		licon.src = "assets/img/record_off.svg";
		picon.src = "assets/img/record_off.svg";
	}
	closeModal("recordModal");
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