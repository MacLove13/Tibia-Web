import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const EquippedItem = ({ item, slot, imageUrl }) => {
  const [, drag] = useDrag(() => (
    {
      type: 'EQUIPPED_ITEM',
      item: {
        slot: slot,
        type: 'EQUIPPED_ITEM',
        uuid: item.uuid
      }
    }
  ));

  return (
    <img src={imageUrl} ref={drag} alt="left-hand" />
  );
};

export default EquippedItem;