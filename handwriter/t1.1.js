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
    // eventEmitter.emit('InternalRequest', 5);
    e.internal(5)
},1100)


e.external(Direction.up,2)