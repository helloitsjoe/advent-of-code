
function test(actual, expected) {
  if (Array.isArray(actual)) {
    actual = actual.toString();
    expected = expected.toString();
  }
  if (actual !== expected) {
    console.error('Actual:', actual, '| Expected:', expected);
    return;
  }
  console.log('Pass!', actual);
}

module.exports = test;
