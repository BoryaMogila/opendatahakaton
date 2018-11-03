global.XMLHttpRequest = require("xhr2");
const fs = require('fs');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

//const fetch = require('node-fetch');
const {Image, createCanvas} = require('canvas');
const posenet = require('@tensorflow-models/posenet')

async function run() {
  //let img_path = 'ANY_IMAGE_URL';
  //let buffer = await fetch(img_path).then(res => res.buffer());
  let img = new Image();
  img.src = fs.readFileSync('./2018-11-03.jpg');;
  const canvas = createCanvas(img.width,img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img,0,0);

  const imageScaleFactor = 0.5;
  const flipHorizontal = false;
  const outputStride = 8;
  const multiplier = 0.5;

  const net  = await posenet.load(multiplier);
  const pose = await net.estimateSinglePose(canvas, imageScaleFactor, flipHorizontal, outputStride);
  ctx.fillText('Awesome!', 50, 100);
  console.log(pose, canvas);
  fs.writeFileSync('out.jpg', canvas.toBuffer())
  return pose;
}

run();