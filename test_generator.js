const Generator = require('./server/logic/Generator');
const assert = require('assert');

// Test Level 1
const p1 = Generator.generate(1);
assert(p1.target <= 15, 'L1 Target too high');
assert(p1.disabledButtons.length === 0, 'L1 should have no disabled buttons');
console.log('Level 1 Passed');

// Test Level 5
const p5 = Generator.generate(5);
assert(p5.target > 0, 'L5 Target exists');
assert(p5.disabledButtons.length === 4, 'L5 must disable 4 buttons');
console.log('Level 5 Passed');
