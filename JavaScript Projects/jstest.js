function snakesOn(aPlane) {
  chars = ['_'];
  for(let i = 0; i < aPlane.length; i++){
    for(let j = 0; j < aPlane[i].length; j++){
        if(chars.indexOf(aPlane[i][j]) == -1){
          chars.push(aPlane[i][j]);
      }
    }
  }

  return chars.length - 1;
}

var aPlane = [
        'AAA__AAAAA'.split(''),
        'A___AA___A'.split(''),
        'A_AAA____A'.split(''),
        'A______AAA'.split(''),
        'AAAAAAAA__'.split('')
      ]

console.log(snakesOn(aPlane));
