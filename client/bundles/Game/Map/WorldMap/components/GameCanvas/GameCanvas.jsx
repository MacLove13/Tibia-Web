import React, { useEffect, useRef, useState } from 'react';
import './GameCanvas.scss';

import grassImage from './Tiles/grass.png';
import Player from '../Player/Player';
import TilesEditor from '../TilesEditor/TilesEditor';

const TILE_SIZE = 32;

function GameCanvas({ map, player }) {
  const [grass, setGrass] = useState(null);
  const [renderPlayer, setRenderPlayer] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = grassImage;
    img.onload = () => {
      setGrass(img);
      draw();
    };
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  const draw = () => {
    if (!grass) {
      console.log("Grass not loaded")
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const left = player.x - Math.floor(canvas.width / (2 * TILE_SIZE));
    const top = player.y - Math.floor(canvas.height / (2 * TILE_SIZE));

    map.tiles.forEach(tile => {
      const x = (tile.x - left) * TILE_SIZE;
      const y = (tile.y - top) * TILE_SIZE;
      if (tile.tileType === 'grass') {
        // Supondo que você queira um background-position de (0, 0) por padrão
        const bgX = 0;
        const bgY = 0;
        ctx.drawImage(grass, bgX, bgY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = tile.walkable ? 'green' : 'gray';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    });

    setRenderPlayer(true);
    console.log('Set Render Player')
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  useEffect(draw, [map, player]);

  return (
    <>
      <canvas className="game-canvas" ref={canvasRef}>
        <Player
          player={player}
          canvasRef={canvasRef}
          renderPlayer={renderPlayer}
          setRenderPlayer={setRenderPlayer}
        />

        
      </canvas>

      <TilesEditor player={player} canvasRef={canvasRef} />
    </>
  );
}

export default GameCanvas;
