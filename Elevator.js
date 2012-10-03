/*
*
* Simulation Elevator
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Elevator = function(_id, _floors, _startLevel){
		var that = new SimulationContext.ProcessableObject(), // implement ProcessableObject
			Direction = SimulationContext.Direction, // quick access for direction
			m_id = _id,
			m_direction = Direction.Stopped,
			m_doorOpen = false,
			m_floor = undefined,
			m_floors = [],
			m_state = undefined;
			
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
							if(dir === Direction.Up) return this.up;
							if(dir == Direction.Down) return this.down;
							return this;
						} // end of next
					}; // end of floor creation
				
				if(f.level === startLevel){
					m_floor = f;
				} // end of level === startLevel
				
				m_floors.push(f);
			} // end of for loop
			
			m_floors = m_floors.sort(function(a,b){
				return a.level - b.level
			}); // end of floors sort
			
			var last = undefined;
			for(var i = 0; i<len; i++){
				
				m_floors[i].down = last;
				if(last !== undefined) last.up = m_floors[i];
			} // end of linked list for loop
		}; // end of processFloors
		
		
		that.id = function(){ return m_id; };
		
		that.direction = function(){ return m_direction; };
		
		//
		// Implement ProcessableObject
		// call states tick
		// and set next state with 
		// what is returned
		//
		that.tick = function(){
			m_state = m_state.tick();
		}; // end of tick
		
		processFloors(_floors,_startLevel);
		
		return that; // return collection of public methods and properties
	};
})(window.SimulationContext,jQuery);