import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { socket } from './socket';
import Home from './components/Home';
import Keypad from './components/Keypad';
import GameDisplay from './components/GameDisplay';
import './App.css';

function App() {
  const [view, setView] = useState('home'); // 'home', 'searching', 'battle'
  const [nickname, setNickname] = useState('');
  const [roundData, setRoundData] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [expression, setExpression] = useState('');
  const [opponentExpression, setOpponentExpression] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [gameOver, setGameOver] = useState(null); // null, 'win', 'lose', 'draw'
  const [players, setPlayers] = useState([]);
  const [isDamaged, setIsDamaged] = useState(false);

  // Audio System
  const playSFX = (type) => {
    console.log(`🔊 AUDIO TRIGGER: ${type.toUpperCase()}`);
    if (['round_loss', 'game_over_lose', 'error', 'round_timeout'].includes(type)) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 500);
    }
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Connected to server");
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onWaiting(data) {
      console.log("Waiting for opponent:", data.message);
      setView('searching');
    }

    function onRoundStart(data) {
      console.log("Round Started:", data);
      playSFX('round_start');
      setRoundData(data);
      setPlayers(data.players || []);
      setExpression('');
      setOpponentExpression('');
      setTimeRemaining(30);
      setShowFooter(true);
      setView('battle');
      setGameOver(null);

      // Auto-fade footer after 5 seconds
      setTimeout(() => setShowFooter(false), 5000);
    }

    function onRoundResult(data) {
      console.log("Round Result:", data);
      setTimeRemaining(null);
      if (data.players) setPlayers(data.players);

      if (data.gameOver) {
        const me = data.players.find(p => p.id === socket.id);
        const opponent = data.players.find(p => p.id !== socket.id);

        if (me.health <= 0 && opponent.health <= 0) { setGameOver('draw'); playSFX('game_over_draw'); }
        else if (me.health <= 0) { setGameOver('lose'); playSFX('game_over_lose'); }
        else { setGameOver('win'); playSFX('game_over_win'); }

        setView('game_over');
      } else {
        if (data.success !== false) {
          if (data.winner === socket.id) playSFX('round_win');
          else if (data.timeout) playSFX('round_timeout');
          else playSFX('round_loss');
        } else {
          playSFX('error');
          alert(`❌ Failed! ${data.message}`);
        }
      }
    }

    function onOpponentUpdate(data) {
      setOpponentExpression(data.expression);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('waiting_for_opponent', onWaiting);
    socket.on('round_start', onRoundStart);
    socket.on('round_result', onRoundResult);
    socket.on('opponent_expression_update', onOpponentUpdate);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('waiting_for_opponent', onWaiting);
      socket.off('round_start', onRoundStart);
      socket.off('round_result', onRoundResult);
      socket.off('opponent_expression_update', onOpponentUpdate);
    };
  }, [nickname]);

  const handleJoin = (name) => {
    setNickname(name);
    socket.emit('join_game', { level: 3, nickname: name });
  };

  const handleButtonClick = (value) => {
    let newExpression = expression;
    if (value === 'CLEAR') {
      newExpression = '';
    } else if (value === 'DEL') {
      newExpression = expression.slice(0, -1);
    } else if (value === 'SUBMIT') {
      if (expression) {
        socket.emit('submit_solution', {
          expression: expression,
          roundId: roundData?.roundId
        });
      }
      return;
    } else {
      newExpression = expression + value;
    }

    setExpression(newExpression);
    socket.emit('update_expression', {
      expression: newExpression,
      roundId: roundData?.roundId
    });
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0 || view !== 'battle') return;

    if (timeRemaining === 0) {
      socket.emit('round_timeout', { roundId: roundData?.roundId });
      setTimeout(() => setTimeRemaining(-1), 0); // Async update to avoid cascading render warning
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, view, roundData?.roundId]);

  if (!isConnected) {
    return (
      <div className="app-container">
        <div className="connection-status">
          <Motion.h1
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            🔴 Connecting to Server...
          </Motion.h1>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    return <Home onJoin={handleJoin} />;
  }

  if (view === 'searching') {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">ANTIBODY</h1>
          <p className="app-subtitle">Searching for a suitable host...</p>
        </header>
        <main className="game-container">
          <div className="connection-status waiting">
            <Motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <h2>VIRUS DETECTED: {nickname.toUpperCase()} SEARCHING...</h2>
            <p>Wait for a 2nd player to enter the bloodstream.</p>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'game_over') {
    return (
      <div className="app-container battle-arena game-over">
        <div className="game-over-panel">
          <Motion.h1
            className="game-over-title"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {gameOver === 'win' ? 'SYSTEM SECURED' : gameOver === 'draw' ? 'MUTUAL DESTRUCTION' : 'SYSTEM BREACHED'}
          </Motion.h1>
          <div className="game-over-status">
            {gameOver === 'win' ? 'Victory Achieved' : gameOver === 'draw' ? 'Critical Error: No Survivors' : 'Defeat Imminent'}
          </div>
          <div className="game-over-actions">
            <button className="join-button" onClick={() => handleJoin(nickname)}>NEW GAME</button>
            <button className="join-button secondary" onClick={() => setView('home')}>EXIT TO HOME</button>
          </div>
        </div>
      </div>
    );
  }

  const me = players.find(p => p.id === socket.id) || { health: 100 };
  const opponent = players.find(p => p.id !== socket.id) || { health: 100 };

  return (
    <div className={`app-container battle-arena ${isDamaged ? 'damage-flash' : ''}`}>
      <div className="app-title-card">
        <h1 className="app-title">ANTIBODY</h1>
        <p className="app-subtitle">Solve Before the Antibiotics Strike!</p>
      </div>

      <main className="game-container">
        <div className="player-area">
          <div className="health-status-container">
            <div className="health-bar-group player1">
              <div className="health-label">HEALTH-STATUS</div>
              <div className="health-bar-bg">
                <Motion.div
                  className="health-bar-fill green"
                  initial={{ width: "100%" }}
                  animate={{ width: `${me.health}%` }}
                />
              </div>
            </div>
          </div>
          <Keypad
            disabledButtons={roundData?.disabledButtons}
            onButtonClick={handleButtonClick}
            displayValue={expression}
          />
          <div className="player-label">{nickname || 'PLAYER 1'}</div>
        </div>

        <GameDisplay
          target={roundData?.target}
          expression={expression}
          timeRemaining={timeRemaining}
          roundId={roundData?.roundId}
        />

        <div className="opponent-area">
          <div className="health-status-container">
            <div className="health-bar-group player2">
              <div className="health-label">HEALTH-STATUS</div>
              <div className="health-bar-bg">
                <Motion.div
                  className="health-bar-fill red"
                  initial={{ width: "100%" }}
                  animate={{ width: `${opponent.health}%` }}
                />
              </div>
            </div>
          </div>
          <Keypad
            disabledButtons={opponent?.puzzle?.disabledButtons || []}
            onButtonClick={() => { }}
            displayValue={opponentExpression || '0'}
          />
          <div className="player-label">{opponent?.nickname || 'PLAYER 2'}</div>
        </div>
      </main>

      <Motion.div
        className="footer-status"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showFooter ? 1 : 0, y: showFooter ? 0 : 50 }}
        transition={{ duration: 0.8 }}
      >
        <p>{roundData?.instructions || 'Match Found! Solve it before your opponent.'}</p>
      </Motion.div>
    </div>
  );
}

export default App;
