import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { socket } from './socket';
import Keypad from './components/Keypad';
import GameDisplay from './components/GameDisplay';
import './App.css';

function App() {
  const [roundData, setRoundData] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [expression, setExpression] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('join_game', { level: 3 });
    }
    function onDisconnect() { setIsConnected(false); }
    function onWaiting(data) { setIsWaiting(true); }
    function onRoundStart(data) {
      setRoundData(data);
      setExpression('');
      setTimeRemaining(30);
      setIsWaiting(false);
    }
    function onRoundResult(data) {
      if (data.success) {
        alert(`✅ Success! Result: ${data.result}\n${data.message}`);
      } else {
        alert(`❌ Failed! ${data.message}`);
      }
      socket.emit('join_game', { level: 3 });
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('waiting_for_opponent', onWaiting);
    socket.on('round_start', onRoundStart);
    socket.on('round_result', onRoundResult);
    socket.connect();
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('waiting_for_opponent', onWaiting);
      socket.off('round_start', onRoundStart);
      socket.off('round_result', onRoundResult);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleButtonClick = (value) => {
    if (value === 'CLEAR') setExpression('');
    else if (value === 'DEL') setExpression((prev) => prev.slice(0, -1));
    else if (value === 'SUBMIT') {
      if (expression) {
        socket.emit('submit_solution', {
          expression: expression,
          roundId: roundData?.roundId
        });
      }
    } else setExpression((prev) => prev + value);
  };

  if (!isConnected) return <div className="app-container"><div className="connection-status"><motion.h1 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>🔴 Connecting...</motion.h1></div></div>;
  if (isWaiting) return <div className="app-container"><header className="app-header"><h1 className="app-title">🧪 ANTIBODY</h1><p className="app-subtitle">Searching for a suitable host...</p></header><main className="game-container"><div className="connection-status waiting"><motion.div className="loading-spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} /><h2>VIRUS DETECTED: SEARCHING...</h2><p>Wait for a 2nd player to enter the bloodstream.</p></div></main></div>;
  if (!roundData) return <div className="app-container"><div className="connection-status"><h1>🟢 Connected</h1><p>Analyzing biometrics...</p></div></div>;

  return (<div className="app-container"><header className="app-header"><h1 className="app-title">🧪 ANTIBODY</h1><p className="app-subtitle">Solve Before the Antibiotics Strike!</p></header><main className="game-container"><GameDisplay target={roundData.target} expression={expression} timeRemaining={timeRemaining} roundId={roundData.roundId} /><Keypad disabledButtons={roundData.disabledButtons} onButtonClick={handleButtonClick} /><div className="instructions"><p>{roundData.instructions}</p></div></main></div>);
}
export default App;
