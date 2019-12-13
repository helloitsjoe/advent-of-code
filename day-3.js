const test = require('./test');
const data = require('./day-3-data');

const DELIMITER = ',';

const getCoords = (command, currCoord = { x: 0, y: 0}) => {
  const [,dir, distance] = command.match(/([A-Z])(\d+)/);

  const coords = [];

  for (let i = 0; i < Number(distance); i++) {

    const axis = /[RL]/i.test(dir) ? 'x' : 'y';
    if (/[UR]/i.test(dir)) currCoord[axis]++;
    else currCoord[axis]--;

    const {x, y} = currCoord;

    coords.push(`${x}${DELIMITER}${y}`);
  };

  return coords;
}

const getCombinedCoords = commands => {
  return commands.reduce((combinedCoords, command) => {
    if (!combinedCoords.length) return getCoords(command);
    const [lastCoord] = combinedCoords.slice(-1);
    const [x, y] = lastCoord.split(DELIMITER);
    return combinedCoords.concat(getCoords(command, { x, y }))
  }, []);
};

const getCrossPoints = (wire1Coords, wire2Coords) => {
  const wire1Map = wire1Coords.reduce((a, c) => {
    a[c] = true;
    return a;
  }, {});
  return wire2Coords.filter(coord => wire1Map[coord]);
}

const getClosest = crosses => {
  return crosses.reduce((min, cross) => {
    const distance = cross.split(DELIMITER).reduce((a, c) => a + Math.abs(Number(c)), 0);
    return distance < min ? distance : min;
  }, Infinity)
}

console.clear();
// test(getCoords('R3'), ['1,0', '2,0', '3,0'], 'RIGHT coord test');
// test(getCoords('L4'), ['-1,0', '-2,0', '-3,0',  '-4,0'], 'LEFT coord test');
// test(getCoords('U5'), ['0,1', '0,2', '0,3', '0,4', '0,5'], 'UP coord test');
// test(getCoords('D3'), ['0,-1', '0,-2', '0,-3'], 'DOWN coord test');
// 
// test(getCombinedCoords(['R3', 'U2']), ['1,0', '2,0', '3,0', '3,1', '3,2'], 'combines coords');
// test(getCrossPoints(getCombinedCoords(['R8','U5','L5','D3']), getCombinedCoords(['U7','R6','D4','L4'])), ['6,5', '3,3'], 'gets cross points');
// test(getClosest(['6,5', '3,3']), 6, 'gets distance');
// test(getClosest(['6,5', '3,-12']), 11, 'gets distance with negative');

const manhattan = (wire1, wire2) => {
  const crosses = getCrossPoints(getCombinedCoords(wire1), getCombinedCoords(wire2));
  return getClosest(crosses);
};

// test(manhattan(['R75','D30','R83','U83','L12','D49','R71','U7','L72'],['U62','R66','U55','R34','D71','R55','D58','R83']), 159, 'first test');
// test(manhattan(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51'],['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']), 135, 'second test');
test(manhattan(data[0], data[1]), 446, 'gets actual answer')
