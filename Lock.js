/*
*
* Lock.js - object lock
*
*
*/

;(function(Context){
	Context.Lock = Lock = function(){
		var isLocked = false,
			queue = [];
			
		this.Lock = function(callback){
			queue.push(callback);
			if(isLocked) return;
			isLocked = true;
			var c = null;
			while((c = queue.pop()) != null){
				c();
			}
			isLocked = false;
		};
	};
	
	Lock.prototype = {
		Constructor: Lock,
		
	};
})(window.Context);