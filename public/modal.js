
class Modal{

	static open(modalID) {
		document.getElementById(modalID).style.display = "block";
	}

	static close(modalID) {
		document.getElementById(modalID).style.display = "none";
	}

}

window.addEventListener('click', function(event) {
	if(event.target.classList.contains("modal")) {
		event.target.style.display = "none";
	}
});