const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
const test = require('node:test');
const assert = require('assert')
function step(c){
    return c*1000
}
const HEIGHT = 7
const e1 = require("./e1.js")
const Elevator = e1.Elevator
const Direction = e1.Direction
let e = new Elevator(HEIGHT)
//test below
/*
假设电梯从一楼运行到五楼，然后到达一楼。此时，假设3楼的另一个人想要往下走。那么电梯不会因这个要求而停止，
随后电梯停在五楼，一楼的人走出电梯。
电梯向下到3楼，它将进入电梯。假设他按下了 2 楼的按钮。那么电梯将首先到2 楼并空闲下来*/
setTimeout(()=>{
    eventEmitter.emit('InternalRequest', 5);
},step(1)+100)
setTimeout(()=>{
    eventEmitter.emit('ExternalRequest', Direction.down,3);
},step(1)+200)
setTimeout(()=>{
    eventEmitter.emit('InternalRequest', 2);
},step(5))

eventEmitter.on('InternalRequest', (floor) => {
    e.internal(floor)
});
eventEmitter.on('ExternalRequest', (Direction,floor) => {
    // console.log('ExternalRequest',Direction,floor);
    e.external(Direction,floor)
});

eventEmitter.emit('ExternalRequest', Direction.up,2);