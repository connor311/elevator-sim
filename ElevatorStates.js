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
				case m.ACTION_NAMES.ExternalFloorRequest:
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
			//m.logger.log("perfomState", stateName);
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
			if(m.direction !== m.Direction.Stopped){
				m.direction = m.Direction.Stopped;
				m.logger.log("stopped", [m.floor.level]);
			}
			if(m.hasFloorRequest(m.floor.level, m.Direction.Stopped)){
				that.setNextState(openingDoorState);
			}
			if(m.hasFloorRequest(m.floor.level, m.Direction.Up)){
				that.setNextState(openingDoorState);
				m.direction = m.Direction.Up;
			}
			if(m.hasFloorRequest(m.floor.level, m.Direction.Down)){
				that.setNextState(openingDoorState);
				m.direction = m.Direction.Down;
			}
			else if(m.nextRequest(m.direction) !== undefined){
				that.setNextState(movingState);
			}
		}; // end of perform
		
		return that;
	}; // end of stoppedState
	
	var openingDoorState  = SimulationContext.ElevatorStates.openingDoorState = function(m,params){
		
		if(params === undefined) params = {ticksLeft:0};
		
		var that = new baseState(m,"openingDoorState", openingDoorState, {augmentedOpenDoorTime:params.augmentedOpenDoorTime, ticksLeft:params.ticksLeft - 1}),
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
		
		that.perform = function(){
			s.perform();
			if(params.ticksLeft <= 0){
				that.setNextState(openDoorState, params.augmentedOpenDoorTime);
			}
			m.logger.log("doorOpening", [m.floor.level]);
		}; // end of perform
		
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
			if(m.doorOpen == false){
				m.doorOpen = true;
				m.logger.log("doorOpen", [m.floor.level]);
			}
		}; // end of perform
		
		return that;
	}; // end of openDoorState
	
	var closingDoorState = SimulationContext.ElevatorStates.closingDoorState = function(m, ticksLeft){
		
		if(ticksLeft === undefined) ticksLeft = 0; //Todo pull from elevator
		
		var that = new baseState(m,"closingDoorState", closingDoorState, ticksLeft - 1),
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
				that.setNextState(openingDoorState, {augmentedOpenDoorTime:2});
			}else if(ticksLeft <= 0){
				that.setNextState(closedDoorState);
			}
			m.logger.log("doorClosing", [m.floor.level]);
		}; // end of perform
		
		return that;
	}; // end of closingDoorState
	
	var closedDoorState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"closedDoorState", stoppedState),
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
				that.setNextState(openingDoorState, {augmentedOpenDoorTime:2});
			}
			if(m.nextRequest(m.direction) !== undefined){
				that.setNextState(movingState);
			}
			m.doorOpen = false;
			m.logger.log("doorClosed", [m.floor.level]);
		}; // end of perform
		
		return that;
	}; // end of closedDoorState
	
	var movingState = SimulationContext.ElevatorStates.closingDoorState = function(m, movingLeft){
		var that = new baseState(m,"movingState", movingState, movingLeft - 1),
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
		
		that.perform = function(){
			s.perform();
			if(movingLeft === undefined){ // do here not on create because i need to set direction on first call
				that.setNextState(movingState, 4); // TODO: pull from elevator
				m.direction = m.nextRequest(m.direction);
			}else if(movingLeft <= 0){
				that.setNextState(checkFloorRequestsState);
			}
			m.logger.log("moving", [m.direction]);
		}; // end of perform
		
		return that;
	}; // end of movingState
	
	var checkFloorRequestsState = SimulationContext.ElevatorStates.closingDoorState = function(m){
		var that = new baseState(m,"checkFloorRequestsState", movingState),
			s={};
			s.perform=that.perform;
			s.ProcessAction = that.processAction;
		
		that.perform = function(){
			s.perform();
			var movingDirection = m.nextRequest(m.direction);
			
			if(movingDirection === undefined){
				that.setNextState(stoppedState);
				return;
			}
			
			m.floor = m.floor.next(movingDirection);
			if(m.floor.hasRequest(movingDirection)){
				that.setNextState(openingDoorState);
			}
			
			m.logger.log("atFloor", [m.floor.level]);
			
		}; // end of perform
		
		return that;
	}; // end of checkFloorRequestsState
	
	
	SimulationContext.ElevatorStates.StartState = stoppedState;
})(window.SimulationContext,jQuery);
