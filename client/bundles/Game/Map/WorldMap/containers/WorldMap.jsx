import React, { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';

import './WorldMap.css';

import GameCanvas from '../components/GameCanvas/GameCanvas';

function WorldMap({  }) {
  const [cable, setCable] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const [player, setPlayer] = useState({ x: 0, y: 0 });  // posição inicial do jogador
  const [map, setMap] = useState({
    tiles: [
      { x: 0, y: 0, walkable: true, tileType: 'grass' },
      { x: 0, y: 1, walkable: true, tileType: 'grass' },
      { x: 0, y: 2, walkable: true, tileType: 'grass' },
      { x: 0, y: 3, walkable: true, tileType: 'grass' },
      { x: 0, y: 4, walkable: true, tileType: 'grass' },
      { x: 0, y: 5, walkable: true, tileType: 'grass' },
      { x: 1, y: 0, walkable: true, tileType: 'grass' },
      { x: 1, y: 1, walkable: true, tileType: 'grass' },
      { x: 1, y: 2, walkable: true, tileType: 'grass' },
      { x: 1, y: 3, walkable: true, tileType: 'grass' },
      { x: 1, y: 4, walkable: true, tileType: 'grass' },
      { x: 1, y: 5, walkable: true, tileType: 'grass' },
      { x: 2, y: 2, walkable: true, tileType: 'grass' },
      { x: 3, y: 3, walkable: true, tileType: 'grass' },
      { x: 5, y: 2, walkable: false, tileType: 'water' },
    ],
    // ... outras propriedades do mapa aqui
  });

  const handleReceived = (data) => {
    if (data.action === 'move') {
      console.log('move atualized');
      console.log(data);
      // Atualizar a posição do jogador baseada nos dados recebidos
    }
  };

  

  useEffect(() => {
    const newCable = createConsumer('ws://localhost:3000/cable');
    setCable(newCable);

    const newSubscription = newCable.subscriptions.create(
      { channel: 'GameChannel', game_id: 1 },
      {
        received: handleReceived,
      }
    );

    setSubscription(newSubscription);

    return () => {
      newSubscription.unsubscribe();
      newCable.disconnect();
    };
  }, []);



  const handleKeyDown = (event) => {
    console.log('Send move')
    if (event.key === 'w') {

      subscription.perform('move', { player: { direction: 'up' } });
    }
    // ... handle other keys
  };


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [subscription]);





  return (
    <>
      <GameCanvas map={map} player={player} />
    </>
  );
}

export default WorldMap;
