const brain = require('brain.js');
const _ = require('lodash');
const data = require('../dataset');
const model = require('../model');
const fs = require('fs');

class Detector {
  constructor() {}
  async train(data) {
    const config = {
      hiddenLayers: [3],
      activation: 'relu',
      errorThresh: 0.0005,
    };
    this.MODEL = new brain.NeuralNetwork(config);
    const randomIndexes = choice(data, data.length * 0.1);
    const trainInput = [];
    const testInput = [];
    const testLabels = [];
    data.forEach(({ input, output }, i) => {
      if (randomIndexes.includes(i)) {
        testInput.push(input);
        testLabels.push(output);
        return;
      }
      trainInput.push({ input, output: {lay: output} });
    });
    console.log('dfdfd', JSON.stringify(trainInput[0], null, 2))
    this.MODEL.train(trainInput);
    //this.MODEL.fromJSON(model);
    console.log('dfgdfgdfgdf')
    fs.writeFileSync('./model.json', JSON.stringify(this.MODEL.toJSON()), 'utf-8')
    // const trainTensor = tf.tensor(trainInput);
    // const trainAnswerTensor = tf.tensor(trainLabels.map(n => [n, 0]))
    // console.log(trainInput.length,trainTensor,trainAnswerTensor)
    // await this.MODEL.fit(trainTensor, trainAnswerTensor, { epochs }).catch(e => console.log(e));
    // const testInputTensor = tf.tensor(trainInput);
    // const testLabelsTensor = tf.tensor(trainLabels.map(n => [n, 0]))
    // const result = this.MODEL.evaluate(testInputTensor, testLabelsTensor)
    // console.log(result[1].print())
  }

  predict({input, output}) {
    const res = this.MODEL.run(input);
    console.log(res, output)
  }
}

function choice (data, count) {
  const values = [];
  do {
    const index = _.random(0, data.length);
    if(!values.includes(index)) values.push(index);
  } while (values.length !== count);
  return values;
}

const d = new Detector();
d.train(data).then(() => {
  d.predict(data[0])
});
