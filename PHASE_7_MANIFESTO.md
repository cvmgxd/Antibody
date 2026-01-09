# Phase 7: UI Overhaul & Identity - Manifesto

## 🎯 Objective
Transform the Antibody game into a polished, branded experience with a unique identity and a high-fidelity UI that matches the project mockup.

## 🏗️ Technical Requirements

### 1. Identity System
- **Nickname Capture**: The game must start with a Home page that requires a nickname.
- **Persistence**: Store the nickname in the frontend state for the duration of the session.
- **Protocol Update**: Include the nickname in `join_game` socket events.

### 2. Layout & Transitions
- **View Management**: Use a state machine in `App.jsx` to transition between `HOME`, `SEARCHING`, and `BATTLE`.
- **Responsive Split**: The Battle Arena must feel like a competitive heads-up display.

### 3. Visual Overhaul (Mockup Alignment)
- **Central Target Card**: Must display the target, current expression, and timer in a distinct, dark-themed container with a red glowing boundary.
- **Health-Status Bars**: Implement two progress bars at the top (Green/Red) representing player status.
- **Keypad Refresh**: Update styles to match the rounded, flat-design buttons in the mockup.

## ✅ Success Criteria

- **[PJ-SC-13]**: A dedicated Home Page component exists where users MUST enter a nickname before searching for a match.
- **[PJ-SC-14]**: The Battle Arena UI features a central card matching the mockup's layout (Target, Expression, Timer, Warning).
- **[PJ-SC-15]**: The "Health-Status" bars are visible and correctly placed at the top of the interface.
- **[PJ-SC-16]**: Multi-tab test confirms that two players see their own nickname and their opponent's (implied or explicit) status.

## 🛠️ Specialist Handoffs
- **Architect**: (DONE) Manifesto defined.
- **Developer**: Proceed to implementation of Home page and components.
- **Auditor**: Verify UI alignment with `mockup.jpg`.
