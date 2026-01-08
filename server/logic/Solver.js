/**
 * Solver.js
 * Specialist in verifying arithmetic reachability.
 */

class Solver {
    /**
     * @param {number} target - The goal number.
     * @param {number[]} allowedNumbers - 0-9 digits that are NOT disabled.
     * @param {string[]} allowedOps - ['+', '-', '*', '/'] that are NOT disabled.
     * @param {number} maxSteps - Depth limit for the search (default 6).
     */
    static canSolve(target, allowedNumbers, allowedOps, maxSteps = 6) {
        if (allowedNumbers.length === 0) return false;

        // Queue: { currentVal, steps, path }
        // We start with each allowed single digit as a potential starting value.
        const queue = allowedNumbers.map(n => ({ val: n, steps: 0 }));
        const visited = new Set(allowedNumbers);

        while (queue.length > 0) {
            const { val, steps } = queue.shift();

            if (val === target) return true;
            if (steps >= maxSteps) continue;

            for (const op of allowedOps) {
                for (const nextDigit of allowedNumbers) {
                    let nextVal;

                    switch (op) {
                        case '+': nextVal = val + nextDigit; break;
                        case '-': nextVal = val - nextDigit; break;
                        case '*': nextVal = val * nextDigit; break;
                        case '/':
                            if (nextDigit === 0) continue;
                            nextVal = Math.floor(val / nextDigit); // Integer Floor Policy
                            break;
                    }

                    // Only continue if we haven't reached this value at this or fewers steps
                    // and it's within a reasonable range to prevent overflow/useless paths
                    if (!visited.has(nextVal) && nextVal >= -1000 && nextVal <= 1000) {
                        visited.add(nextVal);
                        queue.push({ val: nextVal, steps: steps + 1 });
                    }
                }
            }
        }

        return false;
    }
}

module.exports = Solver;
