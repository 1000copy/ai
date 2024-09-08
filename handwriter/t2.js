const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
const test = require('node:test');
const assert = require('assert')

const HEIGHT = 7
const e1 = require("./e1.js")
const Elevator = e1.Elevator
const Direction = e1.Direction
let e = new Elevator(HEIGHT)
//test below
/*
假设电梯从一楼运行到五楼，然后到达一楼。此时，假设3楼的另一个人想要往上走。那么电梯会因这个要求而停止，
3楼的人将进入电梯。假设他按下了 4 楼的按钮。那么电梯将首先停在 4 楼，
也就是二楼进入者的目的地。随后电梯停在五楼，一楼的人走出电梯。*/
setTimeout(()=>{
    eventEmitter.emit('InternalRequest', 5);
},1100)
setTimeout(()=>{
    eventEmitter.emit('ExternalRequest', Direction.up,3);
},1200)
setTimeout(()=>{
    eventEmitter.emit('InternalRequest', 4);
},2200)

eventEmitter.on('InternalRequest', (floor) => {
    e.internal(floor)
});
eventEmitter.on('ExternalRequest', (Direction,floor) => {
    // console.log('ExternalRequest',Direction,floor);
    e.external(Direction,floor)
});
// setInterval(function(){
//     e.timeout()
// },1000)
eventEmitter.emit('ExternalRequest', Direction.up,2);