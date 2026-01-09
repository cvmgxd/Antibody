/**
 * test_logic.js
 * Verification for Phase 2 success criteria.
 */
const Solver = require('../logic/Solver');
const Generator = require('../logic/Generator');

console.log('--- 🧪 PHASE 2: ARITHMETIC ENGINE TEST ---');

// 1. Verify Solver (PJ-SC-03)
console.log('\n[1/3] Testing Solver Reachability...');
const test1 = Solver.canSolve(24, [4, 6], ['*'], 1); // 4 * 6 = 24
const test2 = Solver.canSolve(2, [5, 2], ['/'], 1); // 5 / 2 = 2 (Floor policy)
const test3 = Solver.canSolve(100, [1], ['+'], 5); // Impossible in 5 steps

console.log(`- 24 from [4, 6] with *: ${test1 ? 'PASS' : 'FAIL'}`);
console.log(`- 2 from [5, 2] with /: ${test2 ? 'PASS (Floor check)' : 'FAIL'}`);
console.log(`- 100 from [1] (Max Steps 5): ${!test3 ? 'PASS (Bound check)' : 'FAIL'}`);

// 2. Verify Generator Scaling (PJ-SC-04)
console.log('\n[2/3] Testing Generator Scaling...');
const level1 = Generator.generate(1);
const level5 = Generator.generate(5);

console.log(`- Level 1 Target: ${level1.target} (Disabled: ${level1.disabledButtons.length})`);
console.log(`- Level 5 Target: ${level5.target} (Disabled: ${level5.disabledButtons.length})`);

if (level5.target > level1.target || level5.disabledButtons.length >= level1.disabledButtons.length) {
    console.log('PASS: Difficulty scales with level.');
} else {
    console.log('FAIL: Difficulty does not scale.');
}

// 3. Batch Verification
console.log('\n[3/3] Batch Solvability Check (10 puzzles)...');
let allSolvable = true;
for (let i = 0; i < 10; i++) {
    const p = Generator.generate(3);
    const solvable = Solver.canSolve(p.target, p.availableNumbers, ['+', '-', '*', '/'], 5);
    if (!solvable) {
        console.log(`FAIL: Puzzle ${i} (Target ${p.target}) reported unsolvable.`);
        allSolvable = false;
    }
}
if (allSolvable) console.log('PASS: All generated puzzles are solvable.');

console.log('\n--- 🏁 TEST SUITE COMPLETE ---');
