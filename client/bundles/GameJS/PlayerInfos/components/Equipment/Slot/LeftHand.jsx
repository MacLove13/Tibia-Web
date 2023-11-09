import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import GameInstance from 'bundles/GameJS/store/GameInit';
import EmptySword from '../Images/item/empty_sword.gif';
import EquippedItem from '../EquippedItem';

const LeftHand = ({ equipped }) => {
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    canDrop: (item) => item.item_template.type === '4',
    drop: (item) => onEquip(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onEquip = (item) => {
  	if (item.item_template.type != "Sword" && item.item_template.type != "4") {
  		console.log('Este item não é uma arma.')
  		return;
  	}

    GameInstance.init.networkSystem.EmitServer("EquipItem", {
      slot: 'leftHand',
      item_uuid: item.uuid
    });
  }

  let backgroundColor = 'transparent';
  if (isOver) {
    backgroundColor = canDrop ? 'green' : 'red';
  }

  let imageUrl = null;
  if (equipped && equipped.image != null) {
    imageUrl = require(`bundles/Images/${equipped.image}`);
  }

	return (
		<div className="slot" ref={drop}>
			{ !imageUrl && <img src={EmptySword} style={{ backgroundColor }} alt="left-hand" /> }
      { imageUrl && <EquippedItem imageUrl={imageUrl} slot="leftHand" item={equipped} /> }
		</div>
	)
};

export default LeftHand;