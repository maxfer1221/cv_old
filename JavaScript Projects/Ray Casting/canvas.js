var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

c.strokeStyle = "white";

var r = innerWidth+innerHeight;

var rayNum = 131;

var pressed = false;

var mouse = {
  x: undefined,
  y: undefined
}

var environment = [];

var rays = [];

environment.push({
  x1: 200,
  y1: 400,
  x2: 500,
  y2: 200,
  color: 'white'
});

environment.push({
  x1: 1300,
  y1: 200,
  x2: 1700,
  y2: 900,
  color: 'white'
});

environment.push({
  x1: 800,
  y1: 200,
  x2: 1000,
  y2: 400,
  color: 'white'
});

environment.push({
  x1: 1100,
  y1: 600,
  x2: 1400,
  y2: 800,
  color: 'white'
});

environment.push({
  x1: 1300,
  y1: 400,
  x2: 1500,
  y2: 200,
  color: 'white'
});

environment.push({
  x1: 300,
  y1: 900,
  x2: 600,
  y2: 750,
  color: 'white'
});
//
environment.push({
  x1: 500,
  y1: 740,
  x2: 800,
  y2: 870,
  color: 'white'
});

environment.push({
  x1: 100,
  y1: 600,
  x2: 400,
  y2: 80,
  color: 'white'
});

environment.push({
  x1: 450,
  y1: 60,
  x2: 500,
  y2: 400,
  color: 'white'
});

environment.push({
  x1: 200,
  y1: 80,
  x2: 800,
  y2: 140,
  color: 'white'
});

window.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener('mousedown', function(){
  pressed = true;
})

function distanceObjs(a, b){
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function distanceCoords(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function fillRays(){
  rays = [];
  for(var i = 0; i < rayNum; i++){
    rays.push({
      x: mouse.x + Math.cos(2*i*Math.PI/rayNum)*r,
      y: mouse.y + Math.sin(2*i*Math.PI/rayNum)*r,
    });
  }
}

function drawRays(){
  for(var i = 0; i < rays.length; i++){

    rays[i] = resolveCollision(rays[i], environment);

    c.beginPath();
    c.moveTo(mouse.x, mouse.y);
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

    var up = mouse.y > ray.y;
    var left = mouse.x>ray.x;

    var e = env[i];

    ma = (ray.y - mouse.y)/(ray.x - (mouse.x-Math.pow(Math.E, .001)));
    mb = (e.y2 - e.y1)/(e.x2-e.x1);

    xsol = (-mb * e.x1 + e.y1 + ma*mouse.x - mouse.y)/(ma - mb);

    ysol = (xsol-e.x1)*mb + e.y1;

    if(ret!=ray){
      if(distanceCoords(xsol, ysol, mouse.x, mouse.y) > distanceObjs(mouse, ret)){
        continue;
      }
    }

    if(xsol>=e.x1 && xsol<=e.x2) {
      if(left && xsol <= mouse.x) {
        if(ysol <= mouse.y || !up){
          ret = {
            x: xsol,
            y: ysol
          }
        }
      } else if(!left && xsol >= mouse.x) {
        if(ysol <= mouse.y || !up) {
          ret = {
            x: xsol,
            y: ysol
          }
        }
      }
    }



  }
  return ret;
}

function animate(){
  requestAnimationFrame(animate)
  c.clearRect(0,0,innerWidth,innerHeight);

  drawEnvironment();

  fillRays();

  drawRays();
}

fillRays();

animate();
