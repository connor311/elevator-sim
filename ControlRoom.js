/*
*
* ControlRoom.js - Control Room object
*
*
*/

;(function(window, $, Context){
	
	var ControlRoom = Context.ControlRoom = function(id, floors, numElevators){
		var m_id = id,
			m_elevators = [];
		    
	    var elevatorCallback = function(api){
	    	m_elevators.push(api);
	    };
	    
	    var floorAPI = {};
	    
	    floorAPI.Id = m_id;
	    
	    floorAPI.stopRequested = function(id, dir){
	    	var i=0,
	    		stoppedElevatorNotified = false;
	    	for(i=0;i<m_elevators.length;i++){
	    		var el = m_elevators[i];
	    		if(!el.isOnJob()){
	    			if(stoppedElevatorNotified) {
	    				return;
	    			}
	    			stoppedElevatorNotified = true;
	    		}
	    		m_elevators[i].requestFloor(id);
	    	}
	    };
	    
	    var init = function(n, floors){
	    	var i = 0,
	    		elevatorAPIs = [];
	    	for(i=0;i<floors.length;i++){
	    		elevatorAPIs.push(floors[i].registerElevatorControl(floorAPI));
	    	}
	    	
	    	for(i=0;i<n;i++){
	    		new Context.Elevator(i+1, elevatorAPIs, floors[0].Name, elevatorCallback);
	    	}
	    };
	    
	    this.Id = m_id;
	    
	    init(numElevators, floors);
		
	};
	
	ControlRoom.prototype = {
		constructor: ControlRoom
	};
})(window, jQuery, window.Context);