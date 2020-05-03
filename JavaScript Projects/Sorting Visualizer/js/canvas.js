var canvas = document.getElementById('canvas');

var barWidth = Math.floor(400/slider.value);
var barSpacing = Math.floor(200/slider.value);

var buttonIsDisabled = false;

const FINAL_COLOR = '#95389e';
const STARTING_COLOR = '#f7f7f7';
const WORKING_COLOR = '#43d8c9';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var vals = [];

var paused = true;

function sortPauseResume(){
    if(paused && !buttonIsDisabled){document.getElementById('sort-button').childNodes[0].nodeValue = "Pause"}
    else{document.getElementById('sort-button').childNodes[0].nodeValue = "Sort!"}
    paused = !paused;
}

function resetProgram(){
    colorized = false;
    buttonIsDisabled = false;
    paused = true;
    finished = false;
    initVals();
    initSortingIndeces();
    document.getElementById('sort-button').childNodes[0].nodeValue = "Sort!"
    let str = document.getElementById('sort-button').className;
    let lengthOfRemoval = ' disabled'.length;
    let removalIndex = str.indexOf(' disabled');
    if(removalIndex != -1){
        document.getElementById('sort-button').className = str.substring(0, removalIndex);
        document.getElementById('sort-button').className += str.substr(removalIndex + lengthOfRemoval);
    }
}


function initVals(){
    vals = [];
    for(let i = 0; i < slider.value; i++){
        vals.push({value: Math.floor(Math.random()*400) + 1, color: STARTING_COLOR});
    }
    barWidth = Math.floor(800/slider.value);
    barSpacing = Math.floor(400/slider.value);
}

function drawVals(){
    let transf = canvas.width - (vals.length - 1) * barSpacing - (vals.length)*barWidth;
    transf/=2;

    for(let i = 0; i < vals.length; i++){
        c.fillStyle = vals[i].color;
        c.beginPath();
        c.rect(transf + i*barSpacing + i*barWidth, 0, barWidth, vals[i].value);
        c.fill();
    }
}

function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height);

    //check for change in array size
    if(slider.value != vals.length || vals.length == 0){
        resetProgram();
    }

    //draw array as bar graph
    drawVals();

    if(!paused && !finished){
        sortStep(currActive, vals);
    } else if(finished && !colorized){
        colorize();
    } else if(finished && colorized && !buttonIsDisabled){
        document.getElementById('sort-button').childNodes[0].nodeValue = "Sort!";
        document.getElementById('sort-button').className += ' disabled';
        buttonIsDisabled = true;
    }

    requestAnimationFrame(animate);
}

animate();
