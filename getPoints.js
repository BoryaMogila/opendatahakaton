global.XMLHttpRequest = require("xhr2");
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const {Image, createCanvas} = require('canvas');
const posenet = require('@tensorflow-models/posenet');

module.exports = async function getPoints(sourse, array = false) {
  let img = new Image();
  img.src = sourse;
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
  if (array) return poses.map(({ keypoints }) => {
    return keypoints.map(({part, position: {x, y } = {}} = {}) => [x / img.height, y / img.width]);
  });
  return poses.map(({ keypoints }) => {
    const data = {};
    keypoints.map(({part, position: {x, y } = {}} = {}) => {
      data[`${part}x`]= x / img.height;
      data[`${part}y`]= y / img.width;
    });
    return data;
  });
};