import React from 'react';
import './TilesEditor.scss';


function TileItem({ itemId, changeTileType }) {

  if (itemId == -1)
    return (
      <li
        onClick={() => changeTileType(itemId)}
        style={{ backgroundImage: 'none', backgroundColor: 'red' }}
      />
    )

  return (
    <li
      onClick={() => changeTileType(itemId)}
      style={{ backgroundPosition: `-${(itemId % 32) * 32}px -${((itemId / 32) | 0) * 32}px` }}
    />
  );
};

export default TileItem;
