let finished = false;
let colorized = false;
let colorizeIndex = 0;

//variables

//insertion
let insertion_index = 0;
let insertion_index2;

//merge
let merge_index1 = 0;
let merge_index2 = 0;
let workingMerger = {wa: undefined, arr1: undefined, arr2: undefined, sorted: false};

//bubble
let bubble_index = 0;
let bubble_index_old = 0;
let bubble_index2 = 0;
let bubble_index2_old = 0;
let swaps = 0;

//selection
let min = undefined;
let selection_index = 0;
let min_index = 0;

function initSortingIndeces(){
    min = undefined;
    selection_index = 0;
    min_index = 0;
    bubble_index = 0;
    colorizeIndex = 0;
    insertion_index = 0;
    workingMerger = {wa: vals, arr1: undefined, arr2: undefined, sorted: false};
}

function sortStep(sortType, array){
    if(sortType === 'insertion'){
        insertionSortStep(array);
    } else if(sortType === 'merge'){
        mergeSortStep(workingMerger);
    } else if(sortType === 'bubble'){
        bubbleSortStep(array);
    } else if(sortType === 'selection'){
        selectionSortStep(array);
    }
}

function colorize(){
    if(colorizeIndex < vals.length){
        vals[colorizeIndex].color = FINAL_COLOR;
        colorizeIndex++;
    } else{
        colorized = true;
    }
}


//insertion sort step-by-step algortihm
function insertionSortStep(arr){
    if(insertion_index == -1){
        insertion_index++;
    }
    workingVal = arr[insertion_index].value;
    arr[insertion_index].color = WORKING_COLOR;
    if(insertion_index+1 < arr.length){
        insertion_index2 = insertion_index + 1;
        workingVal2 = arr[insertion_index2].value;
        arr[insertion_index2].color = WORKING_COLOR
        if(workingVal > workingVal2 && insertion_index!=-1){
            [arr[insertion_index], arr[insertion_index2]] = [arr[insertion_index2], arr[insertion_index]];
            insertion_index--;
        } else {
            arr[insertion_index].color = STARTING_COLOR;
            insertion_index++;
        }
    } else {
        finished = true;
    }
}

//merge sort step-by-step
function mergeSortStep(wm){
    if(wm.wa.length!=2 && !wm.sorted){
        wm.arr1 = wm.wa.slice(0, Math.floor(wm.wa.length/2));
        wm.arr2 = wm.wa.slice(Math.floor(wm.wa.length/2)+1);
        console.log(wm);
    }
}

//bubble sort step-by-step
function bubbleSortStep(arr){
    arr[bubble_index_old].color = STARTING_COLOR;
    arr[bubble_index2_old].color = STARTING_COLOR;
    workingVal = arr[bubble_index].value
    if(bubble_index + 1 < arr.length){
        bubble_index2 = bubble_index + 1;
        workingVal2 = arr[bubble_index2].value;
        if(workingVal > workingVal2){
            arr[bubble_index].color = WORKING_COLOR;
            arr[bubble_index2].color = WORKING_COLOR;
            [arr[bubble_index], arr[bubble_index2]] = [arr[bubble_index2], arr[bubble_index]];
            swaps++;
        }
        bubble_index_old = bubble_index;
        bubble_index2_old = bubble_index2;
        bubble_index++;
    } else if(swaps == 0){
        finished = true;
    } else {
        bubble_index = 0;
        swaps = 0;
    }
}

//selection sort step-by-step
function selectionSortStep(arr){
    arr[selection_index].color = STARTING_COLOR;
    if(min === undefined){min = arr[selection_index];}

    min.color = WORKING_COLOR;
    if(selection_index + 1 < arr.length){
        selection_index++;
        if(arr[selection_index].value < min.value){
            min.color = STARTING_COLOR;
            min = arr[selection_index];
        }
        arr[selection_index].color = WORKING_COLOR;
    } else {
        var temp = min;
        arr[arr.indexOf(min)] = arr[min_index];
        arr[min_index] = temp;
        arr[min_index].color = FINAL_COLOR;
        min_index++;
        selection_index = min_index;
        min = undefined;
    }

    if(min_index > arr.length - 1){
        finished = true;
    }
}
