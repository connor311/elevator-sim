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
			};
			
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
						} // end of next
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