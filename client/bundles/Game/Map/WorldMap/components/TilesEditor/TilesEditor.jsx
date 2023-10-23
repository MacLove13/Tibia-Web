import React, { useEffect, useRef, useState } from 'react';
import './TilesEditor.scss';

const TILE_SIZE = 32;

function TilesEditor({ player, canvasRef }) {

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const left = player.x - Math.floor(canvasRef.current.width / (2 * TILE_SIZE));
    const top = player.y - Math.floor(canvasRef.current.height / (2 * TILE_SIZE));

    const tileX = Math.floor(x / TILE_SIZE) + left;
    const tileY = Math.floor(y / TILE_SIZE) + top;

    console.log('Tile X:', tileX, 'Tile Y:', tileY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <div className="tiles-editor">
      asdasd
    </div>
  );
}

export default TilesEditor;
