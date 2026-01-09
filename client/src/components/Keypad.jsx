import React from 'react';
import { motion as Motion } from 'framer-motion';
import './Keypad.css';

const Keypad = ({ disabledButtons = [], onButtonClick, displayValue = '' }) => {
    const renderButton = (val, customClass = '') => {
        const isNumber = /^\d+$/.test(val);
        const isOperator = /^[+\-*/]$/.test(val);
        const isDisabled = disabledButtons.includes(val);

        return (
            <Motion.button
                key={val}
                className={`keypad-button ${isNumber ? 'number' : ''} ${isOperator ? 'operator' : ''} ${customClass} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && onButtonClick(val)}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                animate={isDisabled && !['SUBMIT', 'CLEAR', 'DEL'].includes(val) ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                {val}
                {isDisabled && <span className="disabled-overlay">✕</span>}
            </Motion.button>
        );
    };

    return (
        <div className="keypad">
            <div className="keypad-display">
                {displayValue || '0'}
            </div>
            {['7', '8', '9', '/'].map(val => renderButton(val))}
            {['4', '5', '6', '*'].map(val => renderButton(val))}
            {['1', '2', '3', '-'].map(val => renderButton(val))}
            {['0', '+'].map(val => renderButton(val))}
            <div style={{ gridColumn: 'span 2' }}></div>
            {renderButton('DEL', 'action-del')}
            {renderButton('CLEAR', 'action-clear')}
            {renderButton('SUBMIT', 'action-submit')}
        </div>
    );
};

export default Keypad;
