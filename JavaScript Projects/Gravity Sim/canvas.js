var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var circleArray = [];

var circleNum = 50;

var maxSpeed = 1;

var minDist = 20;

var pressed = false;

var colorArray = ['rgba(142, 249, 243, 1)', 'rgba(89, 60, 143, 1)', 'rgba(255, 217, 206, 1)', 'rgba(219, 84, 97, 1)'];
var trailColor = ['rgba(142, 249, 243, .3)', 'rgba(89, 60, 143, 0.3)', 'rgba(255, 217, 206, .3)', 'rgba(219, 84, 97, .3)'];


var mouse = {
	x: 0,
	y: 0
};

window.addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
})

window.addEventListener('mousedown', function(event) {
	pressed = true;
})

window.addEventListener('mouseup', function(event) {
	pressed = false;
})


function init(){
	circleArray = [];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	for (var i = 0; i < circleNum; i++){
		var rc = Math.floor(Math.random()*4 + 4);
		var ci = Math.floor(Math.random()*4);
		circleArray.push({
			radius : rc,
			x : Math.floor(Math.random()*(innerWidth - rc*2) + rc),
			y : Math.floor(Math.random()*(innerHeight - rc*2) + rc),
			colorIndex : ci,
			trailColor : trailColor[ci],
			color : colorArray[ci],
			dx : Math.random()*maxSpeed - .5,
			dy : Math.random()*maxSpeed - .5,
			ax : 0,
			ay : 0
		});
	}
}

init();

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);
	for(var i = 0; i < circleArray.length; i++){
		cir = circleArray[i];

		for(var j = 1; j <= 5; j++){
			c.beginPath();
			c.fillStyle = cir.trailColor;
			c.arc(cir.x - cir.dx*j, cir.y - cir.dy*j, cir.radius - .2*(j-1), 0, Math.PI*2, false);
			c.fill();
		}

		c.fillStyle = cir.color;
		c.beginPath();
		c.arc(cir.x, cir.y, cir.radius, 0, Math.PI*2, false)
		c.fill();

		if(cir.x + cir.radius > innerWidth || cir.x - cir.radius < 0){
			cir.dx = -cir.dx;
		}

		if(cir.y + cir.radius > innerHeight || cir.y - cir.radius < 0){
			cir.dy = -cir.dy;
		}

		let td = Math.sqrt(Math.pow(cir.x - mouse.x, 2) + Math.pow(cir.y - mouse.y, 2));

		var a = 0;

		if(pressed){
			cir.dx = cir.dx * .99;
			cir.dy = cir.dy * .99;
		}

		if (td > minDist){
			a = 3 / Math.pow(td, 2);
		} else {
			a = 3 / Math.pow(minDist, 2);
		}

		cosTheta = (cir.x - mouse.x)/td;
		sinTheta = (cir.y - mouse.y)/td

		cir.ax = cosTheta * a * -10;
		cir.ay = sinTheta * a * -10;

		cir.dx = cir.dx + cir.ax;
		cir.dy = cir.dy + cir.ay;

		cir.x = cir.x + cir.dx;
		cir.y = cir.y + cir.dy;
	}
}

animate();
