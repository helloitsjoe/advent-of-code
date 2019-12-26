const data = require('./day-10-data');

// console.log(data);

const getCount = (x, y, arr) => {
  const miss = space => space !== '#';
  const hit = (row, x) => row && row[x] === '#';

  let count = 0;
  let range = 1;
  const row = arr[y];

  if (miss(row[x])) return 0;

  // prev/next in row
  for (let range = 1; range < row.length; range++) {
    if (hit(row, x - range)) {
      count++;
      break;
    }
  }
  for (let range = 1; range < row.length; range++) {
    if (hit(row, x + range)) {
      count++;
      break;
    }
  }

  // prev/next in column
  for (let range = 1; range < arr.length; range++) {
    if (hit(arr[y - range], x)) {
      count++;
      break;
    }
  }
  for (let range = 1; range < arr.length; range++) {
    if (hit(arr[y + range], x)) {
      count++;
      break;
    }
  }

  return count;
};

const convertToArr = input => input.map(ea => ea[0].split(''));

const getAllCounts = input => {
  const arrInput = convertToArr(input);
  const output = arrInput.map(ea => Array(arrInput[0].length).fill(0));

  for (let y = 0; y < arrInput.length; y++) {
    const row = arrInput[y];
    for (let x = 0; x < row.length; x++) {
      output[y][x] = getCount(x, y, arrInput);
    }
  }
  return output;
};

it('getCount detects asteroids vertically with a space', () => {
  const input = [
    ['#.'],
    ['..'],
    ['#.'],
    ['..'],
    ['#.']
  ];
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(1);
  expect(getCount(0, 1, arrInput)).toBe(0);
  expect(getCount(0, 2, arrInput)).toBe(2);
  expect(getCount(0, 3, arrInput)).toBe(0);
  expect(getCount(0, 4, arrInput)).toBe(1);
});

it('getCount detects asteroids horizontally with a space', () => {
  const input = [
    ['.....'],
    ['#.#.#'],
  ]
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(0);
  expect(getCount(0, 1, arrInput)).toBe(1);
  expect(getCount(1, 1, arrInput)).toBe(0);
  expect(getCount(2, 1, arrInput)).toBe(2);
  expect(getCount(3, 1, arrInput)).toBe(0);
  expect(getCount(4, 1, arrInput)).toBe(1);
});

it('getCount detects asteroids vertically', () => {
  const input = [
    ['#..'],
    ['#..'],
    ['#..']
  ]
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(1);
  expect(getCount(0, 1, arrInput)).toBe(2);
  expect(getCount(0, 1, arrInput)).toBe(2);
});


it('returns all zeros for all dots', () => {
  const input = [
    ['...'],
    ['...']
  ];
  expect(getAllCounts(input)).toEqual([
    [0, 0, 0],
    [0, 0, 0]
  ]);
})

it('getCount detects asteroids horizontally', () => {
  const input = [
    ['...'],
    ['###'],
  ]
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(0);
  expect(getCount(0, 1, arrInput)).toBe(1);
  expect(getCount(1, 1, arrInput)).toBe(2);
  expect(getCount(2, 1, arrInput)).toBe(1);
});

it('getAllCounts converts asteroids to counts', () => {
  const input = [
    ['...'],
    ['###'],
  ]
  expect(getAllCounts(input)).toEqual([
    [0, 0, 0],
    [1, 2, 1]
  ]);
});

const getGridMax = allCounts => {
  const {x, y} = allCounts.reduce((gridMax, rowArr, y) => {
    const row = rowArr.reduce((rowMax, val, x) => {
      return val > rowMax.val ? {x, val} : rowMax;
    }, {x: 0, val: 0});

    return row.val > gridMax.val
      ? {y, x: row.x, val: row.val}
      : gridMax;
  }, {x: 0, y: 0, val: 0});

  return `${x},${y}`;
}

it('detects asteroids in a line', () => {
  const input = [
    ['...'],
    ['###'],
  ]
  expect(getGridMax(getAllCounts(input))).toBe('1,1');
});
