import React, { useEffect, useRef, useState } from 'react';
import './GameCanvas.scss';

import grassImage from './Tiles/grass.png';
import Player from '../Player/Player';
import TilesEditor from '../TilesEditor/TilesEditor';

const TILE_SIZE = 32;

function GameCanvas({ map, player, playerRef, subscription }) {
  const [grass, setGrass] = useState(null);
  const [renderPlayer, setRenderPlayer] = useState(false);
  const [createdMap, setCreatedMap] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = grassImage;
    img.onload = () => {
        setGrass(img);
    };
    img.onerror = (error) => {
        console.error('Erro ao carregar a imagem:', error);
    };
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(grass);
  }

  const draw = (image = null) => {
    if (image == null) return;

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
        ctx.drawImage(image, bgX, bgY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = tile.walkable ? 'green' : 'gray';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    });

    setRenderPlayer(true);
    setCreatedMap(true);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [grass]);

  useEffect(() => {
    draw(grass);
  }, [map, player, grass]);

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

      { createdMap && <TilesEditor
          playerRef={playerRef}
          canvasRef={canvasRef}
          subscription={subscription}
        /> }
    </>
  );
}

export default GameCanvas;
