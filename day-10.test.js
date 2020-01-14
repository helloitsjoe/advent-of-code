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

const getCount = (currX, currY, arrInput) => {
  const hit = (row, x) => row && row[x] === '#';

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
      if (seekInwardsVert(targetX, targetY)) {
        count++;
      }
    }
  });

  [firstX, lastX].map(targetX => {
    if (currX === targetX) return;

    for (let targetY = 0; targetY < arrInput.length; targetY++) {
      if (seekInwardsHoriz(targetX, targetY)) {
        count++;
      }
    }
  });

  function seekInwardsHoriz(x, y) {
    // console.log(currX, currY, '|', x, y)
    if (!isValidTarget(x, y)) return false;

    const newTargetRow = arrInput[y];

    const diffX = currX - x;
    const diffY = currY - y;

    if (diffY === 0) {
      // TODO: Can I consolidate this with the other if (hit) below?
      if (hit(newTargetRow, x)) {
        // console.log('HIT!', x, y);
        return true;
      }
      const newX = diffX > 0 ? x + 1 : x - 1;
      return seekInwardsHoriz(newX, y);
    }

    // Sides: diffY should always be larger than diffX
    const factor = Math.abs(diffY / diffX);

    if (factor !== parseInt(factor, 10)) return false;

    // We've already checked diagonals
    if (factor === 1) {
      return false;
    }

    if (hit(newTargetRow, x)) {
      // console.log('HIT!', x, y);
      return true;
    }


    const newY = diffY > 0 ? y + factor : y - factor;
    const newX = diffX > 0 ? x + 1 : x - 1;

    return seekInwardsHoriz(newX, newY);
  }

  function seekInwardsVert(x, y) {
    // console.log(currX, currY, '|', x, y)
    if (!isValidTarget(x, y)) return false;

    const newTargetRow = arrInput[y];

    if (hit(newTargetRow, x)) {
      // console.log('HIT!', x, y);
      return true;
    }

    const diffX = currX - x;
    const diffY = currY - y;

    // if x is 0, traverse inwards by 1 at a time
    // (if targetY > currentY, add 1, otherwise subtract 1)
    if (diffX === 0) {
      const newY = diffY > 0 ? y + 1 : y - 1;
      return seekInwardsVert(x, newY);
    }

    // Top/bottom: diffX should always be larger than diffY
    const factor = Math.abs(diffX / diffY);

    if (factor !== parseInt(factor, 10)) return false;

    const newY = diffY > 0 ? y + factor : y - factor;
    const newX = diffX > 0 ? x + 1 : x - 1;

    return seekInwardsVert(newX, newY);
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

fdescribe('horizontal', () => {
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

fdescribe('diagonal', () => {
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

fdescribe('simple', () => {
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
});

fdescribe('vertical', () => {
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

xdescribe('complex', () => {
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
});

xdescribe('getAllCounts', () => {
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

// const getGridMax = allCounts => {
//   const {x, y} = allCounts.reduce((gridMax, rowArr, y) => {
//     const row = rowArr.reduce((rowMax, val, x) => {
//       return val > rowMax.val ? {x, val} : rowMax;
//     }, {x: 0, val: 0});
// 
//     return row.val > gridMax.val
//       ? {y, x: row.x, val: row.val}
//       : gridMax;
//   }, {x: 0, y: 0, val: 0});
// 
//   return `${x},${y}`;
// }
// 
// it('detects asteroids in a line', () => {
//   const input = [
//     ['...'],
//     ['###'],
//   ]
//   expect(getGridMax(getAllCounts(input))).toBe('1,1');
// });
