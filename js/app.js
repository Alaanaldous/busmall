'use strict';

var app = document.getElementById('app');
var clickRemining = 25;
var photosOnSecondToLastScreen = [];
var photosOnPreviousScreen = [];
var photosOnScreen = [];

function Images (name, filename){
  this.name = name;
  this.src = filename;
  this.clickCount = 0;
  this.displayCount = 0;
}
var imageGroup;
try{
  imageGroup = JSON.parse(localStorage.imageGroup);
} catch(error){
  var bag =  new Images('Bag','img/bag.jpg');
  var banana =  new Images('Banana Cutter', 'img/banana.jpg');
  var bathroom =  new Images ('Tablet Holder for Bathroom', 'img/bathroom.jpg');
  var boots =  new Images('Boots', 'img/boots.jpg');
  var breakfast =  new Images('breakfast', 'img/breakfast.jpg');
  var bubblegum =  new Images('Bubble Gum', 'img/bubblegum.jpg');
  var chair =  new Images ('Comfy Chair', 'img/chair.jpg');
  var cthulhu =  new Images('Cthulhu centerpeice', 'img/cthulhu.jpg');
  var duckDog =  new Images('duck dog', 'img/dog-duck.jpg');
  var dragon =  new Images ('Dragon', 'img/dragon.jpg');
  var pen =  new Images('pen', 'img/pen.jpg');
  var broomDog =  new Images('Broom Dog', 'img/pet-sweep.jpg');
  var scissors =  new Images('scissors', 'img/scissors.jpg');
  var shark =  new Images('Shark', 'img/shark.jpg');
  var broomBaby =  new Images ('Broom Baby', 'img/sweep.png');
  var tauntaun =  new Images ('tauntaun', 'img/tauntaun.jpg');
  var unicorn =  new Images ('unicorn', 'img/unicorn.jpg');
  var usb =  new Images ('USB', 'img/usb.gif');
  var watering =  new Images ('Watering Can', 'img/water-can.jpg');
  var wine =  new Images ('Wine Glass', 'img/wine-glass.jpg');

  imageGroup = [bag, banana, bathroom, boots, breakfast, bubblegum, chair, cthulhu, duckDog, dragon, pen, broomDog, scissors, shark, broomBaby, tauntaun, unicorn, usb, watering, wine ];
}

function getRandomIndex (list){
  return Math.floor(Math.random() * list.length);
}

function getThreeImages (){
  imageGroup = imageGroup.concat(photosOnSecondToLastScreen);
  photosOnSecondToLastScreen = photosOnPreviousScreen;
  photosOnPreviousScreen = photosOnScreen;
  photosOnScreen = [];
  var photo = imageGroup.splice(getRandomIndex(imageGroup), 1);
  photosOnScreen = photosOnScreen.concat(photo);
  var photo = imageGroup.splice(getRandomIndex(imageGroup), 1);
  photosOnScreen = photosOnScreen.concat(photo);
  var photo = imageGroup.splice(getRandomIndex(imageGroup), 1);
  photosOnScreen = photosOnScreen.concat(photo);
  return photosOnScreen;
}

function handlePhotoClick(event){
  var image = event.target;
  photosToRender[image.id].clickCount++;
  clickRemining--;
  if (clickRemining > 0){
    renderPhotoChoise();
  } else if (clickRemining === 0){
    imageGroup = imageGroup.concat(photosOnScreen, photosOnPreviousScreen, photosOnSecondToLastScreen);
    renderChart();
    displayChartTwo();
    // getTable();
    // getTableNumber();
    try {
      localStorage.imageGroup = JSON.stringify(imageGroup);
    } catch (error){
      console.log(error);
    }
  }
}
var photosToRender = getThreeImages();
function renderPhotoChoise(){
  photosToRender = getThreeImages();
  app.textContent = '';
  var imageElement;
  for (var i = 0; i < photosToRender.length; i++){
    photosToRender[i].displayCount++;
    imageElement = document.createElement('img');
    imageElement.src = photosToRender[i].src;
    imageElement.id = '' + i;
    imageElement.addEventListener('click', handlePhotoClick);
    app.appendChild(imageElement);
    console.log(photosToRender[i].clickCount);
  }

}

