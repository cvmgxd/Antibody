# Phase 6: Multiplayer Scaling

**Immediate Objective**: Transition from independent rounds to true room-based PvP matchmaking where players compete on the same puzzle.

## 🎯 Success Criteria
- [ ] **PJ-SC-11**: Two players are successfully paired into a Socket.io room.
- [ ] **PJ-SC-12**: First player to submit a correct expression wins the round for both players.

## 🚧 Phase Boundaries
- **IN SCOPE**:
  - Matchmaking queue (Wait for 2nd player)
  - Shared `round_start` emission to both players in a room
  - Winner/Loser announcement synchronization
  - Round transition for both players simultaneously
  
- **OUT OF SCOPE**:
  - Persistent User Accounts
  - Global Leaderboards
  - Spectator Mode

## 🏗️ Implementation Plan

### 1. Matchmaking Logic (Server)
- Update `server/index.js` to manage a `waitingPlayer` variable.
- On `join_game`:
  - If `waitingPlayer` exists:
    - Create a unique `roomId`
    - Add both sockets to the room
    - Generate ONE puzzle for the room
    - Emit `round_start` to `io.to(roomId)`
    - Clear `waitingPlayer`
  - Else:
    - Set `waitingPlayer = socket`
    - Emit `waiting_for_opponent` to the socket

### 2. Race Condition Handling (Server)
- Track `roundActive` status per room.
- On `submit_solution`:
  - Verify result as before.
  - If correct AND `roundActive` is true:
    - Set `roundActive = false`
    - Emit `round_result` to the winner: `{ success: true, message: "Victory! You were faster." }`
    - Emit `round_result` to the loser: `{ success: false, message: "Defeat! Opponent solved it first." }`

### 3. UI Synchronization (Client)
- Update `App.jsx` to show "Waiting for opponent..." state.
- Handle `round_result` to show definitive Win/Loss screens.

## 🧪 Verification Commands

### Multi-Window Test
1. Start server and client.
2. Open **Window A** (http://localhost:5173). Expect: "Waiting for opponent...".
3. Open **Window B** (http://localhost:5173). Expect: Both windows simultaneously receive `round_start`.
4. Solve in **Window A**. Expect: Window A wins, Window B loses.
