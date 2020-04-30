let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

//Fireworks
const FW_TIME = 25;
const GLOBAL_BLUR = 20;
const FW_SIZE = 5;
const GRAV = .1;
const DRAG = .99;
const FW_COLORS1 = ['#f7f7f7', '#43d8c9', '#95389e ', '#c1a57b'];
const FW_COLORS2 = ['#b2ebf2', '#00bcd4', '#ff5722 ', '#dd2c00'];
const FW_COLORS3 = ['#dee3e2', '#de7119', '#116979 ', '#18b0b0'];
const FW_COLORS_ARRAY = [FW_COLORS1, FW_COLORS2, FW_COLORS3];
let fireworkArray = [];

//Particles
const PART_DRAG = .99;
const PART_SIZE = 2;

//Cannon
const CANNON_DIST = 40;
let cannon = {
  l: 30,
  h: 15,
  length: CANNON_DIST,
  y: CANNON_DIST,
  x: 0,
  angle: 0
}

//Scene
let moonRadius = Math.sqrt(innerWidth * innerHeight)/4;

//Mouse
let mouse = {
  x: 0,
  y: 0,
  m: 1,
  maxAngle: Math.PI/4,
  pressed: false
}

window.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.angle = Math.atan((mouse.y - (.9*innerHeight - cannon.h))/(mouse.x - innerWidth/2));

  if(mouse.y<.9*innerHeight-cannon.h){
    mouse.angle = -mouse.angle;
  } if(mouse.x<innerWidth/2){
    mouse.angle += Math.PI;
  } if(mouse.angle>=mouse.maxAngle + Math.PI/2){
    mouse.angle = mouse.maxAngle + Math.PI/2;
  } else if(mouse.angle<=mouse.maxAngle){
    mouse.angle = mouse.maxAngle;
  }
})

window.addEventListener('mousedown', function(){
  createFirework();
})

// window.addEventListener('mouseup', function(){
//   mouse.pressed = false;
// })

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  moonRadius = Math.sqrt(innerWidth * innerHeight)/10;
})


function drawScene(){
  c.fillStyle = '#f1d6ab';
  c.shadowColor = '#f1d6ab';
  c.shadowBlur = GLOBAL_BLUR + 30;
  c.beginPath();
  c.arc(innerWidth, 0, moonRadius, 0, Math.PI*2, false);
  c.fill();

  c.shadowBlur = 0;
  c.beginPath();
  c.fillStyle = "#1f6650";
  c.moveTo(0, .9*innerHeight)
  c.rect(0, .9*innerHeight, innerWidth, innerHeight);
  c.fill();
}

function createFirework(){
  let xTemp = innerWidth/2 + cannon.length*Math.cos(mouse.angle);
  let yTemp = .9*innerHeight - 2*cannon.h - Math.sin(mouse.angle)*cannon.length;

  let vTemp = (Math.random()*.1 + .4)*(innerHeight/FW_TIME) - GRAV * FW_TIME;

  let lifeLenTemp = Math.random()*300 + innerHeight/1.5;
  let tempArr = FW_COLORS_ARRAY[Math.floor(Math.random()*FW_COLORS_ARRAY.length)];

  fireworkArray.push({
    color: tempArr[0],
    colorArr: tempArr,
    x: xTemp,
    y: yTemp,
    dx: vTemp * Math.cos(mouse.angle),
    dy: -vTemp * Math.sin(mouse.angle),
    drag: DRAG,
    ay: GRAV,
    r: FW_SIZE,
    lifeLen: lifeLenTemp,
    lifeStart: Date.now(),
    particles: [],
    hasParticles: false
  });
}

function createParticles(obj){
  let particleNum = Math.random()*40 + 50;

  for(let i = 0; i < particleNum; i++){
    let vTemp = (Math.random()*.05 + .2)*(innerHeight/FW_TIME) - GRAV * FW_TIME;
    vTemp*=0.5 * Math.random();
    let angTemp = Math.random()*2*Math.PI;
    let lifeLenTemp = Math.random()*200 + 500;

    obj.particles.push({
      x: obj.x,
      y: obj.y,
      dy: vTemp*Math.sin(angTemp),
      dx: vTemp*Math.cos(angTemp) + obj.dx,
      color: obj.colorArr[Math.floor(Math.random()*obj.colorArr.length)],
      drag: PART_DRAG,
      r: PART_SIZE,
      ay: GRAV,
      alpha: 1,
      lifeLen: lifeLenTemp,
      lifeStart: Date.now()
    })
  }
}

