global.XMLHttpRequest = require("xhr2");
const fs = require('fs');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const {Image, createCanvas} = require('canvas');
const posenet = require('@tensorflow-models/posenet');
const _ = require('lodash');

const lay = fs.readdirSync('./lay');
const stay = fs.readdirSync('./stay');

async function getPoints(sourse) {
  //let img_path = 'ANY_IMAGE_URL';
  //let buffer = await fetch(img_path).then(res => res.buffer());
  let img = new Image();
  img.src = fs.readFileSync(sourse);
  const canvas = createCanvas(img.width,img.height);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img,0,0);
  const imageScaleFactor = 1;
  const flipHorizontal = false;
  const outputStride = 16;
  const multiplier = 0.5;

  const net  = await posenet.load(multiplier);
  const poses = await net.estimateMultiplePoses(canvas, imageScaleFactor, flipHorizontal, outputStride);
  const res = [];
  poses.map(({ keypoints }) => {
    res.push(keypoints.map(({position: {x, y } = {}} = {}, index) => [x / img.height,y / img.width,index / 100]));
  });
  return res
}


async function run(){
  const layData = await Promise.all(lay.map(src => getPoints(`./lay/${src}`)));
  const stayData = await Promise.all(stay.map(src => getPoints(`./stay/${src}`)));
  const persons = [];
  layData.map(peoples => {
    peoples.map(people => persons.push({input: people, output: 1}));
  })
  stayData.map(peoples => {
    peoples.map(people => persons.push({input: people, output: 0}));
  })
  console.log(persons);
  fs.writeFileSync('./dataset.json', JSON.stringify(persons), 'utf-8')
}

run();