'use strict';

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
// generates random number
function randomNumber(min, max) {
  return Number(Math.floor(Math.random() * (max - min + 1)) + min);
}

const leftImageEl = document.getElementById('left-img');
const centerImageEl = document.getElementById('center-img');
const rightImageEl = document.getElementById('right-img');
const pollSection = document.getElementById('poll-section');
const roundsForm = document.getElementById('rounds-form');

let storedVotes = [];
let storedViews = [];
let totalVotesArray = [];
let totalViewsArray = [];
// set empty arrays for storing and adding votes and views
for (let i = 0; i < item.length; i++) {
  storedVotes[i] = 0;
  storedViews[i] = 0;
  totalVotesArray[i] = 0;
  totalViewsArray[i] = 0;
}
// console.log('votes before adjust: ' + storedVotes);

// storing the data in local storage
function storeData(){
  let totalVotesString = JSON.stringify(storedVotes);
  let totalViewsString = JSON.stringify(storedViews);

  localStorage.setItem('votes', totalVotesString);
  localStorage.setItem('views', totalViewsString);
}
// retrieving the data from local storage
function retrieveData(){
  let totalVotesString = localStorage.getItem('votes');
  let totalViewsString = localStorage.getItem('views');

  let totalVotesArrayIn = JSON.parse(totalVotesString);
  let totalViewsArrayIn = JSON.parse(totalViewsString);

  if (totalVotesArrayIn){
    for (let i = 0 ; i < totalViewsArrayIn.length; i ++){
      totalVotesArray[i] = totalVotesArrayIn[i];
      totalViewsArray[i] = totalViewsArrayIn[i];
    }
  }
}
// add votes and views into their own arrays and adjusts to include data from local
function adjustData(){
  for (let i = 0; i < item.length; i++) {
    storedVotes[i] = Number(pollProducts[i].votes + totalVotesArray[i]);
    storedViews[i] = Number(pollProducts[i].views + totalViewsArray[i]);
  }
  // console.log('votes after adjust: ' + storedVotes);
}

// unique indexes for pictures
let leftIndex;
let centerIndex;
let rightIndex;

// empty array to allow first pass
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
  // console.log to ensure that each set of three is different from the previous set
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
  const yourResultsHead = document.createElement('h3');
  yourResultsHead.textContent = 'Thank you for participating! The results of your current poll are as follows:';
  pollResultsArticle.appendChild(yourResultsHead);
  const resultUl = document.createElement('ul');
  pollResultsArticle.appendChild(resultUl);
  for (let i = 0; i < pollProducts.length; i++) {
    const resultLi = document.createElement('li');
    resultLi.textContent = pollProducts[i].name + ' had ' + pollProducts[i].votes + ' votes after being shown ' + pollProducts[i].views + ' times. This, as a percentile, equals: ' + percentile(pollProducts[i]);
    resultUl.appendChild(resultLi);
  }
  const allResultsHead = document.createElement('h3');
  allResultsHead.textContent = 'Below is a chart that represents the results of all polls:';
  pollResultsArticle.appendChild(allResultsHead);
}

// event listener for form (user round adjustment)
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

// event listener for clicks (counts votes and rounds)
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
      retrieveData();
      adjustData();
      storeData();
      totals();
      chartRender();
    }
  }
}

let votesTotal = [];
let viewsTotal = [];
let chartLabels = [];
function totals(){
  for (let i = 0; i < pollProducts.length; i++) {
    votesTotal.push(storedVotes[i]);
    viewsTotal.push(storedViews[i]);
    chartLabels.push(pollProducts[i].name);
  }
}

// canvas chart
function chartRender() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Votes',
        backgroundColor: 'rgb(220, 20, 60, 0.5)',
        borderColor: 'rgb(220, 20, 60)',
        data: votesTotal
      }]
    },
    options: {}
  });
  addData(chart, 'Views', 'rgb(0, 0, 139, 0.5)', 'rgb(0, 0, 139)', viewsTotal);
}
// add dataset to chart
function addData(chart, label, color, border, data) {
  chart.data.datasets.push({
    label: label,
    backgroundColor: color,
    borderColor: border,
    data: data
  });
  chart.update();
}