function renderChart() {

  var canvas = document.getElementById('chart-canvas1');
  var ctx = canvas.getContext('2d');
  var data = {
    labels: ['bag', 'banana', 'bathroom', 'boots','breakfast', 'bubblegum', 'chair', 'cthulhu', 'duckDog', 'dragon', 'pen', 'broomDog', 'scissors', 'shark', 'broomBaby', 'tauntaun', 'unicorn', 'usb', 'watering', 'wine' ],
    datasets:[{
      label: 'Clicks',
      backgroundColor: '#2F343B',
      borderWidth: 1,
      data: [imageGroup[0].clickCount,
        imageGroup[1].clickCount,
        imageGroup[2].clickCount,
        imageGroup[3].clickCount,
        imageGroup[4].clickCount,
        imageGroup[5].clickCount,
        imageGroup[6].clickCount,
        imageGroup[7].clickCount,
        imageGroup[8].clickCount,
        imageGroup[9].clickCount,
        imageGroup[10].clickCount,
        imageGroup[11].clickCount,
        imageGroup[12].clickCount,
        imageGroup[13].clickCount,
        imageGroup[14].clickCount,
        imageGroup[15].clickCount,
        imageGroup[16].clickCount,
        imageGroup[17].clickCount,
        imageGroup[18].clickCount,
        imageGroup[19].clickCount]},
    {
      label: 'Displayed',
      backgroundColor: '#703030',
      borderWidth: 1,
      data: [imageGroup[0].displayCount, imageGroup[1].displayCount, imageGroup[2].displayCount, imageGroup[3].displayCount, imageGroup[4].displayCount, imageGroup[5].displayCount, imageGroup[6].displayCount, imageGroup[7].displayCount, imageGroup[8].displayCount, imageGroup[9].displayCount, imageGroup[10].displayCount, imageGroup[11].displayCount, imageGroup[12].displayCount, imageGroup[13].displayCount, imageGroup[14].displayCount, imageGroup[15].displayCount, imageGroup[16].displayCount, imageGroup[17].displayCount, imageGroup[18].displayCount, imageGroup[19].displayCount ]}
    ]
  };
  canvas.height = '200';
  canvas.width = '500';
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
  });
}
function displayChartTwo() {

  var canvas = document.getElementById('chart-canvas2');
  var ctx = canvas.getContext('2d');
  var data = {
    labels: ['bag', 'banana', 'bathroom', 'boots','breakfast', 'bubblegum', 'chair', 'cthulhu', 'duckDog', 'dragon', 'pen', 'broomDog', 'scissors', 'shark', 'broomBaby', 'tauntaun', 'unicorn', 'usb', 'watering', 'wine' ],
    datasets:[{
      label: 'Percentages',
      backgroundColor:
        '#E3CDA4',
      borderWidth: 1,
      data: [Math.round((imageGroup[0].clickCount / imageGroup[0].displayCount) * 100),
        Math.round((imageGroup[1].clickCount / imageGroup[1].displayCount) * 100), Math.round((imageGroup[2].clickCount / imageGroup[2].displayCount) * 100), Math.round((imageGroup[3].clickCount / imageGroup[3].displayCount) * 100), Math.round((imageGroup[4].clickCount / imageGroup[4].displayCount) * 100),
        Math.round((imageGroup[5].clickCount / imageGroup[5].displayCount) * 100),
        Math.round((imageGroup[6].clickCount / imageGroup[6].displayCount) * 100), Math.round((imageGroup[7].clickCount / imageGroup[7].displayCount) * 100), Math.round((imageGroup[8].clickCount / imageGroup[8].displayCount) * 100), Math.round((imageGroup[9].clickCount / imageGroup[9].displayCount) * 100),
        Math.round((imageGroup[10].clickCount / imageGroup[10].displayCount) * 100), Math.round((imageGroup[11].clickCount / imageGroup[11].displayCount) * 100), Math.round((imageGroup[12].clickCount / imageGroup[12].displayCount) * 100), Math.round((imageGroup[13].clickCount / imageGroup[13].displayCount) * 100),
        Math.round((imageGroup[14].clickCount / imageGroup[14].displayCount) * 100),
        Math.round((imageGroup[15].clickCount / imageGroup[15].displayCount) * 100), Math.round((imageGroup[16].clickCount / imageGroup[16].displayCount) * 100), Math.round((imageGroup[17].clickCount / imageGroup[17].displayCount) * 100), Math.round((imageGroup[18].clickCount / imageGroup[18].displayCount) * 100),
        Math.round((imageGroup[19].clickCount / imageGroup[19].displayCount) * 100) ]},
    ]
  };
  canvas.height = '200';
  canvas.width = '500';
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
  });
}

renderPhotoChoise();

// function getTable (){
//   var result = document.getElementById('form');
//   var table = document.createElement('table');
//   table.id = table;
//   var titleRow = document.createElement('tr');
//   var titleItem = document.createElement('th');
//   titleItem.textContent = 'Item';
//   var titleViews = document.createElement('th');
//   titleViews.textContent = 'Views';
//   var titleClicks = document.createElement('th');
//   titleClicks.textContent = 'Clicks';
//   var titlePercetage = document.createElement('th');
//   titlePercetage.textContent = '% of Clicks When Viewed';
//   var titleRecomended = document.createElement('th');
//   titleRecomended.textContent = 'Recomended';
//   table.appendChild(titleItem);
//   table.appendChild(titleViews);
//   table.appendChild(titleClicks);
//   table.appendChild(titlePercetage);
//   table.appendChild(titleRecomended);
//   result.appendChild(table);
// }

// function getTableNumber(){
//   var table = document.getElementById('table');
//   for (var i = 0; i < imageGroup.length; i++){
//     var bodyRow = document.createElement('tr');
//     table.appendChild(bodyRow);
//     var item = document.createElement('td');
//     item.textContent = imageGroup[i].name;
//     item.appendChild(data);
//   }
// }