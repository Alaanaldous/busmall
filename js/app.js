var item = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'usb.gif',
  'water-can.jpg',
  'wine-glass.jpg'
];

let pollProducts = [];
function Product(item) {
  this.name = item.split('.').slice(0, -1).join('.');
  this.path = `imgs/${item}`;
  this.votes = 0;
  this.views = 0;
  pollProducts.push(this);
}

// add products from items array to Product object
for (let i = 0; i < item.length; i++) {
  new Product(item[i]);
}

function randomNumber(min, max) {
  return Number(Math.floor(Math.random() * (max - min + 1)) + min);
}

const leftImageEl = document.getElementById('left-img');
const centerImageEl = document.getElementById('center-img');
const rightImageEl = document.getElementById('right-img');
const pollSection = document.getElementById('poll-section');
const roundsForm = document.getElementById('rounds-form');

let leftIndex;
let centerIndex;
let rightIndex;
// array with invalid index to allow first pass
let indexes = [];

// checking the same image doesn't come up more than once
function checkIndex() {
  leftIndex = randomNumber(0, pollProducts.length - 1);
  centerIndex = randomNumber(0, pollProducts.length - 1);
  rightIndex = randomNumber(0, pollProducts.length - 1);

  while (indexes.indexOf(leftIndex) !== -1 || indexes.indexOf(centerIndex) !== -1 || indexes.indexOf(rightIndex) !== -1 || leftIndex === centerIndex || centerIndex === rightIndex || leftIndex === rightIndex) {
    while (indexes.indexOf(leftIndex) !== -1) {
      leftIndex = randomNumber(0, pollProducts.length - 1);
    }
    while (indexes.indexOf(centerIndex) !== -1) {
      centerIndex = randomNumber(0, pollProducts.length - 1);
    }
    while (indexes.indexOf(rightIndex) !== -1) {
      rightIndex = randomNumber(0, pollProducts.length - 1);
    }
    while (leftIndex === centerIndex || centerIndex === rightIndex || leftIndex === rightIndex) {
      if (leftIndex === centerIndex || centerIndex === rightIndex) {
        while (centerIndex === leftIndex || centerIndex === rightIndex) {
          centerIndex = randomNumber(0, pollProducts.length - 1);
        }
      }
      if (leftIndex === rightIndex) {
        while (rightIndex === leftIndex || rightIndex === centerIndex) {
          rightIndex = randomNumber(0, pollProducts.length - 1);
        }
      }
    }
  }
  indexes = [];
  indexes.push(leftIndex);
  indexes.push(centerIndex);
  indexes.push(rightIndex);
  console.log(indexes);
}

function imagesRender() {
  //add to views counter
  checkIndex();
  pollProducts[leftIndex].views++;
  pollProducts[centerIndex].views++;
  pollProducts[rightIndex].views++;
  //adding src path
  leftImageEl.src = pollProducts[leftIndex].path;
  centerImageEl.src = pollProducts[centerIndex].path;
  rightImageEl.src = pollProducts[rightIndex].path;
  //adding alt text
  leftImageEl.alt = pollProducts[leftIndex].name;
  centerImageEl.alt = pollProducts[centerIndex].name;
  rightImageEl.alt = pollProducts[rightIndex].name;
  //adding title text
  leftImageEl.title = pollProducts[leftIndex].name;
  centerImageEl.title = pollProducts[centerIndex].name;
  rightImageEl.title = pollProducts[rightIndex].name;
}

// calculating percentage and rendering results
function percentile(item) {
  let x = Number(item.votes / (clicks - 1)) * 100;
  return Math.round(x) + '%';
}
function resultsRender() {
  const pollResultsArticle = document.createElement('article');
  pollSection.appendChild(pollResultsArticle);
  const resultsHead = document.createElement('h3');
  resultsHead.textContent = 'Thank you for participating! The results of your poll are as follows:';
  pollResultsArticle.appendChild(resultsHead);
  const resultUl = document.createElement('ul');
  pollResultsArticle.appendChild(resultUl);
  for (let i = 0; i < pollProducts.length; i++) {
    const resultLi = document.createElement('li');
    resultLi.textContent = pollProducts[i].name + ' had ' + pollProducts[i].votes + ' votes after being shown ' + pollProducts[i].views + ' times. This, as a percentile, equals: ' + percentile(pollProducts[i]);
    resultUl.appendChild(resultLi);
  }
}

let rounds = 25;
roundsForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const roundNumber = Number(event.target.round.value);
  // console.log('roundNumber:' + roundNumber);
  if (roundNumber === null || isNaN(roundNumber) || roundNumber === ' ') {
    rounds = 25;
  } else {
    rounds = roundNumber;
  }
  roundsForm.reset();
  imagesRender();
});
// console.log('rounds:' + rounds);

let clicks = 1;
pollSection.addEventListener('click', clickHandler);
function clickHandler(event) {
  if (clicks < rounds) {
    if (event.target.id !== 'poll-section') {
      for (let i = 0; i < pollProducts.length; i++) {
        if (pollProducts[i].name === event.target.title) {
          pollProducts[i].votes++;
          clicks++;
        }
      }
      imagesRender();
      console.log(pollProducts);
      console.log('clicks:' + clicks);
    }
  } else if (clicks === rounds) {
    if (event.target.id !== 'poll-section') {
      for (let i = 0; i < pollProducts.length; i++) {
        if (pollProducts[i].name === event.target.title) {
          pollProducts[i].votes++;
          clicks++;
        }
      }
      document.getElementById('poll-section').removeEventListener('click', clickHandler);
      resultsRender();
      totals();
      chartRender();
    }
  }
}

// canvas chart
function chartRender() {
  var ctx = document.getElementById('myChart').getContext('2d');
  // ctx.defaults.global.defaultFontSize = '15px';
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Votes',
        backgroundColor: 'rgb(220, 20, 60, 0.5)',
        borderColor: 'rgb(220, 20, 60)',
        data: votesTotal
      }]
    },
    // Configuration options go here
    options: {}
  });
  addData(chart, 'Views', 'rgb(0, 0, 139, 0.5)', 'rgb(0, 0, 139)', viewsTotal);
}

function addData(chart, label, color, border, data) {
  chart.data.datasets.push({
    label: label,
    backgroundColor: color,
    borderColor: border,
    data: data
  });
  chart.update();
}

let votesTotal = [];
let viewsTotal = [];
let chartLabels = [];
function totals(){
  for (let i = 0; i < pollProducts.length; i++) {
    votesTotal.push(pollProducts[i].votes);
    viewsTotal.push(pollProducts[i].views);
    chartLabels.push(pollProducts[i].name);
  }
}