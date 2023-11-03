import React, { useEffect, useRef, useState } from 'react';
import './GameCanvas.scss';

import TilesEditor from './TilesEditor/TilesEditor';

function GameCanvas({ isInitializedAll, setIsInitializedAll, gameSize }) {
  const [grass, setGrass] = useState(null);
  const [renderPlayer, setRenderPlayer] = useState(false);
  const [showTileEditor, setShowTileEditor] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 112) {
        event.preventDefault();
        setShowTileEditor(!showTileEditor);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTileEditor]);

  return (
    <>
      <canvas
        id="GameCanvas"
        className="game-canvas"
        width={gameSize.width}
        height={gameSize.height}
        ref={canvasRef}
        style={{ display: isInitializedAll ? 'block' : 'none' }}
      />

      <canvas
        id="GameCanvas-layer-1"
        className="game-canvas"
        width={gameSize.width}
        height={gameSize.height}
        ref={canvasRef}
        style={{ display: isInitializedAll ? 'block' : 'none' }}
      />

      { isInitializedAll && showTileEditor && <TilesEditor
          canvasRef={canvasRef}
        /> }
    </>
  );
}

export default GameCanvas;
