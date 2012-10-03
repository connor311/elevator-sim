/*
*
* Simulation Logger
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Logger = function(className, id){
		var that = {};
		
		that.log = function(code, objArr){
			console.log(sprintf("%s,%s,%s,%s",className,id,code,objArr));
		}; // end of log
		
		if(console === undefined || !$.isFunction(console.log)){
			that.log = function(){};
		} // end of console check
		
		return that;
	};
})(window.SimulationContext,jQuery);