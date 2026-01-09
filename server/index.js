const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Generator = require('./logic/Generator');
const Solver = require('./logic/Solver');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ],
    methods: ["GET", "POST"]
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'unshakeable', component: 'antibody-orchestrator' });
});

let waitingPlayer = null;
const rooms = new Map(); // roomId -> { puzzle, players, active }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_game', (data) => {
    socket.nickname = data.nickname || `Virus-${socket.id.slice(0, 4)}`;

    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      // Pair with waiting player
      const roomId = `room-${Date.now()}`;
      const level = data.level || 3;
      console.log(`[DEBUG] Creating room ${roomId} with Level: ${level}`);

      // SHARED TARGET MECHANIC
      const masterPuzzle = Generator.generate(level);
      const roomTarget = masterPuzzle.target;

      let puzzleP1 = Generator.generateForTarget(roomTarget, level);
      let puzzleP2 = Generator.generateForTarget(roomTarget, level);

      if (!puzzleP1) puzzleP1 = masterPuzzle;
      if (!puzzleP2) puzzleP2 = masterPuzzle;

      waitingPlayer.join(roomId);
      socket.join(roomId);

      rooms.set(roomId, {
        level,
        players: [
          { id: waitingPlayer.id, nickname: waitingPlayer.nickname, health: 100, puzzle: puzzleP1 },
          { id: socket.id, nickname: socket.nickname, health: 100, puzzle: puzzleP2 }
        ],
        active: true,
        timer: null
      });

      const roomPlayers = rooms.get(roomId).players;
      roomPlayers.forEach(p => {
        io.to(p.id).emit('round_start', {
          target: p.puzzle.target,
          disabledButtons: p.puzzle.disabledButtons,
          level: level,
          roundId: roomId,
          players: roomPlayers.map(rp => ({
            ...rp,
            puzzle: { disabledButtons: rp.puzzle.disabledButtons }
          })),
          instructions: "Match Found! Solve it before your opponent."
        });
      });

      const roomRef = rooms.get(roomId);
      roomRef.timer = setTimeout(() => {
        handleTimeout(roomId, io);
      }, 30000);

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit('waiting_for_opponent', {
        message: "Searching for a virus to fight...",
        nickname: socket.nickname
      });
    }
  });

  socket.on('update_expression', (data) => {
    const { roundId, expression } = data;
    socket.to(roundId).emit('opponent_expression_update', {
      expression
    });
  });

  socket.on('submit_solution', (data) => {
    const { expression, roundId } = data;
    const room = rooms.get(roundId);

    if (!room || !room.active) return;

    try {
      const result = evaluateExpression(expression);
      const player = room.players.find(p => p.id === socket.id);

      if (result === player.puzzle.target) {
        const winnerIndex = room.players.findIndex(p => p.id === socket.id);
        const loserIndex = winnerIndex === 0 ? 1 : 0;

        room.players[loserIndex].health = Math.max(0, room.players[loserIndex].health - 20);

        const isGameOver = room.players[loserIndex].health <= 0;
        room.active = false;
        if (room.timer) clearTimeout(room.timer);

        const safePlayers = room.players.map(rp => ({ ...rp, puzzle: null }));

        io.to(roundId).emit('round_result', {
          winner: socket.id,
          expression,
          result,
          players: safePlayers,
          gameOver: isGameOver,
          message: isGameOver ? `PERMANENT SHUTDOWN: ${socket.nickname} Wins!` : `${socket.nickname} dealt 20 damage!`
        });

        if (!isGameOver) {
          startNextRound(roundId, io);
        }
      } else {
        socket.emit('round_result', {
          success: false,
          message: `Evaluation: ${result}. Not the target!`
        });
      }
    } catch (error) {
      socket.emit('round_result', {
        success: false,
        message: "Invalid Expression!"
      });
    }
  });

  socket.on('round_timeout', (data) => {
    const { roundId } = data;
    const room = rooms.get(roundId);
    if (!room || !room.active) return;

    room.players.forEach(p => {
      p.health = Math.max(0, p.health - 10);
    });

    const deadPlayer = room.players.find(p => p.health <= 0);
    const isGameOver = !!deadPlayer;
    room.active = !isGameOver;

    const safePlayers = room.players.map(rp => ({ ...rp, puzzle: null }));

    io.to(roundId).emit('round_result', {
      timeout: true,
      players: safePlayers,
      gameOver: isGameOver,
      message: isGameOver ? "SYSTEM CRITICAL: Both players took lethal damage!" : "TIMEOUT: Both players took 10 damage!"
    });

    if (!isGameOver) {
      setTimeout(() => {
        const nextLevel = Math.min(5, (room.level || 1) + 1);
        room.level = nextLevel;

        room.players.forEach(p => {
          const opponent = room.players.find(op => op.id !== p.id);
          let playerLevel = nextLevel;

          if (p.health < opponent.health - 20) {
            playerLevel = Math.max(1, nextLevel - 1);
          }
          p.puzzle = Generator.generate(playerLevel);
        });

        room.active = true;

        room.players.forEach(p => {
          io.to(p.id).emit('round_start', {
            target: p.puzzle.target,
            disabledButtons: p.puzzle.disabledButtons,
            level: nextLevel,
            roundId,
            players: room.players.map(rp => ({ ...rp, puzzle: null })),
            instructions: `Phase Increased: Level ${nextLevel}. Eliminate the target.`
          });
        });

        room.timer = setTimeout(() => {
          handleTimeout(roomId, io);
        }, 30000);

      }, 3000);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
  });
});

