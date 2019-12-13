const test = require('./test');

const min = 372037;
const max = 905157;

const validate = num => {
  const digits = num.toString().split('');

  let double = null;
  let triple = null;
  let twoPrevDigit = null;
  let prevDigit = null;

  for (let i = 0; i < digits.length; i++) {
    const currDigit = digits[i];

    if (currDigit < prevDigit) return false;

    if (currDigit === prevDigit) {
      const nextDigit = digits[i + 1];
      if (currDigit === twoPrevDigit || currDigit === nextDigit) triple = currDigit;
      else double = currDigit;
    }

    twoPrevDigit = prevDigit;
    prevDigit = currDigit;
  };

  return double != null && double !== triple; 
};

// Part 1 - no limitation of how many duplicates in a row
// test(validate(111111), true, 111111);
// test(validate(111112), true, 111112);
// test(validate(211112), false, 211112);
// test(validate(123456), false, 123456);
// test(validate(123466), true, 123466);

// Part 2 - There must be one pair of numbers that
test(validate(111111), false, 111111);
test(validate(111122), true, 111122);
test(validate(112222), true, 112222);
test(validate(211112), false, 211112);
test(validate(123456), false, 123456);
test(validate(123466), true, 123466);
test(validate(123666), false, 123666);
test(validate(661234), false, 661234);

const getNumberOfPasswords = (min, max) => {
  let valid = 0;
  for (let i = min; i <= max; i++) {
    if (validate(i)) valid++;
  }
  return valid;
};

// test(getNumberOfPasswords(min, max), 481, 'number of passwords');
test(getNumberOfPasswords(min, max), 299, 'number of passwords');
