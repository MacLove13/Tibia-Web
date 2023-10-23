import React, { useEffect, useRef, useState } from 'react';
import './GameCanvas.css';

import grassImage from './Tiles/grass.png';

const TILE_SIZE = 32;

function GameCanvas({ map, player }) {
  const [grass, setGrass] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = grassImage;
    img.onload = () => {
      setGrass(img);
      draw();

      console.log('Grass loaded')
    };
  }, []);

  const canvasRef = useRef(null);

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

    // Desenhando o personagem
    const playerX = (player.x - left) * TILE_SIZE;
    const playerY = (player.y - top) * TILE_SIZE;
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, TILE_SIZE, TILE_SIZE);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  useEffect(draw, [map, player]);

  return <canvas className="game-canvas" ref={canvasRef}></canvas>;
}

export default GameCanvas;
