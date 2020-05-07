var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

c.strokeStyle = "white";

const ENVIRONMET_NUM = 10

const FOV = 70;

let w = innerWidth;
let h = innerHeight;

const MAX_HEIGHT = 2*h;

var r = innerWidth+innerHeight;

var rayNum = 100;

var pressed = false;

var environment = [];

var rays = [];

var points = [];

var main = {
  cw: false,
  ccw: false,
  x: 300,
  y: 500,
  r: 10,
  up: false,
  down: false,
  left: false,
  right: false,
  v: 5,
  angle: 0,
  heading: 0.005,
  dist: 0
}

window.addEventListener('keydown', function(event) {
  if (event.code === "KeyA") {
    main.left = true;
  }
  if (event.code === "KeyD") {
    main.right = true;
  }
  if (event.code === "KeyS") {
    main.down = true;
  }
  if (event.code === "KeyW") {
    main.up = true;
  }
  if (event.code === "KeyQ") {
    main.ccw = true;
  }
  if (event.code === "KeyE") {
    main.cw = true;
  }
})

window.addEventListener('keyup', function(event) {
  if (event.code === "KeyA") {
    main.left = false;
  }
  if (event.code === "KeyD") {
    main.right = false;
  }
  if (event.code === "KeyS") {
    main.down = false;
  }
  if (event.code === "KeyW") {
    main.up = false;
  }
  if (event.code === "KeyQ") {
    main.ccw = false;
  }
  if (event.code === "KeyE") {
    main.cw = false;
  }
  if (event.code === "KeyF") {
    consol = false;
  }
})

function initEnvironment(){
    environment.push({
      x1: 0,
      y1: 0,
      x2: 0.01,
      y2: innerHeight - 2,
      color: 'white'
    });
    environment.push({
      x1: innerWidth/2,
      y1: 0,
      x2: innerWidth/2 + 0.01,
      y2: innerHeight - 2,
      color: 'white'
    });
    environment.push({
      x1: 0,
      y1: 0,
      x2: innerWidth/2,
      y2: 0.01,
      color: 'white'
    });
    environment.push({
      x1: 0,
      y1: innerHeight - 2,
      x2: innerWidth/2,
      y2: innerHeight - 2.001,
      color: 'white'
    });

    for(let i = 0; i < ENVIRONMET_NUM; i++){
        xTemp = Math.random()*w/3;
        yTemp = Math.random()*h;
        environment.push({
          x1: xTemp,
          y1: yTemp,
          x2: Math.random()*(w/2 - xTemp - 25) + xTemp + 25,
          y2: Math.random()*(2*h - yTemp - 50) + yTemp + 50 - h,
          color: 'white'
        });
    }
}

function distanceObjs(a, b){
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function distanceCoords(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function fillRays(){
  rays = [];
  for(var i = 0; i < rayNum; i++){
    let aTemp = degToRad(FOV);
    rays.push({
      x: main.x + Math.cos(aTemp*i/rayNum + main.angle)*r,
      y: main.y + Math.sin(aTemp*i/rayNum + main.angle)*r,
    })
  }
}

function drawRays(){
  for(var i = 0; i < rays.length; i++){

    rays[i] = resolveCollision(rays[i], environment);

    c.beginPath();
    c.moveTo(main.x, main.y);
    c.lineTo(rays[i].x, rays[i].y);
    c.stroke();
  }
}

function drawEnvironment(){
  for(var i = 0; i < environment.length; i++){
    var e = environment[i];

    c.beginPath();
    c.moveTo(e.x1,e.y1);
    c.lineTo(e.x2,e.y2);
    c.stroke();
  }
}

function resolveCollision(ray, env){
  var ret = ray;

  var ma;
  var mb;

  var xsol;
  var ysol;

  for(var i = 0; i < env.length; i++){

    var up = main.y > ray.y;
    var left = main.x>ray.x;

    var e = env[i];

    ma = (ray.y - main.y)/(ray.x - main.x);

    mb = (e.y2 - e.y1)/(e.x2-e.x1);

    xsol = (-mb * e.x1 + e.y1 + ma*main.x - main.y)/(ma - mb);

    ysol = (xsol-e.x1)*mb + e.y1;

    if(ret!=ray){
      if(distanceCoords(xsol, ysol, main.x, main.y) > distanceObjs(main, ret)){
        continue;
      }
    }

    if(xsol>=e.x1 && xsol<=e.x2) {
      if(left && xsol <= main.x) {
        if(ysol <= main.y || !up){
          ret = {
            x: xsol,
            y: ysol
          }
        }
      } else if(!left && xsol >= main.x) {
        if(ysol <= main.y || !up) {
          ret = {
            x: xsol,
            y: ysol
          }
        }
      }
  } else if(ma < -1960){
      if(xsol>=e.x1 && xsol<=e.x2 && (ysol <= main.y || !up) && (ysol <= main.y || !up)){
          ret = {
            x: xsol,
            y: ysol
          }
        }
      }
  }
  return ret;
}

function collectPoints(){
    points = [];
    for(let i = 0; i < rays.length; i++){
        points.push([rays[i].x, rays[i].y]);
    }
}

function drawPoints(){
    let rectWidth = w/2 - 20;
    rectWidth/=points.length;
    c.save();
    for(let i = 0; i < points.length; i++){
        let dist = distanceCoords(main.x, main.y, points[i][0], points[i][1]);
        let rectHeight = h*FOV/dist
        c.globalAlpha = map_range(dist, 0, Math.sqrt(h*h/2 + w*w/4), 1, 0);
        c.fillStyle = 'white';
        c.beginPath();
        c.rect(w/2 + 10 + i*rectWidth, h/2 - rectHeight/2, rectWidth, rectHeight);
        c.fill();
    }
    c.restore();
}

function animate(){
  if (main.up) {
    main.y -= main.v;
  }
  if (main.right) {
    main.x += main.v;
  }
  if (main.left) {
    main.x -= main.v;
  }
  if (main.down) {
    main.y += main.v;
  }
  if (main.cw) {
    main.angle += main.heading;
  }
  if (main.ccw) {
    main.angle -= main.heading;
  }

  if(main.x >= w/2){
      main.x = w/2;
  } else if(main.x <= 2){
      main.x = 2;
  } if(main.y >= h - 5){
      main.y = h - 5;
  } else if(main.y <= 2){
      main.y = 2;
  }

  c.clearRect(0,0,innerWidth,innerHeight);

  drawEnvironment();

  fillRays();

  drawRays();

  collectPoints();

  drawPoints();

  requestAnimationFrame(animate)
}
initEnvironment();

fillRays();

animate();
