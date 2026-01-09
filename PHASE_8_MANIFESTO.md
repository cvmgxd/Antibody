# Phase 8: Core Gameplay Completion - Manifesto

## 🎯 Objective
Finalize the "Antibody" Gameplay Loop. Ensure the server correctly generates math puzzles, handles "Infection" rates, and determines win/loss conditions accurately.

## 🏗️ Technical Requirements

### 1. Server-Side Logic
- **Puzzle Generation**: Implement proper difficulty scaling (Level 1-5).
- **Game State Management**: Ensure rooms correctly track health, rounds, and disconnects.
- **Antibiotics Mechanic**: Implement the "Time Pressure" logic (30s timer, -15 HP penalty).

### 2. Client-Side Polish
- **Audio Integration**: Add SFX for Keypress, Success, Fail, and Win/Lose.
- **Visual Feedback**: Enhance the "Damage" effect when health drops.

## ✅ Success Criteria
- **[PJ-SC-17]**: Antibiotics timer triggers at 30s and deducts health. (IMPLEMENTED)
- **[PJ-SC-18]**: Puzzle difficulty scales with player performance or round count. (PENDING)
- **[PJ-SC-19]**: Audio SFX play on key events (Start, Win, Lose). (PARTIAL)
- **[PJ-SC-20]**: Game Over state correctly handles "Draw" and "Win/Loss". (IMPLEMENTED)

## 🚧 Specialist Handoffs
- **Architect**: Plan Recovered.
- **Developer**: Resume implementation of Scaling and Audio.
