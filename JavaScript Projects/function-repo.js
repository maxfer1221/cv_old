function distObjsAsArr(a, b) {
  return Math.sqrt(Math.pow(a.x[0] - b.x[0], 2) + Math.pow(a.y[0] - b.y[0], 2));
}

function distObjsAsAtt(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function distancePoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function slopePoints(x1, y1, x2, y2){
  return (y2 - y1)/(x2 - x1);
}

function slopeObjectsAsAtt(a, b){
  return (a.y - b.y)/(a.x - b.x);
}

function angleBetween2Points(x1, y1, x2, y2){
  let m = slopePoints(x1, y1, x2, y2);
  let angle = Math.atan(m);

  if(x1 > x2 && y1 > y2){
    return angle;
  } else if(x1 > x2 && y1 < y2){
    return angle + 2*Math.PI;
  }

  return angle + Math.PI;
}

function angleBetween2ObjsAsAtt(a, b){
  let m = slopeObjectsAsAtt(a, b);
  let angle = Math.atan(m);

  if(a.x > b.x && a.y > b.y){
    return angle;
  } else if(a.x > b.x && a.y < b.y){
    return angle + 2*Math.PI;
  }

  return angle + Math.PI;
}

function sumAngles(a) {
    var s = 0;
    for (var i = 0; i < a.length; i++) s += a[i];
    return s;
}

function degToRad(a) {
    return Math.PI / 180 * a;
}

function meanAngleDeg(a) {
    return 180 / Math.PI * Math.atan2(
        sum(a.map(degToRad).map(Math.sin)) / a.length,
        sum(a.map(degToRad).map(Math.cos)) / a.length
    );
}
