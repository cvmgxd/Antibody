# 🧪 Antibody

A real-time PvP arithmetic puzzle game where players race to solve math challenges before antibiotics destroy their bacteria colony.

## 🎮 Project Status

**Phase 8 (Core Gameplay Completion) - COMPLETED** ✅

All core gameplay mechanics implemented including:
- Dynamic difficulty scaling with lost operators
- Asymmetric catch-up mechanics for balanced gameplay
- Shared targets with unique puzzle constraints per player
- Full real-time synchronization via WebSockets
- Polished UI with animations and audio feedback

## ✨ Features

- **Real-time PvP**: Instant multiplayer battles using Socket.io
- **Smart Puzzle Generation**: Guaranteed solvable puzzles with reachability verification
- **Dynamic Difficulty**: Puzzles adapt based on player performance and health差
- **Optimistic UI**: Zero-latency client-side evaluation with server validation
- **Rich Feedback**: Framer Motion animations and audio cues for engaging gameplay

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite) + Framer Motion
- **Backend**: Node.js (Express) + Socket.io
- **Real-time**: WebSockets for instant game synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:3000`

### Client
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`

Visit `http://localhost:5173` to start playing!

## 📚 Documentation

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Technical architecture and design
- [PROJECT_PHASES.md](PROJECT_PHASES.md) - Development roadmap
- [PHASE_*_MANIFESTO.md](PHASE_1_MANIFESTO.md) - Detailed phase documentation

## 🎯 Game Mechanics

Players compete to solve arithmetic puzzles using a calculator keypad where certain buttons may be disabled. The first player to reach the target number wins the round. Health decreases over time, and the game ends when one player's health reaches zero.

## 📄 License

MIT
