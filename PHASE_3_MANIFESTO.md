# Phase 3 Manifesto: Real-time Core (Antibody)

**Immediate Objective**: Establish the real-time communication bridge using Socket.io and implement the Authority Manager for round synchronization.

## 🎯 Success Criteria
- [x] **PJ-SC-05**: Server emits a `round_start` event containing a solvable puzzle (target, level, disabled buttons) from the Phase 2 Generator.
- [x] **PJ-SC-06**: Client receives the payload and implements "Optimistic Evaluation" logic (pre-calculating arithmetic results locally for low-latency feel).

## 🚧 Phase Boundaries
- **IN SCOPE**:
    - `server/index.js` (Socket.io event handlers).
    - `client/src/socket.js` (Socket.io client instance).
    - `client/src/logic/OptimisticEngine.js` (Client-side mirror of Solver).
- **OUT OF SCOPE**:
    - Final UI design (Phase 4).
    - Detailed animations (Phase 5).
    - Anti-cheat "Judge" verification (Phase 5).

## 🛡️ Grounding
Refers to: [PROJECT_PLAN.md](file:///f:/MetaWave/antibody/PROJECT_PLAN.md)
Project State: PHASE_2_COMPLETE -> PHASE_3_IN_PROGRESS
Constraint: Server is the SOLE authority for disabled button sets.
