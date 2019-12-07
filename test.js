
function test(actual, expected, message) {
  if (Array.isArray(actual)) {
    actual = actual.toString();
    expected = expected.toString();
  }
  if (actual !== expected) {
    console.error(message, 'FAIL!', 'Actual:', actual, '| Expected:', expected);
    return;
  }
  console.log(message, 'PASS!', actual);
}

module.exports = test;
