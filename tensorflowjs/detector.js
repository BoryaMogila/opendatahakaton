require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const _ = require('lodash');
const data = require('../dataset');

class Detector {

  constructor({ classNames, inputShape }) {
    this.MODEL = tf.sequential()
    this.MODEL.add(tf.layers.flatten({inputShape: inputShape}));
    this.MODEL.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    this.MODEL.add(tf.layers.dense({ units: 1, activation: 'softmax' }));
    this.MODEL.compile({optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy']})
  }
  async train(data, epochs = 5) {
    const randomIndexes = choice(data, data.length * 0.1);
    const trainInput = [];
    const trainLabels = [];
    const testInput = [];
    const testLabels = [];
    data.forEach(({ input, output }, i) => {
      if (randomIndexes.includes(i)) {
        testInput.push(input);
        testLabels.push(output);
        return;
      }

      trainInput.push(input);
      trainLabels.push(output);
    });
    for (let i = 0; i < trainInput.length; i++) {
      const trainTensor = tf.tensor(trainInput[i]);
      const trainAnswerTensor = tf.tensor(trainLabels[i]);
      console.log(trainTensor,trainAnswerTensor)
      await this.MODEL.fit(trainTensor, trainAnswerTensor, { epochs }).catch(e => console.log(e));
    }
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
    const res = this.MODEL.predict(tf.tensor([input]));
    console.log(res.print(), output)
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

const d = new Detector({ classNames: ["not ok", "ok"], inputShape: [17, 2] });
d.train(data, 5)//.then(() => {
//   d.predict(data.filter(({output}) => !output)[8])
// });
//
