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
  img.src = fs.readFileSync('./test.png');
  const canvas = createCanvas(img.width,img.height);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img,0,0);

    const imageScaleFactor = 1;
  const flipHorizontal = false;
  const outputStride = 16;
  const multiplier = 0.5;

  const net  = await posenet.load(multiplier);
  const poses = await net.estimateMultiplePoses(canvas, imageScaleFactor, flipHorizontal, outputStride);

  const def = [x,y,number]

 for(let pose of poses ) {
     let {keypoints} = pose;
     keypoints.forEach(({position: {x, y } = {}} = {}) => {
       ctx.beginPath();
       ctx.arc(x, y, 3, 0, 2 * Math.PI);
       ctx.fillStyle = 'red';
       ctx.fill();
     })

 }

  fs.writeFileSync('out.jpg', canvas.toBuffer())
  // return pose;
}

run();