const data = require('./day-6-data');
const test = require('./test');

const getRoot = input => {
  const orbiters = input.reduce((acc, c) => {
    const [a, b] = c.split(')');
    acc[b] = true;
    return acc;
  }, {});
  const roots = input.map(str => {
    const [a, b] = str.split(')');
    if (!orbiters[a]) {
      return a;
    }
  });
  return roots.filter(Boolean);
}

test(getRoot(data), 'COM', 'root is COM');


