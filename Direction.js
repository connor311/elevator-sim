/*
*
* Simulation Direction
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Direction = (function(){
		return {
			Up: 1,
			Stopped: 0,
			Down: -1,
			flip: function(direction){
				return direction * -1;
			}, // end of flip
			toString:function(direction){
				var ret = "Unknown";
				switch(direction){
					case this.Up:
						ret = "Up";
						break;
					case this.Down:
						ret = "Down";
						break;
					case this.Stopped:
						ret = "Stopped";
						break;
				} // end of switch
				return ret;
			}, // end of toString
		}; // end of return
	})() // End of direction self creation
})(window.SimulationContext,jQuery);