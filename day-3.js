const test = require('./test');
const data = require('./day-3-data');


const manhattan = input => {
  return input.reduce((a, c) => {
    return a;
  }, 0);
};

test(manhattan(['R75','D30','R83','U83','L12','D49','R71','U7','L72','U62','R66','U55','R34','D71','R55','D58','R83']), 159);
test(manhattan(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51','U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']), 135);
