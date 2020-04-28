var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var t = 0;

var points = [];

var mouse = {
	x: 1,
	y: 1
}

window.addEventListener("mousemove", function(event){
	mouse.x = event.x;
	mouse.y = event.y;
})

var s = .01;
var ratio = 50;

function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0,innerWidth,innerHeight);

	c.beginPath()
	c.arc(innerWidth/2,Math.cos(t)*70 + innerHeight/2,5,0,Math.PI*2, false);
	c.fillStyle = "white";
	c.fill();

	for(var i = 0; i < points.length; i++){
		if (points[i].x < 0){
			points.unshift();
		} else{
			c.beginPath();
			c.strokeStyle="white";
			c.moveTo(points[i].x, points[i].y);
			if(i+1 == points.length){
				c.lineTo(innerWidth/2,Math.cos(t)*70 + innerHeight/2);
			} else{
				c.lineTo(points[i+1].x, points[i+1].y);
			}
			c.stroke();

			points[i].x = points[i].x - 1;
		}
	}

	points.push({
		x:innerWidth/2,
		y:Math.cos(t)*70 + innerHeight/2
	})

	s=(mouse.x/innerWidth)/ratio;

	t+=Math.PI*(s);
}

animate();
