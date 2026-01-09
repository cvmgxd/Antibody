import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import './Home.css';

function Home({ onJoin }) {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            onJoin(nickname.trim());
        }
    };

    return (
        <div className="home-container">
            <Motion.div
                className="home-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="home-header">
                    <div className="logo-container">
                        <Motion.div
                            className="logo-icon"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                        >
                            🧪
                        </Motion.div>
                        <h1 className="home-title">ANTIBODY</h1>
                    </div>
                    <p className="home-tagline">Solve Before the Antibiotics Strike!</p>
                </header>

                <form className="join-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="nickname">IDENTIFY VIRUS</label>
                        <input
                            id="nickname"
                            className="nickname-input"
                            type="text"
                            placeholder="Enter Nickname..."
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={15}
                            autoFocus
                        />
                    </div>

                    <Motion.button
                        type="submit"
                        className="search-button join-button"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        SEARCH FOR HOST
                    </Motion.button>
                </form>

                <footer className="home-footer">
                    <p>Real-time PvP Arithmetic Puzzle Arena</p>
                </footer>
            </Motion.div>
        </div>
    );
}

export default Home;
