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
    origin: "http://localhost:5173",
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
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      // Pair with waiting player
      const roomId = `room-${Date.now()}`;
      const level = data.level || 3;
      const puzzle = Generator.generate(level);

      waitingPlayer.join(roomId);
      socket.join(roomId);

      rooms.set(roomId, {
        puzzle,
        players: [waitingPlayer.id, socket.id],
        active: true
      });

      io.to(roomId).emit('round_start', {
        target: puzzle.target,
        disabledButtons: puzzle.disabledButtons,
        roundId: roomId,
        instructions: "Match Found! Solve it before your opponent."
      });

      waitingPlayer = null;
    } else {
      // Wait for player
      waitingPlayer = socket;
      socket.emit('waiting_for_opponent', { message: "Searching for a virus to fight..." });
    }
  });

  socket.on('submit_solution', (data) => {
    const { expression, roundId } = data;
    const room = rooms.get(roundId);

    if (!room || !room.active) return;

    try {
      const result = evaluateExpression(expression);

      if (result === room.puzzle.target) {
        room.active = false;

        // Winner gets success, loser gets fail
        socket.emit('round_result', {
          success: true,
          result: result,
          message: "VICTORY! You were faster than the host."
        });

        socket.to(roundId).emit('round_result', {
          success: false,
          message: "DEFEAT! Your opponent solved the puzzle first."
        });
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Antibody Orchestrator running on port ${PORT}`);
});
