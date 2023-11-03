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

  const [editLayer, setEditLayer] = useState(0);
  const editLayerRef = useRef(editLayer);

  const [enabledTileEditor, setEnabledTileEditor] = useState(false);
  const enabledTileEditorRef = useRef(enabledTileEditor);

  const [playerPosition, setPlayerPosition] = useState({
    x: -55555555,
    y: -55555555
  });
  const playerRef = useRef(playerPosition);
  const isMouseDown = useRef(false);
  const lastPosition = useRef({ x: -9999999999, y: -9999999999 });

  useEffect(() => {
    tileTypeRef.current = tileType;
  }, [tileType]);

  useEffect(() => {
    editLayerRef.current = editLayer;
  }, [editLayer]);

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

  const changeTileType = (newType) => {
    setTileType(newType);
  }

  const changeLayer = (newLayer) => {
    setEditLayer(newLayer.target.value);
  }

  const changeWalkable = () => {
    setTileWalkable(!tileWalkable)
  }

  const toggleTileEditor = () => {
    setEnabledTileEditor(!enabledTileEditor);
  }

  function whileMouseDown(event) {
    if (!enabledTileEditorRef.current) return;
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

    if (lastPosition.current.x == tileX && lastPosition.current.y == tileY) return;

    lastPosition.current = { x: tileX, y: tileY };
    GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
      layer: editLayerRef.current,
      x: tileX,
      y: tileY,
      newType: tileTypeRef.current,
      walkable: tileWalkableRef.current
    });
  }

  function handleMouseDown(event) {
    if (!enabledTileEditorRef.current) return;
    isMouseDown.current = true;
  }

  function handleMouseUp(event) {
    if (!enabledTileEditorRef.current) return;
    isMouseDown.current = false;
  }

  function handleMouseMove(event) {
    if (!enabledTileEditorRef.current) return;
    if (isMouseDown.current) {
      whileMouseDown(event);
    }
  }

  useEffect(() => {

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
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
        <input
          type="range"
          min="-10"
          max="10"
          value={editLayerRef.current}
          onChange={changeLayer}
          className="slider"
        />
        <p>Layer: {editLayerRef.current}</p>

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
