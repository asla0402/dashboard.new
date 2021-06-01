
"use strict"

import './style.scss'
import weekend from 'is-it-weekend'

window.addEventListener("DOMContentLoaded", get, isItWeekend(weekend));
setInterval(get, 5000);

const endpoint = "https://foobar-vas.herokuapp.com/";

let lastId = -1;
const sold = {};

function get() {
  fetch(endpoint, {
      method: "get",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
  }) 
  .then((e) => e.json())
  .then(handleData);
}

function handleData(data){
  let queue = data.queue;

  let taps = data.taps; 


  displayTaps(taps)
  addOrder(queue);
  displayQueue(queue);
}


function addOrder(queue) {
  //init
  //emty object to insert the data 
  //everytime we recieve new data
  const newQueue = queue.filter(order => order.id > lastId)

  if(queue.length > 0){
    lastId = queue[queue.length-1].id
  }
  
  newQueue.forEach(queue => {
    queue.order.forEach(beer => {
      if(sold[beer] === undefined){
        sold[beer] = 1;
      }else{
        sold[beer]++;
      }
    })
  });  

  let sortedQueue = sortSold();
  updateRank(sortedQueue);
}

function sortSold(){
  let sortable = [];

  for(let beer in sold){
    sortable.push([beer, sold[beer]])
  }

  sortable.sort((a,b) => {
    let aAmount = a[1];
    let bAmount = b[1];
    return bAmount - aAmount;
  });

  return sortable;
}

function updateRank(sortedSoldBeers){
  
  let maxHeight = document.querySelector(".bar1").clientHeight;

  let beerHeight = 0;
 
  if (sortedSoldBeers.length >= 1) {
    let name1 = sortedSoldBeers[0][0];
    let amount1 = sortedSoldBeers[0][1];
    let imageName1 = beerNameToImage(name1); 
    
    beerHeight = maxHeight / amount1;

    document.querySelector(".amount1").textContent = amount1;
    document.querySelector(".name1").textContent = name1;
    document.querySelector("#beerImage1").src = imageName1;
  } 

  if (sortedSoldBeers.length >= 2) {
    let name2 = sortedSoldBeers[1][0];
    let amount2 = sortedSoldBeers[1][1];
    let barHeight = beerHeight * amount2;
    let imageName2 = beerNameToImage(name2); 

    document.querySelector(".amount2").textContent = amount2;
    document.querySelector(".name2").textContent = name2;
    document.querySelector(".bar2").style.height = barHeight + "px";
    document.querySelector("#beerImage2").src = imageName2;

  }
  if (sortedSoldBeers.length >= 3) {
    let name3 = sortedSoldBeers[2][0];
    let amount3 = sortedSoldBeers[2][1];
    let barHeight = beerHeight * amount3;
    let imageName3 = beerNameToImage(name3); 

    document.querySelector(".amount3").textContent = amount3;
    document.querySelector(".name3").textContent = name3;
    document.querySelector(".bar3").style.height = barHeight + "px";
    document.querySelector("#beerImage3").src = imageName3;


    //document.querySelector("#app").innerHTML = '';
    //document.querySelector("#app").appendChild(clone);
  }
}

//Fælles funktion der kan bruges i alle mine if-statements i updataRank(sortedSoldBeers)
function beerNameToImage(beerName) {
  let imageName = beerName.trim().toLowerCase().replace(/\s/g, "");
  let imagePath = imageName + ".png";

  return imagePath
}

function displayQueue(queue) {
  let queueAmount = "x" + queue.length;
  document.querySelector(".wait-time").textContent = queueAmount;
}


function isItWeekend(weekend) {

  if(weekend === false) {
    document.querySelector(".banner-text").textContent = "Every fifth beer you buy is on us";
  } else {
    document.querySelector(".banner-text").textContent = "Try our new beer Github";
  }
  //const bool = weekend([208])
  // will log `true` if it's Saturday or Sunday
  console.log(weekend());
}



function displayTaps(taps) {
  
  const template = document.querySelector("template").content;
  const parentDivContainer = document.querySelector(".beer-taps");
  parentDivContainer.innerHTML = '';

  taps.forEach((tap) => {
    let beer = tap.beer;
    let tapsImage = beerNameToImage(beer);
    const copy = template.cloneNode(true);
    copy.querySelector("h2").textContent = beer
    copy.querySelector(".level").textContent = "Level: " + tap.level;
    copy.querySelector(".capacity").textContent = "Capacity: " + tap.capacity;
    copy.querySelector("img").src = tapsImage;
    parentDivContainer.appendChild(copy);
  });
}