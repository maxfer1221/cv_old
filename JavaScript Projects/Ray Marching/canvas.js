var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var envStrokeStyle = "#706c61";
var envFillStyle = "#706c61";

var mainStrokeStyle = "#FFFFFF";
var mainFillStyle = "#FFFFFF";

var detectionCircleFillStyle = "rgba(112, 108, 97, .5)";
var detectionCircleStrokeStyle = "#e1f4f3";

var consol = false;

var circleNum = -1;

var environment = [];

var circles = [];

var maxCircles = 40;

var coords = [];

var main = {
  cw: false,
  ccw: false,
  x: [300],
  y: [500],
  r: 10,
  up: false,
  down: false,
  left: false,
  right: false,
  v: 5,
  angle: 0,
  heading: 0.002,
  dist: 0
}

var pressed = false;

window.addEventListener('mousedown', function() {
  pressed = true;
})

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
  if (event.code === "KeyF") {
    consol = true;
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

function init() {
  environment.push({
    clss: 'circle',
    x: [500],
    y: [700],
    r: 50
  })

  environment.push({
    clss: 'quad',
    x: [1300, 1400, 1400, 1300],
    y: [200, 200, 500, 500]
  })

  environment.push({
    clss: 'tri',
    x: [900, 960, 800],
    y: [600, 760, 700]
  })

  environment.push({
    clss: 'circle',
    x: [700],
    y: [200],
    r: 100
  })

  environment.push({
    clss: 'line',
    x: [0, innerWidth],
    y: [0, 0]
  })

  environment.push({
    clss: 'line',
    x: [innerWidth, innerWidth],
    y: [0, innerHeight]
  })

  environment.push({
    clss: 'line',
    x: [0, innerWidth],
    y: [innerHeight, innerHeight]
  })

  environment.push({
    clss: 'line',
    x: [0, 0],
    y: [0, innerWidth]
  })
}

function fillEnivronment() {
  c.fillStyle = envStrokeStyle;

  for (var i = 0; i < environment.length; i++) {
    e = environment[i];

    c.beginPath();

    if (e.clss === 'circle') {
      c.arc(e.x[0], e.y[0], e.r, 0, Math.PI * 2, false);
    } else {
      c.moveTo(e.x[0], e.y[0]);
      for (var j = 0; j < e.x.length + 1; j++) {
        try {
          c.lineTo(e.x[j], e.y[j]);
        } catch (err) {
          c.lineTo(e.x[0], e.y[0]);
        }
      }
    }
    c.fill();
  }
}

function distanceObjs(a, b) {
  return Math.sqrt(Math.pow(a.x[0] - b.x[0], 2) + Math.pow(a.y[0] - b.y[0], 2));
}

function distancePoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}


function largestCircleRadius(a) {
  var circle = {
    r: 0,
    x: a.x,
    y: a.y
  }

  var notCollided = true;

  var m;

  while (notCollided) {
    for (var i = 0; i < environment.length; i++) {
      e = environment[i];
      if (e.clss === "circle") {
        if (distanceObjs(circle, e) <= e.r + circle.r) {
          return circle.r;
        }
      } else {
        ma = [];
        perpma = [];
        for (var j = 0; j < e.x.length; j++) {
          x1 = e.x[(j + 1) % e.x.length];
          x2 = e.x[j];
          y1 = e.y[(j + 1) % e.x.length];
          y2 = e.y[j];

          m = (y2 - y1) / (x2 - x1);

          var a;
          var b;

          var numerator = (circle.x[0] / m) + circle.y[0] + m * x2 - y2;
          var denom = m + (1 / m);

          var xsol = numerator / denom;
          var ysol = (-1 / m) * (xsol - circle.x[0]) + circle.y[0];

          if (x1 > x2) {
            xmax = x1;
            xmin = x2;
          } else {
            xmax = x2;
            xmin = x1;
          }
          if (y1 > y2) {
            ymax = y1;
            ymin = y2;
          } else {
            ymax = y2;
            ymin = y1;
          }

          if (m == Infinity || m == -Infinity) {
            a = y2 - circle.y[0];
            b = y1 - circle.y[0];

            if (((a >= 0 && b <= 0) || (a <= 0 && b >= 0)) && distancePoints(circle.x[0], circle.y[0], x2, circle.y[0]) <= circle.r) {
              return circle.r;
            } else if (distancePoints(circle.x[0], circle.y[0], x2, y2) <= circle.r) {
              return circle.r;
            } else if (distancePoints(circle.x[0], circle.y[0], x1, y1) <= circle.r) {
              return circle.r;
            }
          } else if (m == 0 || m == -0) {
            a = x2 - circle.x[0];
            b = x1 - circle.x[0];
            if (((a >= 0 && b <= 0) || (a <= 0 && b >= 0)) && distancePoints(circle.x[0], circle.y[0], circle.x[0], y2) <= circle.r) {
              return circle.r;
            } else if (distancePoints(circle.x[0], circle.y[0], x2, y2) <= circle.r) {
              return circle.r;
            } else if (distancePoints(circle.x[0], circle.y[0], x1, y1) <= circle.r) {
              return circle.r;
            }
          } else if (distancePoints(circle.x[0], circle.y[0], xsol, ysol) <= circle.r && xsol <= xmax && xsol >= xmin && ysol <= ymax && ysol >= ymin) {
            console.log(true);
            return circle.r;
          } else if (distancePoints(circle.x[0], circle.y[0], x1, y1) <= circle.r) {
            return circle.r;
          } else if (distancePoints(circle.x[0], circle.y[0], x2, y2) <= circle.r) {
            return circle.r;
          }
        }
      }
    }
    circle.r += .1;
  }
}

