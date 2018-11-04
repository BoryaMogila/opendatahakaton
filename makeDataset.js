const fs = require('fs');
const getPoints = require('./getPoints');
const lay = fs.readdirSync('./lay');
const stay = fs.readdirSync('./stay');
const _ = require('lodash');

async function run(){
  const layData = await Promise.all(lay.map(src => getPoints(fs.readFileSync(`./lay/${src}`))));
  const stayData = await Promise.all(stay.map(src => getPoints(fs.readFileSync(`./stay/${src}`))));
  const data = []
  layData.map(peoples => {
    peoples.map(people => data.push({input: people, output: 1}));
  });
  stayData.map(peoples => {
    peoples.map(people => data.push({input: people, output: 0}));
  });
  let persons = [].concat(data);
  for (let i = 0; i < 50; i++) {
    _.shuffle(data);
    persons = persons.concat(data);
  }
  fs.writeFileSync('./dataset.json', JSON.stringify(persons), 'utf-8')
}

run();