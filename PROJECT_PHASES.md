# Project Phases: Antibody

| Phase | Description | Status | Success Criteria |
|-------|-------------|--------|------------------|
| 1 | **Foundation & Scaffolding**: Setup React (Vite) and Node.js (Express) basics. | DONE | [PJ-SC-01] Frontend/Backend directories exist; [PJ-SC-02] Basic `npm install` runs. |
| 2 | **Arithmetic Engine**: Implement `PuzzleGenerator` with **Scaling** and **Reachability Solver**. | DONE | [PJ-SC-03] `Solver` validates reachability; [PJ-SC-04] Complexity level affects generator output. |
| 3 | **Real-time Core**: Socket.io handshake, Authority Manager, and **Optimistic Client Sync**. | DONE | [PJ-SC-05] `round_start` payload emitted; [PJ-SC-06] Client performs instant arithmetic evaluation. |
| 4 | **The Battle Arena**: Build the UI Keypad, Target Display, and **Thematic Pressure** feedback. | DONE | [PJ-SC-07] Keypad disables via server payload; [PJ-SC-08] Pulsating timer UI triggers at < 5s. |
| 5 | **Juice & Anti-Cheat**: Framer Motion animations and server-side Judge validation. | DONE | [PJ-SC-09] Button shake animations added; [PJ-SC-10] Server rejects invalid/illegal expressions. |
| 6 | **Multiplayer Scaling**: Room-based matchmaking and Shared Round State. | DONE | [PJ-SC-11] Players paired in rooms; [PJ-SC-12] Winners/Loosers determined by race condition. |
| 7 | **UI Overhaul & Identity**: Home Page, Nickname support, and Mockup-based UI redesign. | DONE | [PJ-SC-13] Home page with nickname input; [PJ-SC-14] Battle Arena matches mockup aesthetic. |

---

### Phase 2: Arithmetic Engine
**Architecture Alignment**: Hardens the "Problem Gen" and "Solver" components with Scaling.

**Context Requirements**:
| File Path | Purpose |
| :--- | :--- |
| `PROJECT_PLAN.md` | Roadmap reference |

**Success Criteria**:
| ID | Requirement | Verification Method |
| :--- | :--- | :--- |
| PJ-SC-03 | `Solver.verify()` returns true for solvable puzzles | Run unit test |
| PJ-SC-04 | Logic exists to increase target range based on `level` param | Grep code for complexity scaling |
