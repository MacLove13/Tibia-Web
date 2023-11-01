import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './GameJS.scss';

import PlayerInfos from './PlayerInfos/container/PlayerInfos';
import Notifications from './Notifications/Notifications';
import Game from './store/GameInit';

const GameJS = (props) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializedAll, setIsInitializedAll] = useState(false);
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
    gameInstance.Start(props.auth);
    setIsInitialized(true);

    setTimeout(() => {
      setIsInitializedAll(true);
    }, 3000);

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
    <DndProvider backend={HTML5Backend}>
      <div id="GameArea">
        <canvas id="GameCanvas" className="game-canvas" width="800" height="600" ref={canvasRef} />
        <input type="text" id="ChatInput" className="chat-input" onChange={changeInputText} value={inputText} />
      </div>

      { isInitializedAll && <PlayerInfos /> }
      <div className="notifications-content">
        <Notifications />
      </div>
    </DndProvider>
  );
};

export default GameJS;
