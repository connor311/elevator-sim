/*
*
* Floor.js - Floor object
*
*
*/

;(function(window, $, Context){
	
	var Floor = Context.Floor = function(name, availableDirections){
		var DIRECTION = Context.DIRECTION,
			m_name = name,
			m_canGoDown = false,
			m_canGoUp = false,
			m_elevatorControl = null,
			m_requested = {};
			m_requested[DIRECTION.UP] =  false;
			m_requested[DIRECTION.DOWN] = false;
			
		var initUpDownPermissions = function(directions){
			m_canGoDown = directions.indexOf(DIRECTION.DOWN) != -1;
			m_canGoUp = directions.indexOf(DIRECTION.UP) != -1;
		};
		
		var stopRequested = function(dir){
			if(!m_requested[dir]){
				Context.Info("Requested", null,m_name,null,dir);
				m_requested[dir] = true;
				m_elevatorControl.stopRequested(m_name, dir);
			}
		};
		
		var elevatorAPI = {};
		
		elevatorAPI.shouldStop = function(dir){
			if(m_requested[dir]){
				return true;
			}
			return false;
		};
		
		elevatorAPI.stopping = function(dir){
			m_requested[dir] = false;
		};
		
		elevatorAPI.Id = m_name;
		
		this.Name = m_name;
		
		this.Up = function(){
			if(m_canGoUp && m_elevatorControl != null){
				stopRequested(DIRECTION.UP);
			}
		};
		
		this.Down = function(){
			if(m_canGoDown && m_elevatorControl != null){
				stopRequested(DIRECTION.DOWN);
			}
		};
		
		this.registerElevatorControl = function(elevatorControl){
			m_elevatorControl = elevatorControl;
			Context.Info("Registered",null,m_name,m_elevatorControl.Id);
			return elevatorAPI;
		};
		
		
		initUpDownPermissions(availableDirections);
	};
	
	Floor.prototype = {
		constructor: Floor
	};
})(window,jQuery,window.Context);