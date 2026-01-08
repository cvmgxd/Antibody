# Antibody: Real-Time PvP Arithmetic Puzzle Game

## Vision
A competitive multiplayer game where players race against each other to solve arithmetic puzzles before their bacteria colony is destroyed by antibiotics.

## Core Mechanics
- **PvP Competition**: Two players compete in real-time
- **Arithmetic Challenges**: Reach target numbers using basic operations (+, -, *, /)
- **Dynamic Difficulty**: Puzzles scale based on player performance
- **Server Authority**: All game state managed server-side for fairness

## Technical Architecture

### Frontend
- React (Vite) for fast development and HMR
- Socket.io-client for real-time communication
- Optimistic UI for instant feedback

### Backend
- Node.js with Express
- Socket.io for WebSocket management
- Arithmetic engine with reachability solver
- Puzzle generator with difficulty scaling

## Game Rules

### Integer Floor Division
- Division always returns floor: `5 / 2 = 2`
- Server is the single source of truth

### Dynamic Difficulty Scaling
- Puzzles adapt based on win-streaks
- Harder targets and more disabled buttons for winning players

### Thematic Pressure
- Timer countdown with visual/audio feedback
- Pulsating UI and heartbeat SFX at < 5s remaining

## Development Phases

1. **Foundation & Scaffolding** ✅
2. **Arithmetic Engine** ✅
3. **Real-time Core** ✅
4. **The Battle Arena** (In Progress)
5. **Juice & Anti-Cheat**

## Success Criteria

- [x] Solvable puzzle generation
- [x] Server-side reachability validation
- [x] Real-time Socket.io synchronization
- [ ] Complete UI with thematic pressure
- [ ] Anti-cheat server validation
