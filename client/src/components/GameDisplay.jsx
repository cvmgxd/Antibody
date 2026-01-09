import React from 'react';
import { motion as Motion } from 'framer-motion';
import './GameDisplay.css';

function GameDisplay({ target, timeRemaining, roundId }) {
    const isCritical = timeRemaining !== null && timeRemaining <= 5;

    return (
        <div className="game-display-wrapper">
            <Motion.div
                className="target-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={roundId}
            >
                <div className="card-header">BOARDID: {roundId?.split('-')[1] || '---'}</div>

                <section className="target-section">
                    <label>TARGET</label>
                    <div className="target-number">{target || '0'}</div>
                </section>

                <div className="timer-section">
                    <label>TIME REMAINING</label>
                    <div className={`timer-value ${isCritical ? 'timer-critical' : ''}`}>
                        {timeRemaining}S
                    </div>
                </div>

                {isCritical && (
                    <Motion.div
                        className="critical-warning"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        ⚠️ ANTIBIOTICS APPROACHING! ⚠️
                    </Motion.div>
                )}
            </Motion.div>
        </div>
    );
}

export default GameDisplay;
