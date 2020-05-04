var slider = document.getElementById('slider');

slider.min = '20';
slider.max = '100';
slider.step = '5';
slider.value = '60';

currActive = 'insertion';

insertion = {active: true, sortType: 'insertion'}
merge     = {active: false, sortType: 'merge'}
quick     = {active: false, sortType: 'quick'}
heap      = {active: false, sortType: 'heap'}
bubble    = {active: false, sortType: 'bubble'}
selection = {active: false, sortType: 'selection'}
shell     = {active: false, sortType: 'shell'}

sortArray = [bubble, insertion, selection, merge, quick, heap, shell];

function activateSort(sortingType){
    for(let i = 0; i < sortArray.length; i++){
        if(sortingType === sortArray[i].sortType){
            sortArray[i].active = true;
            currActive = sortArray[i].sortType;
        } else {
            sortArray[i].active = false;
        }
    }
    resetProgram();
}
