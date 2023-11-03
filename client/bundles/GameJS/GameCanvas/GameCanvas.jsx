import React, { useEffect, useRef, useState } from 'react';
import './GameCanvas.scss';

import TilesEditor from './TilesEditor/TilesEditor';

function GameCanvas({ isInitializedAll, setIsInitializedAll, gameSize }) {
  const [grass, setGrass] = useState(null);
  const [renderPlayer, setRenderPlayer] = useState(false);
  const [createdMap, setCreatedMap] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    
  }, []);

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

      { isInitializedAll && createdMap && <TilesEditor
          canvasRef={canvasRef}
        /> }
    </>
  );
}

export default GameCanvas;
