import React, { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import style from './GameView.module.css';

import WorldMap from '../../Game/Map/WorldMap/containers/WorldMap';

const GameView = (props) => {
  const [authCode, setAuthCode] = useState(null);
  const [cable, setCable] = useState(null);

  useEffect(() => {
    const newCable = createConsumer('ws://localhost:3000/cable');
    setCable(newCable);
    setAuthCode(props.auth);
  }, []);

  return (
    <div>
      <WorldMap
        cable={cable}
        authCode={authCode}
      />
    </div>
  );
};

export default GameView;
