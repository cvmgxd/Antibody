# Phase 2 Manifesto: Arithmetic Engine (Antibody)

**Immediate Objective**: Implement a server-side engine that generates solvable arithmetic puzzles and scales difficulty based on player proficiency.

## 🎯 Success Criteria
- [x] **PJ-SC-03**: `Solver.js` can determine if a target is reachable using a subset of buttons and basic operators (+, -, *, /) within 6 steps.
- [x] **PJ-SC-04**: `Generator.js` uses the Solver to guarantee "Unshakeable" solvability and adjusts complexity (target size, number of disabled buttons) based on a `level` parameter.

## 🚧 Phase Boundaries
- **IN SCOPE**:
    - `server/logic/Solver.js`
    - `server/logic/Generator.js`
    - Unit tests for arithmetic logic.
- **OUT OF SCOPE**:
    - Socket.io integration (Phase 3).
    - Frontend Keypad UI (Phase 4).
    - Database/History.

## 🛡️ Grounding
Refers to: [PROJECT_PLAN.md](file:///f:/MetaWave/antibody/PROJECT_PLAN.md)
Project State: PHASE_1_COMPLETE -> PHASE_2_IN_PROGRESS
Division Policy: **Integer Floors** (e.g., 5/2 = 2).
