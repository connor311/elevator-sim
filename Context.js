/*
*
* Context.js - Context object
*
*
*/

;(function(window){	

Context = window.Context = window.Context || {};

Context.DIRECTION = {
	UP: 1,
	STOPPED:0,
	DOWN:-1,
	ToString: function(dir){
		switch(dir){
			case Context.DIRECTION.UP: return "Up";
			case Context.DIRECTION.DOWN: return "Down";
			case Context.DIRECTION.STOPPED: return "Stopped";
			default: return "Unknown";
		}
	}
};

Context.Log = function(output){
	if(window.console)
	{
		window.console.log(output);
	}
};

Context.Info = function(message, elevator, floor, control, direction){
	var output = message;
	if(direction != null && direction != "") { output = output + ", direction(" + Context.DIRECTION.ToString(direction) + ")";}
	if(elevator != null && elevator != "") { output = output + ", elevator(" + elevator + ")";}
	if(floor != null && floor != "") { output = output + ", floor(" + floor + ")";}
	if(control != null && control != "") { output = output + ", control(" + control + ")";}
	
	if(output != "") {Context.Log(output);}
	 
};

})(window);