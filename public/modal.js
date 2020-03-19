
class Modal{

	static open(modalID) {
		document.getElementById(modalID).style.display = "block";
	}

	static close(modalID) {
		document.getElementById(modalID).style.display = "none";
	}

}

window.onclick = function(event) {
	if (event.target == document.getElementById("batteryModal")) {
		document.getElementById("batteryModal").style.display = "none";
	} else 	if (event.target == document.getElementById("recordModal")) {
		document.getElementById("recordModal").style.display = "none";
	}

	let battery_mod = document.getElementById("batteryModal");
	let record_mod = document.getElementById("recordModal");
	let settings_mod = document.getElementById("settingsModal");

	switch(event.target) {
		case battery_mod: battery_mod.style.display = "none";    	break;
		case record_mod: record_mod.style.display = "none";    		break;
		case settings_mod: settings_mod.style.display = "none";    	break;
		default:
	}
}