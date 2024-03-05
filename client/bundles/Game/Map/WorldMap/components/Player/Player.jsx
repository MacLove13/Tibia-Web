import React, { useEffect, useState, useMemo, useRef } from 'react';

import avatarImage from './Images/idle.png';
import walkingImg from './Images/walking.png';

import PlayerInfo from './components/PlayerInfo';

const TILE_SIZE = 32;

function Player({ player, canvasRef, renderPlayer, setRenderPlayer }) {
	const playerInfoRef = useRef();
	const [lifeBarPosition, setLifeBarPosition] = useState({ x: 0, y: 0 });

	const avatarRef = useRef(null);
  const walkingImageRef = useRef(null);

	useEffect(() => {
    if (!avatarRef.current) {
      const img = new Image();
      img.src = avatarImage;
      img.onload = () => {
        avatarRef.current = img;
        setRenderPlayer(prev => !prev);
      };
	  }

	  if (!walkingImageRef.current) {
	    const img2 = new Image();
	    img2.src = walkingImg;
	    img2.onload = () => {
	      walkingImageRef.current = img2;
	      setRenderPlayer(prev => !prev);
	    };
	  }
  }, []);

  useEffect(() => {
  	// if (!renderPlayer) return;
  	if (!avatarRef.current || !walkingImageRef.current) {
      // console.log('Images not loaded');
      return;
    }
  	
  	const canvas = canvasRef.current;
  	const ctx = canvas.getContext('2d');

    const left = player.x - Math.floor(ctx.canvas.width / (2 * TILE_SIZE));
    const top = player.y - Math.floor(ctx.canvas.height / (2 * TILE_SIZE));
    const playerX = (player.x - left) * TILE_SIZE;
    const playerY = (player.y - top) * TILE_SIZE;

    let bgX = 0;
    let bgY = 0;
    ctx.drawImage(walkingImageRef.current, bgX, bgY, 64, 64, playerX - 40, playerY - 40, 64, 64);

    // Name
    // ctx.fillStyle = 'white';
    // ctx.font = '10px Arial';
    // const textMetrics = ctx.measureText(player.name);
    // const textWidth = textMetrics.width;
    // const textX = playerX + (TILE_SIZE - textWidth) / 2 - 15;
    // const textY = playerY - 12;
    // ctx.fillText(player.name, textX, textY);

    setRenderPlayer(false);
    setLifeBarPosition({ x: playerX, y: playerY });
    // console.log('Player Renderized')
  }, [renderPlayer]);

  return (
  	<>
      <PlayerInfo
      	x={lifeBarPosition.x}
        y={lifeBarPosition.y}
        currentHealth={player.currentHealth}
        maxHealth={player.maxHealth}
       />
    </>
  );
}

export default Player;
