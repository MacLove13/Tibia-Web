import React, { useEffect, useState, useMemo } from 'react';

import avatarImage from './Images/idle.png';
import walkingImg from './Images/walking.png';

const TILE_SIZE = 32;
const baseSpeed = 300;

const useWalkWithKeyboard = (player) => {
	const [direction, setDirection] = React.useState('down');
	const [walking, setWalking] = useState(false);
  const [speed, setSpeed] = useState(baseSpeed);

  const calculatedSpeed = useMemo(() => {
    const finalSpeed = calculateSpeed(speed);
    return finalSpeed;
  }, [speed]);

  useEffect(() => {
    const fn = (event) => {
      if (walking) {
          return;
      }

      let newDirection;
      let newPos = {};

	      switch (`${event.key}`.toLowerCase()) {
	          case 'w':
	              newDirection = 'up';
	              newPos = { x: player.x, y: player.y - 1 };
	          break;
	          case 's':
	              newDirection = 'down';
	              newPos = { x: player.x, y: player.y + 1 };
	          break;
	          case 'a':
	              newDirection = 'left';
	              newPos = { x: player.x - 1, y: player.y };
	          break;
	          case 'd':
	              newDirection = 'right';
	              newPos = { x: player.x + 1, y: player.y };
	          break;
	      }

	      setDirection(newDirection);
	      setWalking(true);

	      // if (shouldNotCompleteMove(parsedMap.map, newPos)) {
	      //     setWalking(false);
	      //     return;
	      // }

	      // const { effects: sqmEffects, slow } = getFutureSqmInfo(parsedMap.map, newPos);
	      // const finalEffects = { ...effects } || {};
	      // sqmEffects.forEach((item) => {
	      //     dispatch(setMessage(item.metadata.message));
	      //     // if (finalEffects[item.name]) {
	      //     //     clearTimeout(finalEffects[item.name].wipeTimeout);
	      //     //     delete state.effects[item.name];
	      //     //     setState(state => ({ ...state, effects: state.effects }));
	      //     // }
	      //     finalEffects[item.name] = {
	      //         component: item.component,
	      //         wipeTimeout: setTimeout(() => {
	      //             delete effects[item.name];
	      //             setEffects(effects);
	      //         }, item.metadata.duration)
	      //     };
	      // }, {});

	      // const speedTime = slow ? baseSpeed - (baseSpeed * slow) : baseSpeed;
	      const speedTime = baseSpeed;
	      setSpeed(speedTime);
	      // setEffects(finalEffects);

	      // dispatch(setPlayerPos(newPos));
	    };

	    window.addEventListener('keypress', fn);

	    return () => {
	        window.removeEventListener('keypress', fn);
	    };
	}, [walking]);

  useEffect(() => {
        if (walking === true) {
            setTimeout(() => {
                setWalking(false);
            }, calculatedSpeed * 1000);
        }
    }, [walking]);

  return {
        direction,
        walking,
        calculatedSpeed
    }
}


const calculateSpeed = speed => 1/(speed/100) * 1;

function Player({ player, canvasRef, renderPlayer, setRenderPlayer }) {
	const [avatar, setAvatar] = useState(null);
	const [walkingImage, setWalkingImage] = useState(null);

	

	const {
        walking,
        calculatedSpeed,
        direction,
    } = useWalkWithKeyboard(player);
  







	useEffect(() => {
    const img = new Image();
    img.src = avatarImage;
    img.onload = () => {
      setAvatar(img);
    };

    const img2 = new Image();
    img2.src = walkingImg;
    img2.onload = () => {
      setWalkingImage(img2);
    };
  }, []);

  useEffect(() => {
  	if (!renderPlayer) return;
  	if (!img) return;
  	if (!img2) return;
  	
  	const canvas = canvasRef.current;
  	const ctx = canvas.getContext('2d');

    const left = player.x - Math.floor(ctx.canvas.width / (2 * TILE_SIZE));
    const top = player.y - Math.floor(ctx.canvas.height / (2 * TILE_SIZE));
    const playerX = (player.x - left) * TILE_SIZE;
    const playerY = (player.y - top) * TILE_SIZE;


    let bgX = 0;
    let bgY = 0;
    ctx.drawImage(walkingImage, bgX, bgY, 64, 64, playerX - 8, playerY - 10, 64, 64);

    // ctx.fillStyle = 'red';
    // ctx.fillRect(playerX, playerY, TILE_SIZE, TILE_SIZE);
    setRenderPlayer(false);
  }, [renderPlayer]);

  return null;  // O componente Player não retorna nenhum JSX
}

export default Player;
