let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

let boids = [];

const M = .06;

const M2 = .05;

const M3 = .07;

const boidNum = 250;

const vel = 2;

const maxVel = 5;

const len = 10;

const detRadius = 70;

const globalFov = 270;

const colors = ['#c1a57b', '#30475e', '#ececec'];

const drawAngle = Math.PI * 7 / 9;

function init() {
  for (let i = 0; i < boidNum; i++) {
    let headingTemp = Math.random() * Math.PI * 2;
    let xTemp = Math.random() * innerWidth;
    let yTemp = Math.random() * innerHeight;

    boids.push({
      points: [],
      x: xTemp,
      y: yTemp,
      v: vel,
      heading: headingTemp,
      fov: globalFov,
      rot: 0,
      dy: vel * Math.sin(headingTemp),
      dx: vel * Math.cos(headingTemp),
      color: colors[Math.floor(Math.random() * colors.length)],
      l: len,
      det: detRadius,
      xAcc: 0,
      yAcc: 0
    })

    boids[i].points.push({
      x: xTemp + Math.cos(headingTemp) * len,
      y: yTemp + Math.sin(headingTemp) * len
    })
    boids[i].points.push({
      x: xTemp + Math.cos(headingTemp + drawAngle) * len,
      y: yTemp + Math.sin(headingTemp + drawAngle) * len
    })
    boids[i].points.push({
      x: xTemp,
      y: yTemp
    })
    boids[i].points.push({
      x: xTemp + Math.cos(headingTemp - drawAngle) * len,
      y: yTemp + Math.sin(headingTemp - drawAngle) * len
    })
  }
}

function acc(boid){
  boid.dx += boid.xAcc;
  boid.dy += boid.yAcc;

  boid.v = distancePoints(boid.dx, boid.dy, 0, 0);

  mult = vel/boid.v;

  boid.dx *= mult;
  boid.dy *= mult;

  boid.xAcc = 0;
  boid.yAcc = 0;

}

function detectClose(boid){
  let closeBoids = [];

  for(let i = 0; i < boids.length; i++){
    bTemp = boids[i];

    if(boid==bTemp){
      continue;
    }

    let distanceToBoid = distancePoints(bTemp.x, bTemp.y, boid.x, boid.y);

    if(distanceToBoid <= boid.det){
      let angleOfRot = 5*Math.PI/2 - boid.heading;

      let distFromOrigin = distancePoints(boid.x, boid.y, 0, 0);

      let xBNew = (bTemp.x-boid.x)*Math.cos(angleOfRot) - (bTemp.y-boid.y)*Math.sin(angleOfRot);
      let yBNew = (bTemp.x-boid.x)*Math.sin(angleOfRot) + (bTemp.y-boid.y)*Math.cos(angleOfRot);

      let tempBool1 = yBNew > xBNew;
      let tempBool2 = yBNew > -xBNew;

      if(tempBool1 || tempBool2){
        closeBoids.push(bTemp);
      }
    }
  }
  return closeBoids;
}

function deviate(boid){
  let closeBoids = detectClose(boid);

  for(var i = 0; i < closeBoids.length; i++){

    bTemp = closeBoids[i];

    let dist = Math.pow(distObjsAsAtt(bTemp, boid), 2);

    if(dist<=.1){
      dist = .1;
    }

    let angleBetweenBoids = angleBetween2ObjsAsAtt(boid, bTemp);

    boid.xAcc += M*Math.cos(angleBetweenBoids)/dist;
    boid.yAcc += M*Math.sin(angleBetweenBoids)/dist;
  }
}

function align(boid){
  let closeBoids = detectClose(boid);

  let headings = [];

  for(var i = 0; i < closeBoids.length; i++){
    headings.push(closeBoids[i].heading);
    let sum = sumAngles(headings);

    boid.xAcc += M2*Math.cos(sum);
    boid.yAcc += M2*Math.sin(sum);
  }
}

function cohed(boid){
  let closeBoids = detectClose(boid);
  if(closeBoids.length!=0){
    let sumX = 0;
    let sumY = 0;

    for(var i = 0; i < closeBoids.length; i++){
      sumX += closeBoids[i].x;
      sumY += closeBoids[i].y;
    }


    sumX /= closeBoids.length;
    sumY /= closeBoids.length;

    let ang = angleBetween2Points(sumX, sumY, boid.x, boid.y);

    boid.xAcc += M3*Math.cos(ang);
    boid.yAcc += M3*Math.sin(ang);
  }
}

function reCalcSpeed(boid){
  deviate(boid);
  align(boid);
  cohed(boid);
  acc(boid);
}

function setBoidPoints(b) {
  b.points = [];
  b.points.push({
    x: b.x + Math.cos(b.heading) * b.l,
    y: b.y + Math.sin(b.heading) * b.l
  })
  b.points.push({
    x: b.x + Math.cos(b.heading + drawAngle) * b.l,
    y: b.y + Math.sin(b.heading + drawAngle) * b.l
  })
  b.points.push({
    x: b.x,
    y: b.y
  })
  b.points.push({
    x: b.x + Math.cos(b.heading - drawAngle) * b.l,
    y: b.y + Math.sin(b.heading - drawAngle) * b.l
  })
}

function checkIfOnEdge(b) {
  if(b.x > innerWidth + len){
    b.x = -len;
  } else if(b.x < -len){
    b.x = innerWidth + len;
  } else if(b.y > innerHeight + len){
    b.y = -len;
  } else if(b.y < -len){
    b.y = innerHeight + len;
  }
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < boids.length; i++) {
    b = boids[i];

    setBoidPoints(b);

    checkIfOnEdge(b);

    c.fillStyle = 'rgba(112, 108, 97, .2)';

    // c.beginPath();
    // c.moveTo(b.x, b.y);
    // c.arc(b.x, b.y, b.det, b.heading - degToRad(globalFov/2), b.heading + degToRad(globalFov/2), false);
    // c.lineTo(b.x, b.y);
    // c.fill();

    c.fillStyle = b.color;

    c.beginPath();
    c.moveTo(b.points[0].x, b.points[0].y);
    c.lineTo(b.points[1].x, b.points[1].y);
    c.lineTo(b.points[2].x, b.points[2].y);
    c.lineTo(b.points[3].x, b.points[3].y);
    c.fill();

    reCalcSpeed(b);

    b.x += b.dx;
    b.y += b.dy;

    b.heading = angleBetween2Points(b.dx,b.dy,0,0);
  }


  requestAnimationFrame(animate);
}

init();

animate();
