/*
*
* Simulation Processor
*
*/

;(function(SimulationContext, $, undefined){
	SimulationContext.Processor = function(){
		var objectList = [], // current active items
			addedItems = []; // items needed to be added
		
		return {
			add: function(obj){
				addedItems.push(obj);
			}, // end of add
			tick: function(){
				var newObjectList = [],
					len = objectList.length;
					
				for(var i = 0; i < len; i++){
					
					// if marked for removal
					// skip and don't keep in list
					if(!objectList[i].removed){
						// run a tick for the object
						objectList[i].tick();
						
						// object was not removed
						// so add it for next tick
						newObjectList.push(objectList[i]);
					}
				}
				// add new items to objects not marked
				// for removal
				objectList = newObjectList.concat(addedItems);
				
				// items no longer need to be 
				// added
				addedItems = [];
			} // end of tick
		}; // end of return
	}; // end of Processor
})(window.SimulationContext, jQuery);