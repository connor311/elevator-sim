/*
*
* Simulation ProcessableObject
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.ProcessableObject = function(){
		return {
			tick: function(){
				// just remove
				// if implementor forgets to implement
				// don't want bad object in process
				this.remove();
			},
			removed: false,
			remove: function(){
				this.removed = true;
			}
		};
	};
})(window.SimulationContext,jQuery);