

var processor = new SimulationContext.Processor();
var timer = new SimulationContext.Timer(processor.tick, {waitTime:1, endAfter2:800});


var floor1 = {id:"Floor 1",level:0};
var floor2 = {id:"Floor 2",level:1};
var floor3 = {id:"Floor 3",level:2};
var floor4 = {id:"Floor 4",level:3};
var floor5 = {id:"Floor 5",level:4};
var floor6 = {id:"Floor 6",level:5};
var floor7 = {id:"Floor 7",level:6};
var floor8 = {id:"Floor 8",level:7};
var floor9 = {id:"Floor 9",level:8};

var elevator = new SimulationContext.Elevator("1", [floor1,floor2,floor3,floor4,floor5,floor6,floor7,floor8,floor9], floor1.level);

processor.add(elevator);

timer.start();

elevator.requestFloor(6, SimulationContext.Direction.Down);
elevator.requestFloor(7, SimulationContext.Direction.Up);
elevator.requestFloor(8);
elevator.requestFloor(8, SimulationContext.Direction.Down);

/*
setTimeout(function(){
elevator.requestFloor(5, SimulationContext.Direction.Up);
elevator.requestFloor(6, SimulationContext.Direction.Down);
elevator.requestFloor(7, SimulationContext.Direction.Up);
elevator.requestFloor(8, SimulationContext.Direction.Down);
}, 3)

setTimeout(function(){
elevator.requestFloor(0, SimulationContext.Direction.Up);
elevator.requestFloor(1, SimulationContext.Direction.Up);
elevator.requestFloor(2, SimulationContext.Direction.Up);
elevator.requestFloor(3, SimulationContext.Direction.Up);
elevator.requestFloor(4, SimulationContext.Direction.Up);
}, 500)

setTimeout(function(){
elevator.requestFloor(0, SimulationContext.Direction.Up);
elevator.requestFloor(1, SimulationContext.Direction.Up);
elevator.requestFloor(2, SimulationContext.Direction.Up);
elevator.requestFloor(3, SimulationContext.Direction.Up);
elevator.requestFloor(4, SimulationContext.Direction.Up);
}, 1000)
*/