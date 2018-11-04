global.XMLHttpRequest = require("xhr2");
const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const lay = fs.readdirSync('./lay');
const stay = fs.readdirSync('./stay');
require('@tensorflow/tfjs-node');

//const fetch = require('node-fetch');
const {Image, createCanvas} = require('canvas');
const posenet = require('@tensorflow-models/posenet')

async function run(src) {
  let img = new Image();
  console.log(src)
  img.src = fs.readFileSync(src);
  const canvas = createCanvas(img.width,img.height);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img,0,0);

  const imageScaleFactor = 1;
  const flipHorizontal = false;
  const outputStride = 16;
  const multiplier = 0.5;
  const maxPoseDetections = 10;
// minimum confidence of the root part of a pose
  const scoreThreshold = 0.1;
// minimum distance in pixels between the root parts of poses
  const nmsRadius = 20;

  const net  = await posenet.load(multiplier);
  const poses = await net.estimateMultiplePoses(canvas, imageScaleFactor, flipHorizontal, outputStride, maxPoseDetections, scoreThreshold, nmsRadius);

 for(let pose of poses ) {
     let {keypoints} = pose;
     keypoints.forEach(({score, position: {x, y } = {}} = {}) => {
       if (score < 0.1) return;
       ctx.beginPath();
       ctx.arc(x, y, 3, 0, 2 * Math.PI);
       ctx.fillStyle = 'red';
       ctx.fill();
     })

 }
  console.log(src.replace(/\..*$/gi, 'out.jpg'))
  fs.writeFileSync(`./output/${src}`, canvas.toBuffer())
  // return pose;
}

async function runAll(){
  const layData = await Promise.all(lay.map(src => run(`./lay/${src}`)));
  const stayData = await Promise.all(stay.map(src => run(`./stay/${src}`)));
}

//run('./example1.png');

runAll();