function drawCircle(x, y, r) {
  c.strokeStyle = detectionCircleStrokeStyle;
  c.fillStyle = detectionCircleFillStyle;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2, false);
  c.fill();
  c.stroke();
}

function drawStyledCircle(x, y, r, stroke, fill) {
  c.strokeStyle = stroke;
  c.fillStyle = fill;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2, false);
  c.fill();
  c.stroke();
}

function drawDetectionCircle(circle) {
  var r = largestCircleRadius(circle);

  drawCircle(circle.x[0], circle.y[0], r);

  circle.dist = r;
}

function drawChildren(circle) {
  circleNum++;
  circles.push({
    x: [circle.x[0] + circle.dist * Math.cos(circle.angle)],
    y: [circle.y[0] + circle.dist * Math.sin(circle.angle)],
    r: 3,
    angle: circle.angle
  })

  c.beginPath();
  c.moveTo(circle.x[0], circle.y[0]);
  c.lineTo(circles[circleNum].x[0], circles[circleNum].y[0]);
  c.stroke();

  drawStyledCircle(circles[circleNum].x[0], circles[circleNum].y[0], circles[circleNum].r, '#FFFFFF', '#FFFFFF');

  drawDetectionCircle(circles[circleNum]);

  if (circleNum < maxCircles && circles[circleNum].dist >= 1) {
    drawChildren(circles[circleNum]);
  } else {
    const cir = {
      x: circles[circleNum].x[0],
      y: circles[circleNum].y[0]
    }



  coords.push({});

  if(coords.length>300){
    coords.shift();
  }

  Object.assign(coords[coords.length-1], cir);
  circleNum = -1;
  circles = [];
  }
}

function animate() {

  requestAnimationFrame(animate);

  if (main.up) {
    main.y[0] -= main.v;
  }
  if (main.right) {
    main.x[0] += main.v;
  }
  if (main.left) {
    main.x[0] -= main.v;
  }
  if (main.down) {
    main.y[0] += main.v;
  }
  if (main.cw) {
    main.angle += main.heading;
  }
  if (main.ccw) {
    main.angle -= main.heading;
  }

  c.clearRect(0, 0, innerWidth, innerHeight);

  fillEnivronment();

  drawStyledCircle(main.x[0], main.y[0], main.r, mainStrokeStyle, mainFillStyle);
  drawDetectionCircle(main);

  drawChildren(main);

  for(let i = 0; i < coords.length; i++){
    drawStyledCircle(coords[i].x, coords[i].y, 2, '#FFFFFF', '#FFFFFF');
  }
}

init();

animate();
//
// if(consol){
//   console.log("y2 = " + y2);
//   console.log("x2 = " + x2);
//   console.log("y1 = " + y1);
//   console.log("x1 = " + x1);
//   console.log("m = " + m);
//   console.log("-1/m = " + -1/m);
//   console.log("cx[0] = " + circle.x[0]);
//   console.log("cy[0] = " + circle.y[0]);
//   console.log("cr = " + circle.r);
//   console.log("ysol = " + ysol);
//   console.log("xsol = " + xsol);
// }
//
