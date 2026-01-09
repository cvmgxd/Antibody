const io = require('socket.io-client');

const socket = io('http://localhost:3001');

console.log('🤖 Drone-X initiating...');

socket.on('connect', () => {
    console.log('✅ Drone Connected');
    socket.emit('join_game', { nickname: 'Drone-X', level: 3 });
});

socket.on('waiting_for_opponent', () => {
    console.log('⏳ Drone waiting...');
});

socket.on('round_start', (data) => {
    console.log('⚔️ MATCH STARTED!');
    console.log(`Target: ${data.target}`);

    // Simulate thinking time then answering (or just idling to test timeout)
    // setTimeout(() => {
    //    socket.emit('submit_solution', { expression: '1+1', roundId: data.roundId });
    // }, 5000);
});

socket.on('round_result', (data) => {
    console.log(`🏁 Round Result: ${data.message}`);
    if (data.gameOver) {
        console.log('💀 Game Over');
        process.exit(0);
    }
});
