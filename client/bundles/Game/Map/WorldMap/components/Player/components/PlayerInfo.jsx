// PlayerInfo.js
import React from 'react';
import './PlayerInfo.scss';

function PlayerInfo({ x, y, currentHealth, maxHealth }) {
  const percentage = (currentHealth / maxHealth) * 100;
  return (
    <div className="life-bar" style={{ top: y - 10, left: x - 20 }}>
      <div className="health" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}

export default PlayerInfo;
