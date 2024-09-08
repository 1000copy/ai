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
-  电梯在1楼，一个人在2楼层，他想去 5 楼。*/
setTimeout(()=>{
    eventEmitter.emit('InternalRequest', 5);
},1100)
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