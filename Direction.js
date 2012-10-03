/*
*
* Simulation Direction
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Direction = function(){
		return {
			Up: 1,
			Stopped: 0,
			Down: -1,
			flip: function(direction){
				return direction * -1;
			}, // end of flip
		}; // end of return
	};
})(window.SimulationContext,jQuery);