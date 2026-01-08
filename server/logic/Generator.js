/**
 * Generator.js
 * Generates "Unshakeable" puzzles with scaling complexity.
 */
const Solver = require('./Solver');

class Generator {
    static generate(level = 1) {
        // Difficulty Tuning
        // Level 1: Small targets, few disabled buttons.
        // Level 5: Large targets, many disabled buttons.
        const targetRange = 10 + (level * 20); // Level 1: 30, Level 5: 110
        const disabledCount = Math.min(level, 4); // Disable up to 4 numbers

        const allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const allOps = ['+', '-', '*', '/'];

        let puzzle = null;
        let attempts = 0;

        while (!puzzle && attempts < 100) {
            attempts++;

            // Pick numbers to disable
            const shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
            const disabledNumbers = shuffled.slice(0, disabledCount);
            const availableNumbers = allNumbers.filter(n => !disabledNumbers.includes(n));

            // Pick a random target
            const target = Math.floor(Math.random() * targetRange) + 5;

            // Verify solvability
            if (Solver.canSolve(target, availableNumbers, allOps, 5)) {
                puzzle = {
                    target,
                    disabledButtons: disabledNumbers.map(String),
                    level,
                    availableNumbers
                };
            }
        }

        return puzzle || this.generate(1); // Fallback to level 1 for safety
    }
}

module.exports = Generator;
