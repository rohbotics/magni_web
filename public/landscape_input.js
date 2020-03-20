var inputmixer = {
	linear: 0,
	angular: 0
}

class Landscape{

	static get(id){
		return document.getElementById(id);
	}

	static read_slider(element){

		if(element.id == "joy_linear")
			inputmixer.linear = element.value;
		else if(element.id == "joy_angular")
			inputmixer.angular = -element.value;
		
		Twist.set(inputmixer.linear, inputmixer.angular);
	}

	static reset_slider(element){

		if(element.id == "joy_linear")
			inputmixer.linear = 0;
		else if(element.id == "joy_angular")
			inputmixer.angular = 0;
		
		element.value = 0;
		
		if(inputmixer.linear == 0 && inputmixer.angular == 0)
			Twist.clear();
		else
			Twist.set(inputmixer.linear, inputmixer.angular);
	}
}