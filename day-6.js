const data = require('./day-6-data');
const test = require('./test');

const getOrbiterMap = arr => {
  return arr.reduce((acc, c) => {
    const [host, orbiter] = c.split(')');
    acc[orbiter] = host;
    return acc;
  }, {});
};

const getOrbits = arr => {
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

test(getOrbits(['A)B', 'B)C', 'COM)A']), 6);
test(getOrbits(['A)B', 'B)C', 'COM)A', 'B)D', 'D)E']), 13);
test(getOrbits(data), 122782);

// COM is root

