import { useEffect, useState } from 'react';
import { socket } from './socket';

function App() {
  const [roundData, setRoundData] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Connected to server");
      // Join game to trigger a round
      socket.emit('join_game', { level: 3 });
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRoundStart(data) {
      console.log("Round Started:", data);
      setRoundData(data);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('round_start', onRoundStart);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('round_start', onRoundStart);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Antibody Phase 3 Test</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>

      {roundData ? (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
          <h3>Round Details:</h3>
          <p>Target: <strong>{roundData.target}</strong></p>
          <p>Disabled Buttons: {roundData.disabledButtons.join(', ')}</p>
          <p>ID: {roundData.roundId}</p>
          <small>{roundData.instructions}</small>
        </div>
      ) : (
        <p>Waiting for round...</p>
      )}
    </div>
  );
}

export default App;
