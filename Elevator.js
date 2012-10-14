/*
*
* Simulation Elevator
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Elevator = function(_id, _floors, _startLevel){
		var that = new SimulationContext.ProcessableObject(), // implement ProcessableObject
			m = {}; // private variables, make easier to pass to states
			m.logger = new SimulationContext.Logger("Elevator", _id);
			m.Direction = SimulationContext.Direction; // quick access for direction
			m.id = _id;
			m.direction = m.Direction.Stopped;
			m.doorOpen = false;
			m.floor = undefined;
			m.floors = [];
			m.state = undefined;
			m.actions = [];
			m.addAction = function(action,obj){
				m.actions.push({name:action,param:obj});
			}; // end of addAction
			m.nextAction = function(){
				return m.actions.shift();
			}; // end of nextAction
			m.ACTION_NAMES = {
				InternalFloorRequest:0,
				ExternalFloorRequest:1,
			}; // end of ACTION_NAMES
			m.getFloor = function(level){
				var len = m.floors ? m.floors.length : 0;
				for(var i = 0; i<len; i++){
					var f = m.floors[i];
					if(f.level == level){
						return f;
					}
				}
				return undefined;
			}; // end of getFloor
			m.addFloorRequest = function(level,direction){
				var f = m.getFloor(level);
				if(f !== undefined){
					f.addRequest(direction);
				}
			}; // end of addFloorRequest
			m.hasFloorRequest = function(level,direction){
				var f = m.getFloor(level);
				if(f !== undefined){
					return f.hasRequest(direction);
				}
				return false;
			}; // end of hasFloorRequest
			m.nextRequest = function(direction){
				var currentDirection = direction,
					floorToCheck = undefined;
					
				if(currentDirection === m.Direction.Stopped){
					currentDirection = m.Direction.Up; // always check up first
				}
				
				if((floorToCheck = m.floor.next(currentDirection)) !== undefined 
					&& floorToCheck.hasRequest(currentDirection, true)){
					return currentDirection;
				}
				
				var otherDirection = m.Direction.flip(currentDirection);
				if((floorToCheck = m.floor.next(otherDirection)) !== undefined
					&& floorToCheck.hasRequest(otherDirection, true)){
					return otherDirection;
				}
				
				
				if((floorToCheck = m.floor.next(currentDirection)) !== undefined
					&& floorToCheck.hasRequest(otherDirection, true, currentDirection)){
					return currentDirection;
				}
				
				if((floorToCheck = m.floor.next(otherDirection)) !== undefined 
					&& floorToCheck.hasRequest(currentDirection, true, otherDirection)){
					return otherDirection;
				}
				
				return undefined;
			}; // end of nextRequest
			
			
		var processFloors = function(floors, startLevel){
			var len = floors ? floors.length : 0;
			
			for(var i = 0; i<len; i++){
				var fsi = floors[i],
					f = {
						id: fsi.id,
						level: fsi.level,
						up: undefined,
						down: undefined,
						next: function(dir){
							if(dir === m.Direction.Up) return this.up;
							if(dir == m.Direction.Down) return this.down;
							return this;
						}, // end of next
						requests:{
							up:false,
							down:false,
							stop:false
						}, // end of requests
						addRequest: function(direction){
							if(direction === m.Direction.Up){this.requests.up = true;}
							else if(direction === m.Direction.Down){this.requests.down = true;}
							else {this.requests.stop = true;}
						}, // end of addRequest
						hasRequest: function(direction,recursive, crawlDirection){
							if(this.requests.stop){return true;}
							if(direction === m.Direction.Up && this.requests.up){return true;}
							if(direction === m.Direction.Down && this.requests.down){return true;}
							
							if(recursive){
								if(crawlDirection === undefined) crawlDirection = direction;
								var next = this.next(crawlDirection);
								if(next !== undefined && next !== this){
									return next.hasRequest(direction, recursive, crawlDirection);
								}
							}
							return false;
						}, // end of hasRequests
						processRequest: function(direction){
							this.requests.stop = false;
							if(direction === m.Direction.Up){this.requests.up = false;}
							if(direction === m.Direction.Down){this.requests.down = false;}
						}, // end of processRequest
					}; // end of floor creation
				
				if(f.level === startLevel){
					m.floor = f;
				} // end of level === startLevel
				
				m.floors.push(f);
			} // end of for loop
			
			m.floors = m.floors.sort(function(a,b){
				return a.level - b.level
			}); // end of floors sort
			
			var last = undefined;
			for(var i = 0; i<len; i++){
				m.floors[i].down = last;
				if(last !== undefined) last.up = m.floors[i];
				m.logger.log("registered", m.floors[i].id);
				last = m.floors[i];
			} // end of linked list for loop
		}; // end of processFloors
		
		
		that.id = function(){ return m.id; };
		
		that.direction = function(){ return m.direction; };
		
		that.requestFloor = function(level,direction){
			if(direction === undefined){
				m.addAction(m.ACTION_NAMES.InternalFloorRequest,{level:level});
			}else{
				m.addAction(m.ACTION_NAMES.ExternalFloorRequest,{level:level,direction:direction});
			}
		};
		
		//
		// Implement ProcessableObject
		// call states tick
		// and set next state with 
		// what is returned
		//
		that.tick = function(){
			m.state = m.state.tick();
		}; // end of tick
		
		processFloors(_floors,_startLevel);
		m.state = new SimulationContext.ElevatorStates.StartState(m);
		
		return that; // return collection of public methods and properties
	};
	if(SimulationContext.ElevatorStates.StartState === undefined){
		SimulationContext.ElevatorStates.StartState = function(m){
			var that = {};
			
			that.tick = function(){
				m.logger.log("error","Please define SimulationContext.Elevator.StartState");
				return that; // just return self
			}; // end of tick
			
			return that;
		}; // end defaultStartState
	} // end of undefined check
})(window.SimulationContext,jQuery);