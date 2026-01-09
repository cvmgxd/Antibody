/**
 * Generator.js
 * Generates "Unshakeable" puzzles with scaling complexity.
 */
const Solver = require('./Solver');

class Generator {
    static generate(level = 1) {
        return this.generateForTarget(null, level);
    }

    static generateForTarget(forcedTarget, level = 1) {
        // Difficulty Tuning
        // Level 1: Beginner (Add/Sub only, Range 10)
        // Level 3: Normal (Mul, Range 30)
        // Level 5: Expert (All Ops, Range 100)

        let targetRange = 10;
        let disabledCount = 0;
        let ops = ['+', '-'];
        const allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        if (level >= 2) {
            targetRange = 20;
            disabledCount = 1;
        }
        if (level >= 3) {
            targetRange = 50;
            disabledCount = 2;
            ops.push('*');
        }
        if (level >= 4) {
            targetRange = 80;
            disabledCount = 3;
        }
        if (level >= 5) {
            targetRange = 100;
            disabledCount = 4;
            ops.push('/');
        }

        // SMART HANDICAP: If target is forced and high, ensure we have the tools (operators)
        // regardless of the player's handicap level.
        if (forcedTarget !== null && forcedTarget > 20 && !ops.includes('*')) {
            ops.push('*');
        }

        // Feature: "Lost Operators" (Level 4+)
        const disabledOps = [];
        if (level >= 4) {
            const opIndex = Math.floor(Math.random() * ops.length);
            const removedOp = ops[opIndex];
            disabledOps.push(removedOp);
            ops.splice(opIndex, 1);
        }

        let puzzle = null;
        let attempts = 0;

        while (!puzzle && attempts < 100) {
            attempts++;

            // Pick numbers to disable
            const shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
            const disabledNumbers = shuffled.slice(0, disabledCount);
            const availableNumbers = allNumbers.filter(n => !disabledNumbers.includes(n));

            // Pick a random target if not forced
            const target = forcedTarget !== null ? forcedTarget : (Math.floor(Math.random() * targetRange) + 5);

            // Verify solvability
            if (Solver.canSolve(target, availableNumbers, ops, 5)) {
                puzzle = {
                    target,
                    disabledButtons: [...disabledNumbers.map(String), ...disabledOps],
                    level,
                    availableNumbers
                };
            }
        }

        return puzzle || (forcedTarget ? null : this.generate(1)); // Null if forced target impossible
    }
}

module.exports = Generator;
