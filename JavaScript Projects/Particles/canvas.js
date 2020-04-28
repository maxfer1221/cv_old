var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var circleArray = [];

var circleNum = innerWidth*innerHeight/1000;

var mouse = {
	x: undefined,
	y: undefined
};

var maxSpeed = 6;
var maxRadiusSize = 50;

var colorArray = ["#E63946", "#A8DADC", "#457B9D", "#1D3557"];

function init(){
	circleArray = [];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	circleNum = innerWidth*innerHeight/1000;
	for (var i = 0; i < circleNum; i++){
		var rc = Math.floor(Math.random()*4 + 4);
		circleArray.push({
			radius : rc,
			originalRadius : rc,
			maxRadius : rc + maxRadiusSize,
			x : Math.floor(Math.random()*(innerWidth - rc*2) + rc),
			y : Math.floor(Math.random()*(innerHeight - rc*2) + rc),
			color : colorArray[Math.floor(Math.random()*4)],
			dx : Math.random() * maxSpeed - 3,
			dy : Math.random() * maxSpeed - 3
		});
	}
}

init();

window.addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
})

window.addEventListener('resize', function(){
	init();
})

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);
	for(var i = 0; i < circleArray.length; i++){
		var cir = circleArray[i];

		if (Math.pow(cir.x - mouse.x, 2) + Math.pow(cir.y - mouse.y, 2) <= 8000 && cir.radius < cir.maxRadius){
			cir.radius += 2;
		}

		else if (cir.radius > cir.originalRadius){
			cir.radius -= 2;
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

		cir.x = cir.x + cir.dx;
		cir.y = cir.y + cir.dy;
	}	
}

animate();