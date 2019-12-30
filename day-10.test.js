// const data = require('./day-10-data');

// console.log(data);

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

const getCount = (x, y, arr) => {
  const miss = (row, x) => !row || row && row[x] !== '#';
  const hit = (row, x) => row && row[x] === '#';

  let count = 0;
  let range = 1;
  const row = arr[y];

  if (miss(row, x)) return 0;

  const operate = (coord, op, range = 0) => {
    if (!op) {
      return coord; 
    }
    return op === '+' ? coord + range : coord - range;
  };

  // prev/next in row
  const directions = [
    // prev in row
    { opX: '-' },
    // next in row
    { opX: '+' },
    // prev in column
    { opY: '-'},
    // next in column
    { opY: '+'},
    // diagonal down right
    { opX: '+', opY: '+'},
    // diagonal up right
    { opX: '+', opY: '-'},
    // diagonal down left
    { opX: '-', opY: '+'},
    // diagonal up left
    { opX: '-', opY: '-'},
  ];

  for (let direction of directions) {
    const { opX, opY } = direction;
    const length = Math.max(arr.length, row.length);
    
    const find = (xOffset, yOffset) => {
        for (let range = 1; range < length; range++) {
          const xWithRange = operate(x, opX, range * xOffset);
          const yWithRange = operate(y, opY, range * yOffset);

          if (miss(arr[yWithRange], xWithRange)) break;

          if (found) {
            console.log('found:', xWithRange, yWithRange, '| xOff:', xOffset, 'yOff:', yOffset)
            break;
          }

          if (hit(arr[yWithRange], xWithRange)) {
            console.log('HIT:', xWithRange, yWithRange, '| xOff:', xOffset, 'yOff:', yOffset)
            count++;
            found = true;
            break;
          }
        }
    }

    let found = false;

    for (let xOffset = 1; xOffset < length; xOffset++) {
      for (let yOffset = 1; yOffset < length; yOffset++) {
        find(xOffset, yOffset);
      }
    }
  }
  
  return count;
};

fit('minimal directional example', () => {
  // My algorithm needs fixing. It hits on 4,2 | 2,4 | 3,3
  // but misses on 3,4 and 4,3
  const input = [
    ['.....'],
    ['.....'],
    ['..#.#'],
    ['...##'],
    ['..###']
  ];
  const arrInput = convertToArr(input);
  expect(getCount(2, 2, arrInput)).toBe(5);
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
  expect(getCount(0, 2, arrInput)).toBe(1);
});

it('finds in every direction', () => {
  const input = [
    ['#####'],
    ['#...#'],
    ['#.#.#'],
    ['#...#'],
    ['#####']
  ];
  const arrInput = convertToArr(input);
  expect(getCount(2, 2, arrInput)).toBe(16);
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

xit('small test', () => {
  const input = [
    ['.#..#'],
    ['.....'],
    ['#####'],
    ['....#'],
    ['...##']
  ];
  const arrInput = convertToArr(input);
  expect(getCount(1, 0, arrInput)).toBe(7);
});

it('getCount detects asteroids acute angle', () => {
  const input = [
    ['#..'],
    ['..#'],
  ];
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(1);
  expect(getCount(2, 1, arrInput)).toBe(1);
});

it('getCount detects asteroids obtuse angle', () => {
  const input = [
    ['#..'],
    ['...'],
    ['.#.'],
  ];
  const arrInput = convertToArr(input);
  expect(getCount(0, 0, arrInput)).toBe(1);
  expect(getCount(1, 2, arrInput)).toBe(1);
});

it('getCount detects asteroids diagonally', () => {
  const input = [
    ['..#..'],
    ['.....'],
    ['#...#'],
  ];
  const arrInput = convertToArr(input);
  expect(getCount(2, 0, arrInput)).toBe(2);
  expect(getCount(0, 2, arrInput)).toBe(2);
  expect(getCount(4, 2, arrInput)).toBe(2);
});

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