function drawParticles(obj){
  if(obj.particles.length == 0){
    fireworkArray.splice(fireworkArray.indexOf(obj), 1);
  }

  for(let i = 0; i < obj.particles.length; i++){
    prt = obj.particles[i];

    if(Date.now() - prt.lifeStart >= prt.lifeLen){
      obj.particles.splice(obj.particles.indexOf(prt), 1);
      continue;
    } else{
      prt.alpha = map_range(Date.now() - prt.lifeStart, prt.lifeLen, 0, 0, 1);
    }

    tempFillStyle = hexToRGBA(prt.color, prt.alpha);

    c.shadowColor = tempFillStyle;
    c.shadowBlur = GLOBAL_BLUR;
    c.fillStyle = tempFillStyle;

    c.beginPath();
    c.arc(prt.x, prt.y, prt.r, 0, Math.PI*2, false);
    c.fill();

    prt.dy += prt.ay;
    prt.dx *= prt.drag;
    prt.dy *= prt.drag;

    prt.x+=prt.dx;
    prt.y+=prt.dy;
  }
}

function drawFireworks(){
  for(let i = 0; i < fireworkArray.length; i++){
    let fw = fireworkArray[i]

    if(Date.now() - fw.lifeStart >= fw.lifeLen && !fw.hasParticles){
      fw.hasParticles = true;
      createParticles(fw);
      drawParticles(fw);
      continue;
    } if(fw.hasParticles){
      drawParticles(fw);
    } else {
      c.beginPath();
      c.shadowColor = fw.color;
      c.shadowBlur = GLOBAL_BLUR;
      c.fillStyle = fw.color;
      c.arc(fw.x, fw.y, fw.r, 0, 2*Math.PI, false);
      c.fill();

      fw.r = map_range(Date.now() - fw.lifeStart, fw.lifeLen, 0, 0, 5)

      fw.dy += fw.ay;
      fw.dx *= fw.drag;
      fw.dy *= fw.drag;

      fw.x+=fw.dx;
      fw.y+=fw.dy;
    }
  }
}

function drawCannon(){
  c.shadowBlur = 0;

  //Cannon Base
  c.beginPath();
  c.moveTo(innerWidth/2 - cannon.l, .9*innerHeight);
  c.lineTo(innerWidth/2 - cannon.h, .9*innerHeight - cannon.h);
  c.lineTo(innerWidth/2 + cannon.h, .9*innerHeight - cannon.h);
  c.lineTo(innerWidth/2 + cannon.l, .9*innerHeight);
  c.lineTo(innerWidth/2 - cannon.l, .9*innerHeight);
  c.fillStyle = "#541f1f";
  c.fill();
  // c.stroke();

  //Cannon Semi-Circle
  c.beginPath();
  c.arc(innerWidth/2, .9*innerHeight-2*cannon.h, cannon.h, -mouse.angle + Math.PI/2, -mouse.angle + 3*Math.PI/2, false);
  c.fillStyle = "#222831";
  c.fill();
  // c.stroke();

  //Cannon Tube
  c.beginPath();
  c.moveTo(innerWidth/2 - cannon.h*Math.sin(mouse.angle), .9*innerHeight- (2 + Math.cos(mouse.angle))*cannon.h);
  c.lineTo(innerWidth/2 - cannon.h*Math.sin(mouse.angle) + cannon.length*Math.cos(mouse.angle), .9*innerHeight - (2 + Math.cos(mouse.angle))*cannon.h - Math.sin(mouse.angle)*cannon.length);
  c.lineTo(innerWidth/2 + cannon.h*Math.sin(mouse.angle) + cannon.length*Math.cos(mouse.angle), .9*innerHeight - (2 - Math.cos(mouse.angle))*cannon.h - Math.sin(mouse.angle)*cannon.length);
  c.lineTo(innerWidth/2 + cannon.h*Math.sin(mouse.angle), .9*innerHeight- (2 - Math.cos(mouse.angle))*cannon.h);
  c.lineTo(innerWidth/2 - cannon.h*Math.sin(mouse.angle), .9*innerHeight- (2 + Math.cos(mouse.angle))*cannon.h);
  c.fillStyle = "#541f1f";
  c.fill();
  // c.stroke();
}

function animate(){
  requestAnimationFrame(animate);

  c.clearRect(0,0,innerWidth,innerHeight);

  drawScene();
  drawFireworks();
  drawCannon();

}

animate();
