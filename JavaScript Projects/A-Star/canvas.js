let canvas = document.querySelector('canvas');

const ROWS = 26;
const COLUMNS = 48;
const SIZE = 40;

let pathFindingStarted = false;
let startPlaced = false;
let targetPlaced = false;

canvas.height = ROWS*SIZE;
canvas.width = COLUMNS*SIZE;

let c = canvas.getContext('2d');

let grid = [];

/*
NODE TYPES:
1 = start
2 = target
3 = barrier
4 = open
5 = closed
6 = path
0 = unobserved
*/

barrier_col = '#000';
unobserved_col = '#fdfdfd';
open_col = '#ecab69';
closed_col = '#e1eb71';
target_col = '#e36161';
start_col = '#649d66';
path_col = '#77d8d8';

//tools
let reset = {active: false};
let start = {active: false};
let target = {active: false};
let barrier = {active: false};
let eraser = {active: false};
let play = {active: false};
toolArray = [reset, start, target, barrier, eraser, play];

//mouse object
let mouse = {
    x : 0,
    y : 0,
    pressed : false,
    toolBar : false
};

let rect;
let toolBar;
let rect2;
let arrowHolder;

function initAreas(){
    rect = document.getElementById('toolBar').getBoundingClientRect();
    toolBar = {
        x1: rect.right,
        x2: rect.left,
        y1: rect.top,
        y2: rect.bottom
    }

    rect2 = document.getElementById('arrow-holder').getBoundingClientRect();
    arrowHolder = {
        x1: rect2.right,
        x2: rect2.left,
        y1: rect2.top,
        y2: rect2.bottom
    }


}

let canv = document.getElementById('canvas').getBoundingClientRect();
let canvRect = {
    x1: canv.left,
    x2: canv.right,
    y1: canv.top,
    y2: canv.bottom
}

//arrow object
let arrow = {
    down: true
}

//event listeners
window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.toolBar = e.x < toolBar.x1 && e.x > toolBar.x2 && e.y > toolBar.y1 && e.y < toolBar.y2;
    mouse.toolBar = mouse.toolBar || e.x < arrowHolder.x1 && e.x > arrowHolder.x2 && e.y > arrowHolder.y1 && e.y < arrowHolder.y2;
});

window.addEventListener('mousedown', function(e){
    mouse.pressed = true;
});

window.addEventListener('mouseup', function(e){
    mouse.pressed = false;
});


// HTML / CSS methods
function activate(item){
    let arr = document.getElementsByClassName('tool-icon');
    for(i = 0; i < arr.length; i++){
        if(arr[i].id!=item){
            arr[i].style.opacity = .3;
            toolArray[i].active = false;
        } else {
            toolArray[i].active = true;
            arr[i].style.opacity = 1;
        }
    }
}

function activateArrow(){
    if(arrow.down) {
        arrow.down = false;
        document.getElementById('toolBar').style.top = '-100px';
        document.getElementById('arrow-holder').style.top = '0';
        document.getElementById('arrow-up').style.opacity = 0;
        document.getElementById('arrow-down').style.opacity = 0.5;
    } else {
        arrow.down = true;
        document.getElementById('toolBar').style.top = '0';
        document.getElementById('arrow-holder').style.top = '100px';
        document.getElementById('arrow-up').style.opacity = 0.5;
        document.getElementById('arrow-down').style.opacity = 0;
    }
    setTimeout(function(){
        initAreas();
    }, 500);

}

function startPathFinding(){
    if(!pathFindingStarted){
        initializeArrays(grid);
        pathFindingStarted = !pathFindingStarted;
    }
    if(targetPlaced && startPlaced){paused = !paused;}
}

function resetProgram(){
    grid = [];
    initGrid();
    finished = false;
    paused = true;
    pathFindingStarted = false;
    openNodes = [];
    closedNodes = [];
    trgt = undefined;
    strt = undefined;
    targetPlaced = false;
    startPlaced = false;
}

//drawing and initializing the grid
function initGrid(){
    for(let i = 0; i < ROWS; i++){
        grid.push([]);
        for(let j = 0; j < COLUMNS; j++){
            grid[i].push({type: 0, color: unobserved_col, h: undefined, g: undefined, t: undefined, row: i, col: j, pNode: undefined})
        }
    }
    makeEdges();
}

function makeEdges(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(j == 0 || i == 0 || j == grid[i].length-1 || i == grid.length-1){
                grid[i][j].type = 3;
                grid[i][j].color = barrier_col;
            }
        }
    }
}

function drawGrid(){
    c.strokeStyle = '#000000';
    for(let i = 0; i < ROWS; i++){
        for(let j = 0; j < COLUMNS; j++){
            c.beginPath();
            c.fillStyle = grid[i][j].color;
            c.rect(SIZE*j, SIZE*i, SIZE, SIZE);
            c.stroke();
            c.fill();
        }
    }
}

function animate(){
    c.clearRect(-1, -1, SIZE*(COLUMNS + 1), SIZE*(ROWS + 1));

    if(mouse.pressed && !pathFindingStarted){
        currCell = grid[Math.floor(mouse.y/SIZE)][Math.floor(mouse.x/SIZE)];
        if(toolArray[1].active && !startPlaced && !mouse.toolBar && currCell.type == 0){
            startPlaced = true;
            currCell.type = 1;
            currCell.color = start_col;
        } else if(toolArray[2].active && !targetPlaced && !mouse.toolBar && currCell.type == 0){
            targetPlaced = true;
            currCell.type = 2;
            currCell.color = target_col;
        } else if(toolArray[3].active && !mouse.toolBar && currCell.type == 0){
            currCell.type = 3;
            currCell.color = barrier_col;
        } else if(toolArray[4].active && !mouse.toolBar){
            if(currCell.type==1){
                startPlaced = false;
                currCell.type = 0;
                currCell.color = unobserved_col;
            } else if(currCell.type==2){
                targetPlaced = false;
                currCell.type = 0;
                currCell.color = unobserved_col;
            } else if(currCell.type==3){
                currCell.type = 0;
                currCell.color = unobserved_col;
            }
        }
    }

    step();
    drawGrid();
    requestAnimationFrame(animate);
}

initAreas();

initGrid();
drawGrid();

animate();
