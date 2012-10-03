

var processor = new SimulationContext.Processor();
var timer = new SimulationContext.Timer(processor.tick, 2000);


var floor1 = {id:"Floor 1",level:0};
var floor2 = {id:"Floor 2",level:1};

var elevator = new SimulationContext.Elevator("1", [floor1,floor2], floor1.level);

processor.add(elevator);

timer.start();

//elevator.tick();
//elevator.tick();