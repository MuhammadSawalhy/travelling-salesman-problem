#!/usr/bin/env node

const seedrnd = require('seedrandom');
const readline = require('readline');
const rng = new seedrnd("shortest-path");
let COUNT = 100; // count of points

let a;
if ((a = process.argv.indexOf('--count')) > -1 || (a = process.argv.indexOf('-c')) > -1) {
  COUNT = parseInt(process.argv[a+1]);
}

let rndPoints = [];

// generate points data
for (let i = 0; i < COUNT; i++) {
  let newPoint = { x: rng(), y: rng() };
  rndPoints.push(newPoint);
}

// time complexity: O(2n + sum((2m)^2, 1, n))
function getTheShortestPath(points, startingPoint) {
  startingPoint = startingPoint || points[Math.floor(Math.random() * points.length)];
  points = [...points]; // time complexity: O(n)
  let minDist, path = [startingPoint], a, b, c;
  // remove the starting point
  // b = startingPoint
  b = points.splice(points.findIndex(p=>p===startingPoint), 1); // time complexity: O(n)
  while (points.length) { // time complexity: O(sum((2m)^2, 1, n)) at the worst situation
    minDist = Number.MAX_SAFE_INTEGER;
    for (let i=0; i<points.length; i++) {
      if ((c = distSquare(points[i], b)) < minDist)
        (minDist = c, a=i);
    }
    b = points.splice(a,1);
    path.push(b[0]);
  }

  // now we have our points sorted in our new array `path`;
  return path;
}

function getRandomPath(points, startingPoint) {
  points = [...points]; // time complexity: O(n)
  if (!startingPoint) return points.sort(()=> 0.5 - Math.random);
  points.splice(points.findIndex(p=>p===startingPoint), 1);
  points.sort(()=> 0.5 - Math.random);
  points.unshift(startingPoint);
  return points;
}

function computePathDistance(path) {
  let totalDist = 0;
  for (let i=1; i<path.length; i++) totalDist += dist(path[i-1], path[i]);
  return totalDist; 
}

function dist(p1, p2) {
  return ((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2) ** 0.5;
}

function distSquare(p1, p2) {
  return ((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

let myStartingPoint = rndPoints[0];
let myPath = getTheShortestPath(rndPoints, myStartingPoint);
let myDist = computePathDistance(myPath);

console.log(myPath);
console.log("the distance:", myDist);

function compare(numOfTrails) {
  for (let i = 0; i < numOfTrails; i++) {
    console.log("testing the result:", i+1);
    let rndPath = getRandomPath(rndPoints, myStartingPoint);
    let rndPathDist = computePathDistance(rndPath);
    if (rndPathDist < myDist) {
      console.log();
      console.log("--------------------------------------");
      console.log("--------------------------------------");
      console.log("--------------------------------------");
      console.log("--------------------------------------");
      console.log("--------------------------------------");
      console.log("--------------------------------------");
      console.log();
      console.log(rndPath)
      return;
    }
  }
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to test this result? (y)/n: ', (answer) => {
  if (answer === "y" || /^\s*$/.test(answer)) {
    rl.question("Enter number of tests: (1e6)", (answer) => {
      let numOfTests = parseInt(answer || 1e6);
      compare(numOfTests);
      rl.close();
    });
  } else {
    rl.close();
  }
});

