import React, { useEffect, useRef, useState } from 'react';
import './TilesEditor.scss';

const TILE_SIZE = 32;

function TilesEditor({ playerRef, canvasRef, subscription }) {
  const [tileType, setTileType] = useState('water');
  const tileTypeRef = useRef(tileType);

  const [tileWalkable, setTileWalkable] = useState(true);
  const tileWalkableRef = useRef(tileWalkable);

  const [enabledTileEditor, setEnabledTileEditor] = useState(false);
  const enabledTileEditorRef = useRef(enabledTileEditor);

  useEffect(() => {
    tileTypeRef.current = tileType;
  }, [tileType]);

  useEffect(() => {
    tileWalkableRef.current = tileWalkable;
  }, [tileWalkable]);

  useEffect(() => {
    enabledTileEditorRef.current = enabledTileEditor;
  }, [enabledTileEditor]);

  const handleCanvasClick = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const left = playerRef.current.x - Math.floor(canvasRef.current.width / (2 * TILE_SIZE));
    const top = playerRef.current.y - Math.floor(canvasRef.current.height / (2 * TILE_SIZE));

    const tileX = Math.floor(x / TILE_SIZE) + left;
    const tileY = Math.floor(y / TILE_SIZE) + top;


    console.log('tileX: ', tileX, 'tileY: ', tileY)

    if (!enabledTileEditorRef.current) return;

    subscription.perform('update_tile', {
      x: tileX,
      y: tileY,
      new_type: tileTypeRef.current,
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

  return (
    <div className="tiles-editor">
      <div className="title">Tile Editor</div>

      <div className="tile-types">
        <ul>
          <li onClick={() => changeTileType('water')}>Water</li>
          <li onClick={() => changeTileType('grass')}>Grass</li>
        </ul>

        <hr />
        walkable <br/>
        <input type="checkbox" onChange={changeWalkable} checked={tileWalkable} />

        <hr />
        Enabled? <br/>
        <input type="checkbox" onChange={toggleTileEditor} checked={enabledTileEditor} />

        <hr />
        Current Position<br/>
        X: {playerRef.current.x}, Y: {playerRef.current.y}
      </div>
    </div>
  );
}

export default TilesEditor;
