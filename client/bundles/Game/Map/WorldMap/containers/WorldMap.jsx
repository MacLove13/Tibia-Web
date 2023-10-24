import React, { useState, useEffect, useRef } from 'react';


import './WorldMap.css';

import GameCanvas from '../components/GameCanvas/GameCanvas';
import Notification from '../components/Notification/Notification';
import Player from '../components/Player/Player';

function WorldMap({ cable, authCode }) {
  const [player, setPlayer] = useState(
    {
      name: 'mac',
      x: 0,
      y: 0,
      direction: 'up'
    }
  );
  const playerRef = useRef(player);
  const [subscription, setSubscription] = useState(null);
  const [map, setMap] = useState(null);
  const [notification, setNotification] = useState(null);

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
    else if (data.action === 'update_map') {
      setMap(data.map);
    }
    else if (data.action === 'move') {
      setPlayer(oldPos => ({
        ...oldPos,
        x: data.new_position.x,
        y: data.new_position.y,
        direction: data.player.direction,
      }));
    }
    else if (data.action === 'notification')
    {
      setNotification(data.message);
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    }
  };

  useEffect(() => {
    if (!cable) return;

    const newSubscription = cable.subscriptions.create(
      { channel: 'GameChannel', game_id: 1 },
      {
        received: handleReceived,
        connected: () => {
          newSubscription.perform('update_map');
        },
        disconnected: () => {
          alert('A conexão com o servidor foi perdida.');
        }
      }
    );
    setSubscription(newSubscription);
  }, [cable]);

  return (
    <>
      { map && <GameCanvas
          map={map}
          player={player}
          playerRef={playerRef}
          subscription={subscription}
        />
      }

      { notification && <Notification message={notification} /> }
    </>
  );
}

export default WorldMap;
