// const EventEmitter = require('node:events');
// const eventEmitter = new EventEmitter();
// const test = require('node:test');
// const assert = require('assert')
class Floor{
    constructor(){
        this.upbtn = new Button(false)
        this.downbtn = new Button(false)
    }
}
class Direction{
    static up = 'up';
    static down = 'down';
}
class State{
    static idle = "IDLE"
    static running = "RUNNING"
}
class Button{
    constructor(){
        this.on = false
    }
}
class Elevator{
    constructor(floors){
        this.height = floors
        this.floors = []
        for(var i=0;i<floors;i++){
            this.floors.push(new Floor())
        }
        this.floor = 1
        this.state = State.idle
        this.buttons = []
        for(var i=0;i<floors;i++){
            this.buttons.push(new Button())
        }
        setInterval(this.timeout.bind(this),1000)
    }
    hasUpjob(){
        for(var i= this.floor;i<this.height;i++){
            var floor = this.floors[i]
            if(floor.upbtn.on || floor.downbtn.on || this.buttons[i].on)
                return true
        }
        return false
    }
    hasDownjob(){
        for(var i= this.floor;i<=0;i--){
            var floor = this.floors[i]
            if(floor.upbtn.on || floor.downbtn.on || this.buttons[i].on)
                return true
        }
        return false
    }
    timeout(){
        if(this.nojob()){
            this.state = State.idle
            console.log("idle",this.floor)
            return
        }
        if(this.direction == Direction.up){
            if(this.floor + 1 > this.height || !this.hasUpjob())
                this.direction = Direction.down
        }else{
            
            if(this.floor <= 0 || !this.hasDownjob())
                this.direction = Direction.up
        }
        this.move(this.floor,this.direction == Direction.up?1:-1)
    }
    nojob(){
        for(var i= 0;i<this.height;i++){
            var floor = this.floors[i]
            if(floor.upbtn.on || floor.downbtn.on || this.buttons[i].on)
                return false
        }
        return true
    }
    internal(floor){
        console.log("InternalRequest ",floor)
        if(this.state = State.idle){
            this.state = State.running
        }
        if(floor > this.floor){
            this.direction = Direction.up
        }else if (floor < this.floor){
            this.direction = Direction.down
        }else{
            this.state = State.idle
            console.log(State.idle)
        }
        this.buttons[floor].on = true
    }
    move(floor,direction){
        this.floor+=direction
        console.log("floor:",this.floor)
        if(direction == 1 && this.floors[this.floor].upbtn.on){
            console.log("upbtn off/passage in",this.floor)
            this.floors[this.floor].upbtn.on = false
        }
        if(direction == -1 && this.floors[this.floor].downbtn.on){
            console.log("downbtn off/passage in",this.floor)
            this.floors[this.floor].downbtn.on = false
        }
        if(this.buttons[this.floor].on){
            console.log("ebtn off/passage out",this.floor)
            this.buttons[this.floor].on = false
        }
    }
    external(direction,floor){
        console.log('ExternalRequest',direction,floor);
        if(floor > this.floor){
            this.direction = Direction.up
        }else if (floor < this.floor){
            this.direction = Direction.down
        }else{
            this.state = State.idle
            console.log(State.idle)
        }
        if(direction == Direction.up){
            this.floors[floor].upbtn.on = true
        }else{
            this.floors[floor].downbtn.on = true
        }
    }
}



exports.Elevator = Elevator
exports.Direction = Direction