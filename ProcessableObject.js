/*
*
* Simulation ProcessableObject
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.ProcessableObject = function(){
		var that = {};
		
		that.tick = function(){
				// just remove
				// if implementor forgets to implement
				// don't want bad object in process
				that.remove();
		}; // end of tick
		
		that.removed = false;
		
		that.remove = function(){
				that.removed = true;
		}; // end of remove
		
		return that;
	};
})(window.SimulationContext,jQuery);