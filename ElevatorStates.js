/*
*
* Simulation Elevator States
*
*/

;(function(SimulationContext, $, undefined){

	SimulationContext.ElevatorStates = {};
	
	var baseState  = SimulationContext.ElevatorStates. baseState = function(m, stateName, defaultNextState, defaultNextStateParams){
		var that = {};
		
		that.stateName = stateName;
		
		that.nextState = defaultNextState;
		that.nextStateParams = defaultNextStateParams;
		
		that.setNextState = function(_nextState, params){
			that.nextState = _nextState;
			that.nextStateParams = params;
		};
		that.getNextState = function(){
			return new that.nextState(m, that.nextStateParams);
		};
		
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
		
		that.perform = function(){
		};
		
		that.tick = function(){
			that.processActions();
			return new that.nextState(m,that.nextStateParams);
		}; // end of tick
		
		return that;
	}; // end of baseState
	
	var stoppedState  = SimulationContext.ElevatorStates.stoppedState = function(m){
		var that = new baseState(m,"StoppedState", stoppedState),
			superProcessAction = that.processAction;
		
		var checkFloor = function(action){
			if(that.isCurrentFloor(action.param.level)){
				that.setNextState(openingDoorState);
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
		
		return that;
	}; // end of stoppedState
	
	var openingDoorState  = SimulationContext.ElevatorStates.openingDoorState = function(m){
		var that = new baseState(m,"openingDoorState", openDoorState),
			superProcessAction = that.processAction;
			
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
		
		return that;
	}; // end of openingDoorState
	
	var openDoorState  = SimulationContext.ElevatorStates.openDoorState = function(m, wait){
		
		if(wait === undefined){
			wait = 5; // TODO: pull from elevator
		}
		
		var that = new baseState(m,"openDoorState", openDoorState, wait-1),
			superProcessAction = that.processAction;
		
		if(wait <= 0){
			that.setNextState(closingDoorState);
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
		
		return that;
	}; // end of openDoorState
	
	var closingDoorState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"closingDoorState", stoppedState),
			superProcessAction = that.processAction;
			
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
		
		return that;
	}; // end of closingDoorState
	
	
	SimulationContext.ElevatorStates.StartState = stoppedState;
})(window.SimulationContext,jQuery);