const data = require('./day-6-data');
// const test = require('./test');

const getOrbiterMap = arr => {
  return arr.reduce((acc, c) => {
    const [host, orbiter] = c.split(')');
    acc[orbiter] = host;
    return acc;
  }, {});
};

const getDirectAndIndirectOrbits = arr => {
  //console.log('arr', arr);
  const orbiterMap = getOrbiterMap(arr);
  // console.log(orbiterMap);
  
  return arr.reduce((acc, curr) => {
    let orbits = 0;
    let [host, orbiter] = curr.split(')');

    while (orbiter !== 'COM') {
      orbits++;
      host = orbiter;
      orbiter = orbiterMap[host];
    }

    return acc + orbits;

    // TODO: memoize
  }, 0);
}

test.each`
input                                    | output
${['A)B', 'B)C', 'COM)A']}               | ${6}
${['A)B', 'B)C', 'COM)A', 'B)D', 'D)E']} | ${13}
${data}                                  | ${122782}
`('gets direct and indirect orbits', ({input, output}) => {
  const numOrbits = getDirectAndIndirectOrbits(input);
  expect(numOrbits).toBe(output);
});


getDirectRoute = (arr, start, end = 'COM') => {
  const orbiterMap = getOrbiterMap(arr);

  let orbiter = start;
  let host = orbiterMap[start];
  let route = [];
  
  while (orbiter !== end) {
    host = orbiter;
    orbiter = orbiterMap[host];
    route.push(orbiter);
  }

  return route;
};

// test(getDirectRoute(['COM)A', 'A)B', 'C)D', 'B)C'], 'D'), ['C', 'B', 'A', 'COM']);


const getCommonRoot = (arr, a, b) => {
  const aRoute = getDirectRoute(arr, a); 
  const bRoute = getDirectRoute(arr, b); 

  let lastCommon = 'COM';

  const getLast = arr => arr[arr.length - 1];
  
  while (getLast(aRoute) === getLast(bRoute)) {
    lastCommon = getLast(aRoute);
    aRoute.pop();
    bRoute.pop();
  }

  return lastCommon;
};

// test(getCommonRoot(['COM)A', 'A)B', 'A)C', 'B)D', 'C)E'], 'D', 'E'), 'A');

const getOrbitsToSanta = arr => {
  const commonRoot = getCommonRoot(arr, 'YOU', 'SAN');

  const youSteps = getDirectRoute(arr, 'YOU', commonRoot).length - 1;
  const santaSteps = getDirectRoute(arr, 'SAN', commonRoot).length - 1;

  return youSteps + santaSteps;
};
  
test('get direct orbits', () => {
  const actual = getDirectRoute(['COM)A', 'A)B', 'C)D', 'B)C'], 'D'); 
  expect(actual).toEqual(['C', 'B', 'A', 'COM']);
});

test.each`
inputData                                    | output
${['COM)A', 'A)B', 'A)C', 'B)YOU', 'C)SAN']} | ${2}
${data}                                      | ${271}
`('gets test orbits to santa', ({inputData, output}) => {
  const numOrbits = getOrbitsToSanta(inputData);
  expect(numOrbits).toBe(output);
});


// COM is root

