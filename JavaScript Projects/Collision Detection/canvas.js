var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var circleArr = [];

var radius = 50;
var circleNum = Math.floor(innerWidth/(3*radius))*Math.floor(innerHeight/(3*radius));
maxSpeed = 5;

colorArr = ['#de7119', '#116979', '#18b0b0'];

var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener('resize', function(){
  circleArr=[];
  circleNum = Math.floor(innerWidth/(3*radius))*Math.floor(innerHeight/(3*radius));
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
})

function distance(a, b){
  return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
}

function fillStyle(circle){
  var ret = "rgba(";
  ret += parseInt(circle.col.substring(1,3), 16) + ", ";
  ret += parseInt(circle.col.substring(3,5), 16) + ", ";
  ret += parseInt(circle.col.substring(5,7), 16) + ", ";
  ret +=circle.alpha + ")";
  return ret;
}

function init(){
  for(var i = 0; i < circleNum; i++){

    var temp = {
      x: Math.random()*(innerWidth-radius*2) + radius,
      y: Math.random()*(innerHeight-radius*2) + radius
    }

    var dist;

    for(var j = 0; j < circleArr.length; j++){

      dist = distance(temp, circleArr[j]);

      if(dist < 2*radius){
        temp.x = Math.random()*(innerWidth-radius*2) + radius;
        temp.y = Math.random()*(innerHeight-radius*2) + radius;
        j = -1;
      }
    }

    circleArr.push({
      r: radius,
      x: temp.x,
      y: temp.y,
      col: colorArr[Math.floor(Math.random()*colorArr.length)],
      velocity : {
        y: Math.random()*maxSpeed - maxSpeed/2,
        x: Math.random()*maxSpeed - maxSpeed/2
      },
      mass: 1,
      alpha: 0
    })
  }
}

function animate(){
  requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);

  for(var i = 0; i < circleNum; i++){
    cir = circleArr[i];

    var da = .05
    var ma = .7

    if(distance(mouse, circleArr[i]) < 200 && cir.alpha <= ma){
      cir.alpha+= da;
    } else if(cir.alpha > 0){
      cir.alpha -= da;
    } else {
      cir.alpha = 0;
    }

    c.fillStyle = fillStyle(cir);
    c.strokeStyle = "black";
    c.lineWidth = 3;

    c.beginPath();
    c.arc(cir.x, cir.y, cir.r, 0, 2*Math.PI, false);
    c.stroke();
    c.fill();

    for(var j = 0; j < i; j++){
      if(distance(cir, circleArr[j]) <= radius*2){
        resolveCollision(cir, circleArr[j]);
      }
    }


    if(cir.x + cir.r >= innerWidth || cir.x - cir.r <= 0){
      cir.velocity.x = -1*cir.velocity.x;
    }
    if(cir.y + cir.r >= innerHeight || cir.y - cir.r <= 0){
      cir.velocity.y = -1*cir.velocity.y;
    }


    cir.x = cir.x + cir.velocity.x;
    cir.y = cir.y + cir.velocity.y;

  }

}

init();

animate();
