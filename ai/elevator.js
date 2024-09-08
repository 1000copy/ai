class Elevator {
    constructor(maxFloor) {
        this.currentFloor = 1;
        this.maxFloor = maxFloor;
        this.requests = []; // 请求列表
        this.state = 'idle'; // 状态
        this.callbacks = []; // 到达目标楼层后的回调函数
    }

    move(targetFloor, callback) {
        if (this.state === 'idle' && targetFloor !== this.currentFloor) {
            this.state = 'moving';
            let currentFloor = this.currentFloor;
            let timerId = setInterval(() => {
                if (currentFloor < targetFloor) {
                    currentFloor++;
                } else if (currentFloor > targetFloor) {
                    currentFloor--;
                }

                if (currentFloor === targetFloor) {
                    clearInterval(timerId);
                    this.currentFloor = targetFloor;
                    this.state = 'idle';
                    callback(); // 调用回调函数
                    console.log(`Arrived at floor ${targetFloor}`);
                }
            }, 1000); // 每秒移动一层
        }
    }

    request(targetFloor, direction) {
        if (!this.requests.includes(targetFloor)) {
            this.requests.push(targetFloor);
            console.log(`Request to go to floor ${targetFloor} from direction ${direction}`);
            this.handleRequests();
        }
    }

    handleRequests() {
        if (this.state === 'idle' && this.requests.length > 0) {
            const nextFloor = this.findNextFloor();
            this.move(nextFloor, () => this.processRequests());
        }
    }

    processRequests() {
        // 处理到达目标楼层后的请求
        this.requests = this.requests.filter(floor => floor !== this.currentFloor);
        this.callbacks.forEach(cb => cb());
        this.callbacks = [];
        this.handleRequests(); // 如果还有请求，则继续处理
    }

    findNextFloor() {
        // 找到最近的请求楼层
        let closest = null;
        let distance = Infinity;
        let direction = this.currentFloor < this.requests[0] ? 'up' : 'down';

        for (const floor of this.requests.sort((a, b) => a - b)) {
            const d = Math.abs(floor - this.currentFloor);
            if ((direction === 'up' && floor > this.currentFloor) || (direction === 'down' && floor < this.currentFloor)) {
                if (d < distance) {
                    distance = d;
                    closest = floor;
                }
            }
        }

        return closest;
    }
}

const elevator = new Elevator(3);

window.elevator = elevator; // 允许在控制台访问电梯实例进行调试
document.addEventListener("DOMContentLoaded", function() {
    const floors = parseInt(prompt("Enter the number of floors:"), 10);

    const createInnerButtons = (numFloors) => {
        const container = document.getElementById('elevatorInnerButtons');
        const innerButtons = document.createElement('div');
        innerButtons.className = 'panel';

        for (let i = 1; i <= numFloors; i++) {
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = i;
            button.addEventListener('click', () => {
                button.classList.add('pressed');
                elevator.request(i, 'inner');
            });
            innerButtons.appendChild(button);
        }

        container.appendChild(innerButtons);
    };

    const createFloorPanels = (numFloors) => {
        const container = document.getElementById('floorPanels');

        for (let i = 1; i <= numFloors; i++) {
            const floorPanel = document.createElement('div');
            floorPanel.className = 'panel';

            const label = document.createElement('span');
            label.className = 'label';
            label.textContent = `Floor ${i}`;
            floorPanel.appendChild(label);

            const upButton = document.createElement('button');
            upButton.className = 'button';
            upButton.textContent = 'Up';
            upButton.addEventListener('click', () => {
                upButton.classList.add('pressed');
                elevator.request(i , 'up');
            });
            floorPanel.appendChild(upButton);

            const downButton = document.createElement('button');
            downButton.className = 'button';
            downButton.textContent = 'Down';
            downButton.addEventListener('click', () => {
                downButton.classList.add('pressed');
                elevator.request(i , 'down');
            });
            floorPanel.appendChild(downButton);

            if (i === numFloors) {
                upButton.disabled = true;
            }
            if (i === 1) {
                downButton.disabled = true;
            }

            container.appendChild(floorPanel);
        }
    };

    createInnerButtons(floors);
    createFloorPanels(floors);
});
