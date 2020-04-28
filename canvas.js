var canvas = document.querySelector('canvas');

canvas.height = canvas.parentElement.height;
canvas.width = window.innerWidth;

var c = canvas.getContext('2d');

c.beginPath();
c.strokeStyle="white";
c.moveTo(0,100);
c.lineTo(100, 20);
c.stroke();
