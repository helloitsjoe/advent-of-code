const data = require('./day-2-data');
const test = require('./test');

const opMap = {
  1: 'add',
  2: 'multiply',
}

const intcode = input => {
  let i = 0;
  while (i < input.length) {
    if (input[i] === 99) return input;
    const operation = opMap[input[i]];
    const first = input[input[i + 1]];
    const second = input[input[i + 2]];
    input[input[i + 3]] = operation === 'add' ? first + second : first * second;
    i += 4;
  } 
}

for (let i = 0; i <100; i++) {
  for (let j = 0; j <100; j++) {
    const dataCopy = [...data];
    const target = 19690720;
    dataCopy[1] = i;
    dataCopy[2] = j;
    if (intcode(dataCopy)[0] === target) {
      console.log('Winner!', i, j);
    }
  }
}



// test(intcode([1,9,10,3,2,3,11,0,99,30,40,50]), [3500,9,10,70,2,3,11,0,99,30,40,50]);
// test(intcode([1,0,0,0,99]), [2,0,0,0,99]);
// test(intcode([2,3,0,3,99]), [2,3,0,6,99]);
// test(intcode([2,4,4,5,99,0]), [2,4,4,5,99,9801]);
// test(intcode([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]);

// console.log(intcode(data));

