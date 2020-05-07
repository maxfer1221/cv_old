var canvas = document.getElementById('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;
let h = innerHeight;
let w = innerWidth;

var c = canvas.getContext('2d');

var finalCircle;

var RADII = 600/Math.PI;
var TWOPI = Math.PI * 2;
var SCROLL_SPEED = 1;
var ANGLE_CHANGE = Math.PI/500;
var SHAPE_SIZE = 400;
const SENTINEL = -Math.pow(Math.PI, 3.6);

const drawingStartX = w/2;
const STROKE_STYLE = '#eeeeee';

var CIRCLE_NUM = 20;

var circles = [];
var vertices = [];

function resetProgram(){
    circles = [];
    vertices = [];
    initCircles();
    initVertices();
}

function initCircles(){
    for(let i = 0; i < CIRCLE_NUM; i++){
        if(i>0){
            let cir = circles[i-1];
            circles.push(new Circle(cir.x + cir.r * Math.cos(cir.a), cir.y + cir.r * Math.sin(cir.a), RADII, 2*i + 1));
        } else{
            circles.push(new Circle(w/4, h/2, RADII, 1));
        }
        finalCircle = circles[i];
    }
}

function initVertices(){
    for(let i = 0; i < SHAPE_SIZE; i++){
        vertices.push({x: SENTINEL, y: SENTINEL});
    }
}

function drawCircle(circle){
    if(circles.indexOf(circle) != 0){
        let cir = circles[circles.indexOf(circle) - 1];
        circle.setCenter(cir.x + cir.r * Math.cos(cir.a), cir.y + cir.r * Math.sin(cir.a));
    }
    c.beginPath();
    c.arc(circle.x, circle.y, circle.r, 0, TWOPI, false);
    c.stroke();
}

function lineToEdge(circle){
    circle.a -= ANGLE_CHANGE * circle.coeff;

    c.beginPath();
    c.moveTo(circle.x, circle.y);
    c.lineTo(circle.x + Math.cos(circle.a) * circle.r, circle.y + Math.sin(circle.a) * circle.r);
    c.stroke();
}

function drawAll(){
    c.strokeStyle = STROKE_STYLE;
    for(let i = 0; i < circles.length; i++){
        drawCircle(circles[i]);
        lineToEdge(circles[i]);
    }
}

function drawSum(){
    c.strokeStyle = STROKE_STYLE;
    c.beginPath();
    c.moveTo(finalCircle.x + Math.cos(finalCircle.a) * finalCircle.r, finalCircle.y + Math.sin(finalCircle.a) * finalCircle.r);
    c.lineTo(drawingStartX, finalCircle.y + Math.sin(finalCircle.a) * finalCircle.r);
    c.stroke();
    vertices.push({x: drawingStartX, y: finalCircle.y + Math.sin(finalCircle.a) * finalCircle.r});
}

function drawShape(){
    for(let i = 0; i < vertices.length - 1; i++){
        c.beginPath();
        c.moveTo(vertices[i].x, vertices[i].y);
        c.lineTo(vertices[i + 1].x, vertices[i + 1].y);
        vertices[i].x += SCROLL_SPEED;
        if(vertices[i].y == SENTINEL){c.beginPath();}
        if(i < SHAPE_SIZE/2){
            c.strokeStyle = 'rgba(238, 238, 238, ' + i/200 + ')';
        } else {
            c.strokeStyle = STROKE_STYLE;
        }
        c.stroke();
    }
    vertices.shift();

}

function animate(){
    c.clearRect(0, 0, innerWidth, innerHeight);

    ANGLE_CHANGE = Math.PI/(750 - parseInt(angleSlider.value));
    if(CIRCLE_NUM != parseInt(circleNumSlider.value)){
        CIRCLE_NUM = parseInt(circleNumSlider.value);
        resetProgram();
    }

    drawAll();
    drawSum();
    drawShape();

    requestAnimationFrame(animate);
}

initVertices();
initCircles();

c.strokeStyle = STROKE_STYLE;
animate();