function evaluateExpression(expr) {
  expr = expr.replace(/\s+/g, '');
  if (!/^[\d+\-*/]+$/.test(expr)) {
    throw new Error('Invalid characters in expression');
  }
  const tokens = expr.match(/\d+|[+\-*/]/g);
  if (!tokens) throw new Error('Invalid expression');

  let result = parseInt(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = parseInt(tokens[i + 1]);

    switch (operator) {
      case '+': result += operand; break;
      case '-': result -= operand; break;
      case '*': result *= operand; break;
      case '/':
        if (operand === 0) throw new Error('Division by zero');
        result = Math.floor(result / operand);
        break;
      default: throw new Error('Invalid operator');
    }
  }
  return result;
}

function handleTimeout(roomId, io) {
  const room = rooms.get(roomId);
  if (!room || !room.active) return;

  room.players.forEach(p => {
    p.health = Math.max(0, p.health - 15);
  });

  const isGameOver = room.players.some(p => p.health <= 0);
  room.active = !isGameOver;

  const safePlayers = room.players.map(rp => ({ ...rp, puzzle: null }));

  io.to(roomId).emit('round_result', {
    timeout: true,
    players: safePlayers,
    gameOver: isGameOver,
    message: isGameOver ? "SYSTEM CRITICAL: Antibiotics purged the system!" : "ANTIBIOTICS STRIKE: -15 Health!"
  });

  if (!isGameOver) {
    startNextRound(roomId, io);
  }
}

function startNextRound(roomId, io) {
  const room = rooms.get(roomId);
  if (!room) return;
  setTimeout(() => {
    const nextLevel = Math.min(5, (room.level || 1) + 1);
    room.level = nextLevel;

    const masterPuzzle = Generator.generate(nextLevel);
    const roomTarget = masterPuzzle.target;

    room.players.forEach(p => {
      const opponent = room.players.find(op => op.id !== p.id);
      let playerLevel = nextLevel;

      if (p.health < opponent.health - 20) {
        playerLevel = Math.max(1, nextLevel - 1);
      }
      else if (p.health > opponent.health + 20) {
        playerLevel = Math.min(5, nextLevel + 1);
      }

      let playerPuzzle = Generator.generateForTarget(roomTarget, playerLevel);

      if (!playerPuzzle) {
        playerPuzzle = Generator.generate(playerLevel);
      }

      p.puzzle = playerPuzzle;
    });

    room.active = true;

    room.players.forEach(p => {
      io.to(p.id).emit('round_start', {
        target: p.puzzle.target,
        disabledButtons: p.puzzle.disabledButtons,
        level: nextLevel,
        roundId: roomId,
        players: room.players.map(rp => ({
          ...rp,
          puzzle: { disabledButtons: rp.puzzle.disabledButtons }
        })),
        instructions: `Phase Increased: Level ${nextLevel}. Eliminate the target.`
      });
    });

    room.timer = setTimeout(() => {
      handleTimeout(roomId, io);
    }, 30000);

  }, 3000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Antibody Orchestrator running on port ${PORT}`);
});
