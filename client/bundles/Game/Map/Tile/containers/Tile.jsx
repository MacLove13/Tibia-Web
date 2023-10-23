import React from 'react';
import './tile.css';

import Grass from '../components/Grass';


const TILE_SIZE = 32;

function Tile({
  tile,
  offsetX,
  offsetY
}) {

  return (
    <div
      className={`tile ${tile.walkable ? 'walkable' : 'non-walkable'} ${tile.tileType}`}
      style={{
        left: (tile.x - offsetX) * TILE_SIZE,
        top: (tile.y - offsetY) * TILE_SIZE,
      }}
      key={`${tile.x},${tile.y}`}
    ></div>
  );
}

export default Tile;
