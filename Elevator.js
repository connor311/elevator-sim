/*
*
* Elevator.js - Elevator object
*
*
*/
;(function(window, $, Context){

Context.Elevator = Elevator = function(elevatorNum, initialFloors, initialLevel, createrCallback){
	var KEEP_DOOR_OPEN = 10000,
		MOVE_BETWEEEN_FLOOR = 10000,
		m_id = elevatorNum,
	    m_floors = [],
	    m_levels = {},
	    DIRECTION = Context.DIRECTION,
	    m_onJob = DIRECTION.STOPPED,
	    m_moving = DIRECTION.STOPPED,
	    m_currentFloor = null,
	    m_doorOpen = false,
	    m_doorOpenTimeout = null,
	    m_movingTimeout = null,
	    m_requestCount = {
	    	"1":0, // up
	    	"-1":0, // down
	    	all:0
	    };
	    
	    var createElevatorFloor = function(floorElevatorAPI){
	    	return {
	    		level: floorElevatorAPI.Id,
	    		requested:false,
	    		checkFloor:true,
	    		requestedDir:DIRECTION.STOPPED,
	    		shouldStop: floorElevatorAPI.shouldStop,
	    		stopping: floorElevatorAPI.stopping,
	    		up:null,
	    		down:null,
	    		request: function(dir){
	    			if(dir == null){
	    				if(this.requested){
	    					this.checkFloor = false;
	    					this.requestedDir = DIRECTION.STOPPED
	    					return false;
	    				}
	    				this.requested = false;
    					this.checkFloor = false;
    					this.requestedDir = DIRECTION.STOPPED
    					return true;
	    			}
	    			if(this.requested){
	    				return false;
	    			}
	    			this.requested = true;
	    			this.checkFloor = true;
	    			this.requestedDir = dir;
	    			return true;
	    		},
	    		shouldStop: function(currentDir){
	    			if(!this.requested)
	    			{
	    				return false;
	    			}
	    			if(!this.checkFloor)
	    			{
	    				return true;
	    			}
	    			if(this.shouldStop(currentDir))
	    			{
	    				return true;
	    			}
	    			return false;
	    		},
	    		whatDirectionToMove: function(currentDir){
	    			
	    			
	    			return dir;
	    		}
	    	};
	    };
	    
	    var initFloors = function(floors,startFloor){
	    	m_levels = {};
	    	m_levels.length = 0;
	    	
	    	var lastFloor = null;
	    	var i = 0;
	    	for(i=0;i<floors.length;i++){
	    		var c = createElevatorFloor(floors[i]);
	    		c.index = m_floors.push( c ) - 1;
	    		m_levels[c.level] = c;
	    		m_levels.length++;
	    		if(lastFloor) lastFloor.up = c;
	    		c.down = lastFloor;
	    		lastFloor = c;
	    		Context.Info("registered",m_id,lastFloor.Id);
	    	}
	    	m_currentFloor = m_levels[startFloor];
	    };
	    
	    var IsMoving = function(){return m_moving != DIRECTION.STOPPED;};
	    var IsOnJob = function(){return m_onJob != DIRECTION.STOPPED;};
	    
	    var getNextFloor = function(floor, direction){
	    	if(direction == DIRECTION.UP) return floor.up;
	    	if(direction == DIRECTION.DOWN) return floor.down;
	    };
	    
	    var stopAndOpenDoors = function(){
				updateRequestCount(m_moving, -1);
   				m_currentFloor.stopping(m_moving);
   				m_moving = DIRECTION.STOPPED
   				openDoor(move);
	    };
	    
	    var move = function(){
	    	
	    	if(m_requestCount.all == 0 && // Have all requests been answered
	    		!m_currentFloor.shouldStop(switchDirections(m_onJob))){ // not if reqeust in other direction on current floor
	    		m_moving = m_onJob = DIRECTION.STOPPED;
	    		Context.Info("Stop",m_id);
	    		return;
	    	}
	    	
	    	if(m_requestCount[m_onJob] == 0){
	    		m_onJob = switchDirections(m_onJob);
	    	}
	    	
	    	m_moving = m_onJob;
	    	
   			nextFloor = getNextFloor(m_currentFloor, m_moving);
   			
	    	if(m_movingTimeout != null) clearTimeout(m_movingTimeout);
	    	Context.Info("Moving",m_id,nextFloor.level);
	    	m_movingTimeout = setTimeout(function(){
	    		m_currentFloor = nextFloor;
	    		Context.Info("Arrived",m_id,m_currentFloor.level);
    			
    			if(m_currentFloor.requested && m_currentFloor.checkFloor){
    				// reqeusted from floor
    				if(m_currentFloor.shouldStop(m_moving)){
    					// floor request still valid
    					stopAndOpenDoors();
    				}else{
    					// request on floor has already been
    					// filled
    					updateRequestCount(m_moving, -1);
    					m_currentFloor.requested = false;
    				}
    				
    			}else if(m_currentFloor.requested && !m_currentFloor.checkFloor){
    				// requested from inside elevator
   					stopAndOpenDoors();
    			}else{
    				// floor not requested
    				// so move to next floor
   					move();
    			}
   			
    		},MOVE_BETWEEEN_FLOOR);
	    };
	    
	    var getDirection = function(elevatorFloor){
    		if(elevatorFloor.index > m_currentFloor.index) return DIRECTION.UP;
    		
    		if(elevatorFloor.index < m_currentFloor.index) return DIRECTION.DOWN;
    		
    		return DIRECTION.STOPPED;
	    };
	    
	    var beginMove = function(elevatorFloor){
    		if(IsOnJob()) return;
    		
    		var dirToMove = getDirection(elevatorFloor);
    		
    		Context.Info("Start",m_id,null,null,dirToMove);
    		m_onJob = dirToMove;
    		move();
	    };
	    
	    var switchDirections = function(dir){
	    	if(dir == DIRECTION.UP) return DIRECTION.DOWN;
	    	if(dir == DIRECTION.DOWN) return DIRECTION.UP;
	    	return DIRECTION.STOPPED;
	    };
	    
	    var updateRequestCount = function(dir, num){
	    		m_requestCount.all =m_requestCount.all + num; 
	    		m_requestCount[dir] = m_requestCount[dir] + num;
	    		
	    		if(m_requestCount.all < 0) m_requestCount.all = 0;
	    		if(m_requestCount[dir] < 0) m_requestCount[dir] = 0;
	    };
	    
	    var tryToGoToFloor = function(elevatorFloor){
	    	
	    	var dir = getDirection(elevatorFloor);
	    	if(dir == DIRECTION.STOPPED && IsMoving()){
	    		dir = switchDirections(m_moving);
	    	}
	    	updateRequestCount(dir, 1);
	    	
	    	if(!IsOnJob()){
	    		if(elevatorFloor.index == m_currentFloor.index){
	    			
	    			updateRequestCount(dir, -1);
	    			openDoor();
	    		}
				else beginMove(elevatorFloor);
				return;
	    	}
	    };
	    
	    var keepDoorOpen = function(time,onClose){
	    	if(m_doorOpenTimeout != null) clearTimeout(m_doorOpenTimeOut);
	    	m_doorOpenTimeOut = setTimeout(function(){
	    		closeDoor();
	    		if($.isFunction(onClose)){onClose();}
	    		}, time);
	    };
	    
	    var openDoor = function(onClose){
	    		if(IsMoving() || m_doorOpen) return;
	    		
	    		Context.Info("Open",m_id);
	    		m_doorOpen = true;
	    		keepDoorOpen(KEEP_DOOR_OPEN,onClose);
	    };
	    
	    var closeDoor = function(){
	    		if(!m_doorOpen) return;
	    		
	    		Context.Info("Close",m_id);
	    		m_doorOpen = false;
	    		m_currentFloor.requested = false;
	    };
	    
	    var requestFloor = function(level,checkFloor){
			var reqFloor = m_levels[level];
			if(reqFloor != null && !reqFloor.requested){
				reqFloor.requested = true;
				reqFloor.checkFloor = checkFloor;
				Context.Info("Requested",m_id,reqFloor.level)
				tryToGoToFloor(reqFloor);
			}
		};
	    
	    initFloors(initialFloors, initialLevel);
	    
	    // PUBLIC METHODS
	    
	    this.controlPanel = {};
	    
	    this.controlPanel.whatFloors = function(){
	    	var f = [],
	    		i=0;
    		for(i=0;i<m_floors.length;i++){
    			f.push(m_floors[i].level);
    		}
	    	return f;
	    };
	    
	    this.controlPanel.requestFloor =function(level){
	    	requestFloor(level,false);
	    };
	    
	    // Creator Only Methods
	    if(createrCallback != null && $.isFunction(createrCallback))
	    {
		    createrCallback({
		    	Id:m_id,
	    		currentFloor: function(){return m_currentFloor.level;},
	    		isOnJob: function(){return IsOnJob();},
	    		requestFloor: function(level){ requestFloor(level,true);},
	    	});
	    }
	    
	    
	    Context.Info("Created, " + m_levels.length + " floor(s)",m_id);
};

Elevator.prototype = {
		Constructor: Elevator,
		
	};
})(window, jQuery, window.Context);