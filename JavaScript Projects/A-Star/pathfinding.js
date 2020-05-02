let openNodes = [];
let closedNodes = [];
let trgt;
let strt;

let finished = false;

let paused = true;

function initializeArrays(gridArray){
    for(let i = 0; i < gridArray.length; i++){
        for(let j = 0; j < gridArray[i].length; j++){
            if(gridArray[i][j].type == 1){
                strt = gridArray[i][j];
                openNodes.push(gridArray[i][j]);
                continue;
            } else if(gridArray[i][j].type == 2){
                trgt = gridArray[i][j];
            }
        }
    }
}

function step(){
    if(!paused && openNodes.length == 0){
        finished = true;
    }
    if(!paused && !finished){
        cheap = findCheapest();
        stepIntoNode(cheap);
    }
}

//find the cheapest node in the set of open nodes
function findCheapest(){
    let cheapestNode = openNodes[0];
    for(let i = 1; i < openNodes.length; i++){
        if(openNodes[i].t < cheapestNode.t){
            cheapestNode = openNodes[i];
        }
    }
    return cheapestNode;
}

function stepIntoNode(currNode){
    if(currNode!=strt){
        currNode.type = 5;
        currNode.color = closed_col;
    }
    for(let i = currNode.col - 1; i <= currNode.col + 1; i++){
        for(let j = currNode.row - 1; j <= currNode.row + 1; j++){
            workingNode = grid[j][i];
            if(workingNode.type == 1){
                continue;
            } if(workingNode.type == 5 && workingNode != currNode){
                pNTemp = workingNode.pNode;
                workingNode.pNode = currNode;
                if(calcG(workingNode) > workingNode.g){
                    workingNode.pNode = pNTemp;
                } else {
                    workingNode.g = calcG(workingNode);
                }
            }
            else if(workingNode.type == 0){
                workingNode.pNode = currNode;
                workingNode.type = 4;
                workingNode.color = open_col;
                workingNode.g = calcG(workingNode);
                workingNode.h = calcH(workingNode);
                workingNode.t = calcT(workingNode);
                openNodes.push(workingNode);
            } else if(workingNode.type == 4){
                continue;
            } else if(workingNode.type == 2){
                while(currNode.pNode != undefined){
                    currNode.type = 6
                    currNode.color = path_col;
                    currNode = currNode.pNode;
                }
                finished = true;
                break;
            }
        }
    }
    openNodes.splice(openNodes.indexOf(currNode), 1);
    closedNodes.push(currNode);
}

//calulate h, g and total costs, respectively
function calcH(node){
    dist = Math.sqrt(Math.pow(node.row - trgt.row, 2) + Math.pow(node.col - trgt.col, 2));
    return Math.floor(dist*10);
}

function calcG(node){
    dist = Math.sqrt(Math.pow(node.row - node.pNode.row, 2) + Math.pow(node.col - node.pNode.col, 2));
    if(node.pNode.g === undefined){return Math.floor(dist*10)}
    return Math.floor(dist*10) + node.pNode.g;
}

function calcT(node){
    return node.h + node.g;
}
