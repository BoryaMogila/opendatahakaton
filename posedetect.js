const fs = require('fs');
const posenet = require('@tensorflow-models/posenet');
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

async function estimatePoseOnImage(imageElement) {
  // load the posenet model from a checkpoint
  const net = await posenet.load();

  const pose = await net.estimateMultiplePoses(imageElement, imageScaleFactor, flipHorizontal, outputStride);

  return pose;
}

const imageElement = fs.readFileSync('./2018-11-03.jpg');

const pose = estimatePoseOnImage(imageElement);

console.log(pose);