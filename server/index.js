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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Simple Matchmaker Mock: Create a round on join
  socket.on('join_game', (data) => {
    const level = data.level || 1;
    const puzzle = Generator.generate(level);

    socket.emit('round_start', {
      target: puzzle.target,
      disabledButtons: puzzle.disabledButtons,
      roundId: `R-${Date.now()}`,
      instructions: "Solve it fast! Antibiotics are coming."
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Antibody Orchestrator running on port ${PORT}`);
});
