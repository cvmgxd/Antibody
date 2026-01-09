# 🧪 Project: Antibody

**Mission**: A high-stakes, real-time PvP calculator game where players compete to solve arithmetic puzzles under button-functional constraints.

---

## 🛠️ Tech Stack (LOCKED)
- **Frontend**: React 18 (Vite) + Tailwind CSS + Framer Motion (for micro-animations/Juice).
- **Backend**: Node.js + Express.
- **Real-time**: Socket.io (Universal Event Bus).
- **Storage**: In-memory (Socket.io rooms/State management).
- **Communication PROTOCOL**: JSON-over-WebSockets.

---

## 🏗️ Component Architecture

### 1. 🖥️ The Client (Front-end)
- **Join View**: Nickname selection and "Find Match" queue.
- **Battle Arena**:
    - **Target Display**: The "Antibody" target number.
    - **Keypad**: 0-9, +, -, *, /, DEL, CLEAR. 
    - **Optimistic Execution**: Client evaluates math results locally and instantly for zero-latency feel. Any server-side "Judge" disagreement triggers a "Network Sync Error" animation.
    - **Visual Feedback ("Juice")**: 
        - Framer Motion animations for button disabling (shake + red X).
        - **Thematic Pressure**: Pulsating red UI border and speeding "Heartbeat" SFX as timer nears zero.
    - **Sync Handler**: Listens for `round_start` events to update local keypad state.

### 2. 🔌 The Orchestrator (Back-end)
- **Matchmaker**: Pairs players into Socket "Rooms".
- **Unshakeable Problem Generator**: 
    - **Reachability Guarantee**: Uses a recursive solver to verify that the target is reachable using ONLY the enabled buttons within 3-6 steps.
    - **Dynamic Difficulty Scaling**: Increases puzzle complexity (larger targets, more disabled buttons) based on the room's average win rate.
    - **Division Policy**: All division operations (`/`) result in **Integer Floors**. Example: `5 / 2 = 2`.
- **Authority Manager**: Emits the `round_start` payload containing `target_number`, `disabled_buttons`, and `round_id`.
- **Judge**: Validates incoming math expressions. Re-evaluates on server to prevent and override client-side answer injection.


### 3. 🗺️ Dependency Map
`React UI` --> `Socket.io-Client` --> `Node.js Room Manager` --> `Problem Gen (Solver)` --> `Judge`

---

## 🔒 Security & Safety Model
- **Server Authority**: The server is the SOLE source of truth for which buttons are enabled. 
- **Anti-Injection**: Clients send the "expression" (e.g., `5 * 8 + 2`). The server evaluates it independently.
- **Timer Sync**: Server-side timer to prevent client-side "time-freeze" hacks.

---

## 🚀 Phase 0: Initialization Priorities
- [x] Scaffold React (Frontend) and Express (Backend).
- [x] Implement the `Solver` for reachability verification.
- [x] Implement `Optimistic Evaluation` on the client.
- [x] Setup Socket.io handshake and Room management.
- [x] Create `PROJECT_STATE.json` to track execution.

---

![Antibody UI Mockup](client/src/assets/mockup.jpg)
