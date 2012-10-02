/*
*
* Main.js - Elevator project start file
*
*
*/

var floors = [
	new Context.Floor("First", [Context.DIRECTION.UP]),
	new Context.Floor("Second", [Context.DIRECTION.UP,Context.DIRECTION.DOWN]),
	new Context.Floor("Third", [Context.DIRECTION.UP,Context.DIRECTION.DOWN]),
	new Context.Floor("Forth", [Context.DIRECTION.DOWN]),
];

var controlRoom = new Context.ControlRoom("Main",floors,1);