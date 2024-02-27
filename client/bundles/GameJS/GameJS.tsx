import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './GameJS.scss';

import GameInstance from './store/GameInit';
import GameCanvas from './GameCanvas/GameCanvas';

import PlayerInfos from './PlayerInfos/container/PlayerInfos';
import Notifications from './Notifications/Notifications';
import TextNotification from './Notifications/TextNotification';
import GameChat from './GameChat/container/GameChat';

const GameJS = (props) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializedAll, setIsInitializedAll] = useState(false);
  const allSystemsInitialized = useRef(isInitializedAll);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const disableRightClick = (e) => {
    e.preventDefault();
  };

  const disableDefaultArrows = (e) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
  };

  function handleResize() {
    if (allSystemsInitialized.current) {
      GameInstance.init.renderSystem[0].RisizedWindow();
      GameInstance.init.renderSystem[1].RisizedWindow();
    }

    setWindowSize({
      width: window.innerWidth - 200,
      height: window.innerHeight - 200,
    });
  }

  useEffect(() => {
    allSystemsInitialized.current = isInitializedAll;
    handleResize();
  }, [isInitializedAll])

  useEffect(() => {
    GameInstance.Start(props.auth, setIsInitializedAll);
    setIsInitialized(true);

    window.addEventListener('contextmenu', disableRightClick);
    window.addEventListener('keydown', disableDefaultArrows);
    return () => {
      window.removeEventListener('contextmenu', disableRightClick);
      window.removeEventListener('keydown', disableDefaultArrows);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="GameArea" style={{ width: windowSize.width }}>
        <GameCanvas isInitializedAll={isInitializedAll} setIsInitializedAll={setIsInitializedAll} gameSize={windowSize} />
        { isInitializedAll && <GameChat /> }
      </div>

      { isInitializedAll && <PlayerInfos /> }
      <div className="notifications-content">
        { isInitializedAll && <Notifications /> }
      </div>

      { isInitializedAll && <TextNotification /> }
    </DndProvider>
  );
};

export default GameJS;
