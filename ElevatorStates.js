/*
*
* Simulation Elevator States
*
*/

;(function(SimulationContext, $, undefined){

	SimulationContext.ElevatorStates = {};
	
	var baseState  = SimulationContext.ElevatorStates. baseState = function(m, stateName){
		var that = {};
		
		that.stateName = stateName;
		
		that.nextState = undefined;
		
		that.processAction = function(action){switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					break;
				case m.ACTION_NAMES.ExternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					break;
				default:
					m.logger.log("badAction", action);
					break;
			}
		}; // end of processAction
		
		that.processActions = function(){
			m.logger.log("startState", stateName);
			var a = undefined;
			
			while((a=m.nextAction()) !== undefined){
				that.processAction(a);
			}// end of nextAction while loop
		}; // end of processActions
		
		that.isCurrentFloor = function(level){
			return level === m.floor.level;
		}; // end of isCurrentFloor
		
		return that;
	}; // end of baseState
	
	var stoppedState  = SimulationContext.ElevatorStates.stoppedState = function(m){
		var that = new baseState(m,"StoppedState"),
			superProcessAction = that.processAction;

		that.nextState = function() { return new stoppedState(m); } ;
		
		var checkFloor = function(action){
			if(that.isCurrentFloor(action.param.level)){
				that.nextState = function() { return new openingDoorState(m); };
			}else{
				superProcessAction(action);
			}
		};
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					checkFloor(action);
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					superProcessAction(action);
					break;
			}
		};
		
		that.tick = function(){
			that.processActions();
			return that.nextState();
		}; // end of tick
		
		return that;
	}; // end of stoppedState
	
	var openingDoorState  = SimulationContext.ElevatorStates.openingDoorState = function(m){
		var that = new baseState(m,"openingDoorState"),
			superProcessAction = that.processAction;
			
		that.nextState = function() { return new openDoorState(m);};
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					superProcessAction(action);
					break;
			}
		};
		
		that.tick = function(){
			that.processActions();
			return that.nextState();
		}; // end of tick
		
		return that;
	}; // end of openingDoorState
	
	var openDoorState  = SimulationContext.ElevatorStates.openDoorState = function(m, wait){
		
		if(wait === undefined){
			wait = 5; // TODO: pull from elevator
		}
		
		var that = new baseState(m,"openDoorState"),
			superProcessAction = that.processAction;
		
		if(wait > 0){
			that.nextState = function() { return new openDoorState(m, wait-1);};
		}else{
			that.nextState = function() { return new closingDoorState(m);};
		}
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					superProcessAction(action);
					break;
			}
		};
		
		that.tick = function(){
			that.processActions();
			return that.nextState();
		}; // end of tick
		
		return that;
	}; // end of openDoorState
	
	var closingDoorState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"closingDoorState"),
			superProcessAction = that.processAction;
			
		that.nextState = function() { return new stoppedState(m);};
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					m.logger.log("FloorRequest", [action.param.level,m.Direction.toString(action.param.direction)]);
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					superProcessAction(action);
					break;
			}
		};
		
		that.tick = function(){
			that.processActions();
			return that.nextState();
		}; // end of tick
		
		return that;
	}; // end of closingDoorState
	
	
	SimulationContext.ElevatorStates.StartState = stoppedState;
})(window.SimulationContext,jQuery);