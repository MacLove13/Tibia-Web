import React, { useEffect, useRef, useState } from 'react';
import './TilesEditor.scss';

import GameInstance from 'bundles/GameJS/store/GameInit';

const TILE_SIZE = 32;

function TilesEditor({ canvasRef, subscription }) {
  const socket = GameInstance.init.networkSystem.GetSocket();
  const [tileType, setTileType] = useState(350);
  const tileTypeRef = useRef(tileType);

  const [tileWalkable, setTileWalkable] = useState(true);
  const tileWalkableRef = useRef(tileWalkable);

  const [enabledTileEditor, setEnabledTileEditor] = useState(false);
  const enabledTileEditorRef = useRef(enabledTileEditor);

  const [playerPosition, setPlayerPosition] = useState({
    x: -55555555,
    y: -55555555
  });
  const playerRef = useRef(playerPosition);

  useEffect(() => {
    tileTypeRef.current = tileType;
  }, [tileType]);

  useEffect(() => {
    tileWalkableRef.current = tileWalkable;
  }, [tileWalkable]);

  useEffect(() => {
    enabledTileEditorRef.current = enabledTileEditor;
  }, [enabledTileEditor]);

  useEffect(() => {
    playerRef.current.x = playerPosition.x;
    playerRef.current.y = playerPosition.y;
  }, [playerPosition]);

  const handleCanvasClick = (event) => {
    if (playerRef.current.x == -55555555) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tileSize = 2 * TILE_SIZE;
    const removeDivisorX = (canvasRef.current.width % TILE_SIZE);
    const removeDivisorY = (canvasRef.current.height % TILE_SIZE);
    
    const left = playerRef.current.x - Math.round((canvasRef.current.width - removeDivisorX) / tileSize);
    const top = playerRef.current.y - Math.round((canvasRef.current.height - removeDivisorY) / tileSize);

    const tileX = Math.floor(x / TILE_SIZE) + left;
    const tileY = Math.floor(y / TILE_SIZE) + top;

    console.log(tileX, tileY)

    if (!enabledTileEditorRef.current) return;

    GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
        x: tileX,
        y: tileY,
        newType: tileTypeRef.current,
        walkable: tileWalkableRef.current
    });
  };

  const changeTileType = (newType) => {
    setTileType(newType);
  }

  const changeWalkable = () => {
    setTileWalkable(!tileWalkable)
  }

  const toggleTileEditor = () => {
    setEnabledTileEditor(!enabledTileEditor);
  }

  useEffect(() => {

    const canvas = canvasRef.current;
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [canvasRef]);

  useEffect(() => {
    socket.on("UpdatePositionTileEditor", (data) => {
      setPlayerPosition({
        x: data.Data.Pos.x,
        y: data.Data.Pos.y,
      })
    });
  }, []);

  return (
    <div className="tiles-editor">
      <div className="title">Tile Editor</div>

      <div className="tile-types">
        <ul>
          <li
            onClick={() => changeTileType(105)}
            style={{ backgroundPosition: `-${(105 % 32) * 32}px -${((105 / 32) | 0) * 32}px` }}
          />
          <li
            onClick={() => changeTileType(350)}
            style={{ backgroundPosition: `-${(350 % 32) * 32}px -${((350 / 32) | 0) * 32}px` }}
          />
        </ul>

        <hr />
        walkable <br/>
        <input type="checkbox" onChange={changeWalkable} checked={tileWalkable} />

        <hr />
        Enabled? <br/>
        <input type="checkbox" onChange={toggleTileEditor} checked={enabledTileEditor} />

        <hr />
        Current Position<br/>
        X: {playerPosition.x}, Y: {playerPosition.y}
      </div>
    </div>
  );
}

export default TilesEditor;
