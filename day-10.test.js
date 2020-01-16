const data = require('./day-10-data');

console.log(data);

const convertToArr = input => input.map(ea => ea[0].split(''));

const hit = (row, x) => row && row[x] === '#';

const isCorner = (x, y, arr) => {
  const yIsFirstOrLast = y === 0 || y === arr.length - 1;
  return (x === 0 && yIsFirstOrLast) ||
    (x === arr[0].length - 1 && yIsFirstOrLast);
}

// const isInteger = num => num !== parseInt(num, 10);

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

const getCount = (currX, currY, arrInput) => {

  let count = 0;

  // target is asteroid we're seeking
  // current is current square we're counting

  if (!hit(arrInput[currY], currX)) return 0;

  // start in upper left corner, traverse top + bottom
  const firstY = 0; 
  const lastY = arrInput.length - 1;

  const firstX = 0;
  const lastX = arrInput[0].length - 1;

  [firstY, lastY].map(targetY => {
    if (currY === targetY) return;

    const targetRow = arrInput[targetY];
    
    for (let targetX = 0; targetX < targetRow.length; targetX++) {
      if (seekInwardsFromTopBottom(targetX, targetY)) {
        count++;
      }
    }
  });

  [firstX, lastX].map(targetX => {
    if (currX === targetX) return;

    for (let targetY = 0; targetY < arrInput.length; targetY++) {
      if (seekInwardsFromSides(targetX, targetY)) {
        count++;
      }
    }
  });

  function seekInwardsFromTopBottom(x, y) {
    // console.log('fromTopBottom', currX, currY, '|', x, y)
    if (!isValidTarget(x, y)) return false;

    if (hit(arrInput[y], x)) {
      return true;
    }

    const diffX = currX - x;
    const diffY = currY - y;

    // if x is 0, traverse inwards by 1 at a time
    if (diffX === 0) {
      const newY = diffY > 0 ? y + 1 : y - 1;
      return seekInwardsFromTopBottom(x, newY);
    }

    const factor = Math.abs(diffY / diffX);
    // Top/bottom: diffY should always be larger than diffX
    // if (!Number.isInteger(factor)) return false;

    const newY = diffY > 0 ? y + factor : y - factor;
    const newX = diffX > 0 ? x + 1 : x - 1;

    return seekInwardsFromTopBottom(newX, newY);
  }

  function seekInwardsFromSides(x, y) {
    // console.log('fromSides', currX, currY, '|', x, y)
    if (!isValidTarget(x, y)) return false;

    const diffX = currX - x;
    const diffY = currY - y;

    // We've already checked corners
    if (diffY !== 0 && isCorner(x, y, arrInput)) {
      return false;
    }

    if (hit(arrInput[y], x)) {
      // console.log('HIT!', currX, currY, '|', x, y);
      return true;
    }

    if (diffY === 0) {
      const newX = diffX > 0 ? x + 1 : x - 1;
      return seekInwardsFromSides(newX, y);
    }

    const factor = Math.abs(diffX / diffY);
    // Sides: diffX should always be larger than diffY
    // if (!Number.isInteger(factor)) return false;

    const newY = diffY > 0 ? y + 1 : y - 1;
    const newX = diffX > 0 ? x + factor : x - factor;

    return seekInwardsFromSides(newX, newY);
  }

  function isValidTarget(x, y) {
    if (Math.abs(x) > arrInput[y.length] ||
      Math.abs(y) > arrInput.length) {
      // console.log('OUT OF BOUNDS', x, y);
      return false;
    }
    if (x === currX && y === currY) return false;

    return true;
  }

  return count;

}

const getGridMax = allCounts => {
  const {x, y, val} = allCounts.reduce((gridMax, rowArr, y) => {
    const row = rowArr.reduce((rowMax, val, x) => {
      return val > rowMax.val ? {x, val} : rowMax;
    }, {x: 0, val: 0});

    return row.val > gridMax.val
      ? {y, x: row.x, val: row.val}
      : gridMax;
  }, {x: 0, y: 0, val: 0});

  return `${x},${y}: ${val}`;
}


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

