
class VideoStream {

	constructor(){
		this.timeout_id = 0;
		this.open(document.getElementById("lvideostream"))
		this.open(document.getElementById("pvideostream"))
	}

	open(element){

		var on_press = (e) => {
			element.style.opacity = 0.7
		    this.timeout_id = setTimeout(function(){
		    	element.style.opacity = 1.0
		    	Modal.open('videoModal')
			}, 1000);
		}

		var on_unpress = (e) => {
			element.style.opacity = 1.0
			clearTimeout(this.timeout_id);
		}

		element.addEventListener('mousedown', on_press);
		element.addEventListener('touchstart', on_press);

		element.addEventListener('mouseup', on_unpress);
		element.addEventListener('touchend', on_unpress);
	}
}