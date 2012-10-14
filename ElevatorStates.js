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
					m.addFloorRequest(action.param.level,action.param.direction);
					break;
				default:
					m.logger.log("badAction", action);
					break;
			}
		}; // end of processAction
		
		that.processActions = function(){
			var a = undefined;
			
			while((a=m.nextAction()) !== undefined){
				that.processAction(a);
			}// end of nextAction while loop
		}; // end of processActions
		
		that.isCurrentFloor = function(level){
			return level === m.floor.level;
		}; // end of isCurrentFloor
		
		that.perform = function(){
			m.logger.log("perfomState", stateName);
		};
		
		that.tick = function(){
			that.processActions();
			that.perform();
			return new that.nextState(m,that.nextStateParams);
		}; // end of tick
		
		return that;
	}; // end of baseState
	
	var stoppedState  = SimulationContext.ElevatorStates.stoppedState = function(m){
		var that = new baseState(m,"StoppedState", stoppedState),
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
		
		that.perform = function(){
			s.perform();
			m.direction = m.Direction.Stopped;
			if(m.hasFloorRequest(m.floor.level)){
				that.setNextState(openingDoorState);
			}
			else if(m.nextRequest() !== undefined){
				that.setNextState(movingState);
			}
		}; // end of perform
		
		return that;
	}; // end of stoppedState
	
	var openingDoorState  = SimulationContext.ElevatorStates.openingDoorState = function(m,augmentedOpenDoorTime){
		var that = new baseState(m,"openingDoorState", openDoorState, augmentedOpenDoorTime),
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					if(!that.isCurrentFloor(action.param.level)){s.ProcessAction(action);}
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					s.ProcessAction(action);
					break;
			}
		};
		
		return that;
	}; // end of openingDoorState
	
	var openDoorState  = SimulationContext.ElevatorStates.openDoorState = function(m, wait){
		var that = new baseState(m,"openDoorState", openDoorState, wait-1),
			holdDoor = false,
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					if(that.isCurrentFloor(action.param.level)){holdDoor = true;}
					else{s.ProcessAction(action);}
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					s.ProcessAction(action);
					break;
			}
		};
		
		that.perform = function(){
			s.perform();
			m.getFloor(m.floor.level).processRequest(m.direction);
			if(wait === undefined){
				that.setNextState(openDoorState, 4); // TODO: pull from elevator
			}
			if(holdDoor){
				that.setNextState(openDoorState, wait+2);
			}else if(wait <= 0){
			that.setNextState(closingDoorState);
			}
		}; // end of perform
		
		return that;
	}; // end of openDoorState
	
	var closingDoorState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"closingDoorState", stoppedState),
			holdDoor = false,
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
			
		that.processAction = function(action){
			switch(action.name){
				case m.ACTION_NAMES.InternalFloorRequest:
				case m.ACTION_NAMES.ExternalFloorRequest:
					if(that.isCurrentFloor(action.param.level)){holdDoor = true;}
					else{s.ProcessAction(action);}
					break;
				default:
					// If here, I do not 
					// handle this action in this state
					s.ProcessAction(action);
					break;
			}
		};
		
		that.perform = function(){
			s.perform();
			if(holdDoor){
				that.setNextState(openingDoorState, 2);
			}
			if(m.nextRequest() !== undefined){
				that.setNextState(movingState);
			}
		}; // end of perform
		
		return that;
	}; // end of closingDoorState
	
	var movingState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"movingState", movingState),
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
		
		that.perform = function(){
			s.perform();
			var movingDirection = m.nextRequest();
			
			if(movingDirection === undefined){
				that.setNextState(stoppedState);
				return;
			}
			
			m.floor = m.floor.next(movingDirection);
			if(m.floor.hasRequest()){
				that.setNextState(openingDoorState);
			}
			
		}; // end of perform
		
		return that;
	}; // end of movingState
	
	
	SimulationContext.ElevatorStates.StartState = stoppedState;
})(window.SimulationContext,jQuery);
