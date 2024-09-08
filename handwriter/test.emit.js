// 事件处理
const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
eventEmitter.on('start', (p) => {
    console.log('started',p);
});
eventEmitter.emit('start', 23);