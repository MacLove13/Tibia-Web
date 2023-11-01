import React, { useState, useEffect, useRef } from 'react';
import './GameJS.scss';

import PlayerInfos from './PlayerInfos/container/PlayerInfos';
import Notifications from './Notifications/Notifications';
import Game from './store/GameInit';

const GameJS = (props) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputText, setInputText] = useState("");
  var timerCanvas = null;
  var gameInstance = new Game();

  const canvasRef = useRef(null);

  const changeInputText = (e) => {
    setInputText(e.value)
  };

  const disableRightClick = (e) => {
    e.preventDefault();
  };

  const disableDefaultArrows = (e) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    gameInstance.Start();
    setIsInitialized(true);

    window.addEventListener('contextmenu', disableRightClick);
    window.addEventListener('keydown', disableDefaultArrows);
    return () => {
      window.removeEventListener('contextmenu', disableRightClick);
      window.removeEventListener('keydown', disableDefaultArrows);
    }
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <>
      <div id="GameArea">
        <canvas id="GameCanvas" className="game-canvas" width="800" height="600" ref={canvasRef} />
        <input type="text" id="ChatInput" className="chat-input" onChange={changeInputText} value={inputText} />
      </div>

      <PlayerInfos />
      <div className="notifications-content">
        <Notifications />
      </div>
    </>
  );
};

export default GameJS;
