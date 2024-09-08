const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
const test = require('node:test');
const assert = require('assert')
    
class Elevator{
    constructor(){
        this.height = 7
        this.floor = 1
        this.state = State.idle
    }
    internal(floor){
        this.state = State.running
        if(floor > this.floor){
            this.goingup(floor)
        }else if (floor < this.floor){
            this.goingdown(floor)
        }else{
            this.state = State.idle
            console.log(State.idle)
        }
    }
    goingup(floor){
        console.log("goingup from ",this.floor)
        this.direction = Direction.up
        for(var i=this.floor+1;i<=floor;i++){
            console.log("goto floor",i)
        }
        this.floor = i - 1
        console.log("door open&close",this.floor)
        eventEmitter.emit('passagein', this.floor);
    }
    goingdown(floor){
        console.log("goingdown from ",this.floor)
        this.direction = Direction.down
        for(var i=this.floor-1;i>=floor;i--){
            console.log("goto floor",i)
        }
        this.floor = i
        console.log("door open&close",this.floor)
    }
    external(direction,floor){
        if(this.state == State.idle){
            this.state = State.running
            if(floor > this.floor){
                this.goingup(floor)
            }else{
                this.goingdown(floor)
            }
        }
    }
}
class Floor{}
class ButtonPanel{}
class Direction{
    static up = 'up';
    static down = 'down';
}
class State{
    static idle = "IDLE"
    static running = "RUNNING"
}
class ExternalRequest{}
class InternalRequest{}

let e = new Elevator()
eventEmitter.on('InternalRequest', (floor) => {
    e.internal(floor)
});
//test below
/*
-  电梯在1楼，一个人在2楼层，他想去 5 楼。*/
eventEmitter.on('passagein', (floor) => {
    eventEmitter.emit('InternalRequest', 5);
});
eventEmitter.on('ExternalRequest', (Direction,floor) => {
    console.log('ExternalRequest',Direction,floor);
    // let e = new Elevator()
    // if (e.floor)
    e.external(Direction,floor)
    // test('synchronous passing test', (t) => {
    //     // This test passes because it does not throw an exception.
    //     // e.floor = floor
    //     assert.equal(e.floor ,floor );
    //   });
    
});
eventEmitter.emit('ExternalRequest', Direction.up,2);