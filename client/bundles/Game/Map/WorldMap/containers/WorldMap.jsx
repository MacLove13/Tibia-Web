import React, { useState, useEffect, useRef } from 'react';


import './WorldMap.css';

import GameCanvas from '../components/GameCanvas/GameCanvas';
import Player from '../components/Player/Player';

function WorldMap({ cable, authCode }) {
  const [player, setPlayer] = useState(
    {
      x: 0,
      y: 0,
      direction: 'up'
    }
  );
  const playerRef = useRef(player);
  const [subscription, setSubscription] = useState(null);
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

  const handleKeyDown = (event) => {
    if (!subscription) return;

    const currentPlayer = playerRef.current;
    let move = null;

    if (event.key === 'w') {
      move = "up"
    }
    else if (event.key === 's') {
      move = "down"
    }
    else if (event.key === 'a') {
      move = "left"
    }
    else if (event.key === 'd') {
      move = "right"
    }

    if (!move) return;

    subscription.perform('move', {
      account: {
        identifier: '4',
        auth: authCode,
      },
      player: {
        direction: move,
        position: {
          x: currentPlayer.x,
          y: currentPlayer.y
        }
      }
    });
  };

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [subscription]);

  const handleReceived = (data) => {
    if (data.action === 'disconnect') {
      window.location = '/'
      return;
    }
    if (data.action === 'move') {
      console.log('move atualized');
      console.log(data);
      // Atualizar a posição do jogador baseada nos dados recebidos

      setPlayer(oldPos => ({
        ...oldPos,
        x: data.new_position.x,
        y: data.new_position.y,
        direction: data.player.direction,
      }));
      console.log(data.new_position.y)
      
    }
  };

  useEffect(() => {
    if (!cable) return;

    const newSubscription = cable.subscriptions.create(
      { channel: 'GameChannel', game_id: 1 },
      {
        received: handleReceived,
      }
    );
    setSubscription(newSubscription);
  }, [cable]);

console.log(player)
  return (
    <>
      <GameCanvas map={map} player={player}>
        
      </GameCanvas>
    </>
  );
}

export default WorldMap;