describe('horizontal', () => {
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

  it('getCount detects INNER asteroids horizontally', () => {
    const input = [
      ['.....'],
      ['.###.'],
    ]
    const arrInput = convertToArr(input);
    expect(getCount(0, 0, arrInput)).toBe(0);
    expect(getCount(0, 1, arrInput)).toBe(0);
    expect(getCount(1, 1, arrInput)).toBe(1);
    expect(getCount(2, 1, arrInput)).toBe(2);
    expect(getCount(3, 1, arrInput)).toBe(1);
    expect(getCount(4, 1, arrInput)).toBe(0);
  });

  it('does not overdetect horizontally', () => {
    const input = [
      ['.....'],
      ['#####'],
    ]
    const arrInput = convertToArr(input);
    expect(getCount(0, 0, arrInput)).toBe(0);
    expect(getCount(0, 1, arrInput)).toBe(1);
    expect(getCount(1, 1, arrInput)).toBe(2);
    expect(getCount(2, 1, arrInput)).toBe(2);
    expect(getCount(3, 1, arrInput)).toBe(2);
    expect(getCount(4, 1, arrInput)).toBe(1);
  });
});

describe('diagonal', () => {
  it('getCount detects INNER asteroids diagonally', () => {
    const input = [
      ['...'],
      ['.#.'],
      ['#..'],
    ]
    const arrInput = convertToArr(input);
    expect(getCount(0, 2, arrInput)).toBe(1);
    expect(getCount(1, 1, arrInput)).toBe(1);
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
});

describe('vertical', () => {
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

  it('getCount detects INNER asteroids vertically', () => {
    const input = [
      ['...'],
      ['#..'],
      ['#..'],
      ['#..'],
      ['...']
    ]
    const arrInput = convertToArr(input);
    expect(getCount(0, 0, arrInput)).toBe(0);
    expect(getCount(0, 1, arrInput)).toBe(1);
    expect(getCount(0, 2, arrInput)).toBe(2);
    expect(getCount(0, 3, arrInput)).toBe(1);
    expect(getCount(0, 4, arrInput)).toBe(0);
  });

  it('getCount does not overdetect vertical asteroids', () => {
    const input = [
      ['#.'],
      ['#.'],
      ['#.'],
      ['#.'],
      ['#.']
    ];
    const arrInput = convertToArr(input);
    expect(getCount(0, 0, arrInput)).toBe(1);
    expect(getCount(0, 1, arrInput)).toBe(2);
    expect(getCount(0, 2, arrInput)).toBe(2);
    expect(getCount(0, 3, arrInput)).toBe(2);
    expect(getCount(0, 4, arrInput)).toBe(1);
  });
});

describe('complex', () => {
  it('minimal directional example', () => {
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

  it('finds in obtuse angle outside first row', () => {
    const input = [
      ['...'],
      ['#..'],
      ['..#'],
    ];
    const arrInput = convertToArr(input);
    expect(getCount(2, 2, arrInput)).toBe(1);
  });
  it('small test', () => {
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
  it('4, 3 test', () => {
    const input = [
      ['.#...'],
      ['.....'],
      ['.....'],
      ['....#'],
      ['.....']
    ];
    const arrInput = convertToArr(input);
    expect(getCount(1, 0, arrInput)).toBe(1);
  });
});

describe('getAllCounts', () => {
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
});

describe('getGridMax', () => {
  it('detects asteroids in a line', () => {
    const input = [
      ['...'],
      ['###'],
    ]
    expect(getGridMax(getAllCounts(input))).toBe('1,1: 2');
  });
});

describe('examples from adventofcode', () => {
  it('first', () => {
    const input = data[0]; 
    expect(getGridMax(getAllCounts(input))).toBe('5,8: 33');
  });
  it('second', () => {
    const input = data[1]; 
    expect(getGridMax(getAllCounts(input))).toBe('1,2: 35');
  });
  it('third', () => {
    const input = data[2]; 
    expect(getGridMax(getAllCounts(input))).toBe('6,3: 41');
  });
  it('fourth', () => {
    const input = data[3]; 
    expect(getGridMax(getAllCounts(input))).toBe('11,13: 210');
  });
  it('fifth', () => {
    const input = data[4]; 
    expect(getGridMax(getAllCounts(input))).toBe('20,8: 10');
  });
});
