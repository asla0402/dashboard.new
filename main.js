
"use strict"

import './style.scss'
import weekend from 'is-it-weekend'

window.addEventListener("DOMContentLoaded", get, isItWeekend(weekend));

//Get bliver kaldt hver 5 sek
setInterval(get, 5000);

const endpoint = "https://foobar-vas.herokuapp.com/";

let lastId = -1;
const sold = {
};

//Data fetching
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

//Funktionen "handleData" sender den data vi har brug for videre til vores funktioner 
function handleData(data){
  let queue = data.queue;
  let taps = data.taps; 

  addOrders(queue);
   //Her opdaterer vi ræset/rank ved at bruge "sortSold()"" funktionen som parameter i "updateRank()"
  let sortedQueue = sortSold();
  displayRank(sortedQueue);
  displayTaps(taps)
  displayQueue(queue);   
}


function addOrders(queue) {

  //Køen bliver filtreret og vi ser om der er en id der er større end sidst køen blev hentet
  //Hvis der er det gemmes den id i ""newQueue" variablen
  const newQueue = queue.filter(order => order.id > lastId)
  //Her sættes lastId 
  if(queue.length > 0){
    lastId = queue[queue.length-1].id
  }
 
  //Her tælles øllene, og der tjekkes om øl navnet eksisterer i forvejen op og det globale sold objekt opdateres 
  newQueue.forEach(queue => {
    queue.order.forEach(beer => {
      if(sold[beer] === undefined){
        sold[beer] = 1;
      }else{
        sold[beer]++;
      }
    })
  });  
}

//funktion til at sortere i de nye øl der bliver solgt
function sortSold(){
  //Det nye array som de sorterede øl skal smides ind i. Starter med den mest solgte og slutter med den mindst solgte øl.
  let sortable = [];

  //løber igennem alle beer names i objektet sold for at få lavet det til et array af arrays 
  /**
   * sold = {
   *  "el hefe": 4,
   *  "githop": 2,
   * }
   * 
   * sortable = [
   *  ["el hefe", 4],
   *  ["githop", 2]
   * ]
   */
  for(let beerName in sold){
    let beerAmount = sold[beerName];
    sortable.push([beerName, beerAmount])
  }

  //algoritme til at sortere øl antal og danne en rank fra mest til mindst solgt øl
  sortable.sort((a,b) => {
    let aAmount = a[1];
    let bAmount = b[1];
    return bAmount - aAmount;
  });
  return sortable;
}

function displayRank(sortedSoldBeers){
  
  //højden der er blevet fast ved css på nr. 1 bar
  let maxHeight = document.querySelector(".bar1").clientHeight;

  let beerHeight = 0;
 
  //hvis "sortedSoldBeers"-arraryet er 1 eller højere, så smider vi name, amount og imageName ind i den tilhørende html.
  // 1 plads!
  if (sortedSoldBeers.length >= 1) {
    // første array og første index i det array
    let name1 = sortedSoldBeers[0][0];
    // første array og anden index i det array
    let amount1 = sortedSoldBeers[0][1];
    let imageName1 = beerNameToImage(name1); 
    //højden sættet. samme højde som 2. og 3. pladsens amount bliver dividere med for at sætte deres individuelle højde
    beerHeight = maxHeight / amount1;

    //indsættese i html 
    document.querySelector(".amount1").textContent = amount1;
    document.querySelector(".name1").textContent = name1;
    document.querySelector("#beerImage1").src = imageName1;
  } 
  // 2 plads!
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
  // 3 plads!
  if (sortedSoldBeers.length >= 3) {
    let name3 = sortedSoldBeers[2][0];
    let amount3 = sortedSoldBeers[2][1];
    let barHeight = beerHeight * amount3;
    let imageName3 = beerNameToImage(name3); 

    document.querySelector(".amount3").textContent = amount3;
    document.querySelector(".name3").textContent = name3;
    document.querySelector(".bar3").style.height = barHeight + "px";
    document.querySelector("#beerImage3").src = imageName3;
  }
  
}


//Fælles funktion der kan til tilføje et image til beer name i andre funktioner 
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
    document.querySelector(".banner-text").textContent = "Try our new beer GitHop";
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