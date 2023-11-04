import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';
import EmptySword from '../Images/item/empty_sword.gif';

const LeftHand = ({ equipped }) => {
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    canDrop: (item) => item.item_template.Type === '4',
    drop: (item) => onEquip(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onEquip = (item) => {
    console.log(item)
  	if (item.item_template.Type != "Sword" && item.item_template.Type != "4") {
  		console.log('Este item não é uma arma.')
  		return;
  	}

    GameInstance.init.networkSystem.EmitServer("EquipItem", {
      item_uuid: item.uuid
    });
  }

  let backgroundColor = 'transparent';
  if (isOver) {
    backgroundColor = canDrop ? 'green' : 'red';
  }

  let imageUrl = null;
  if (equipped) {
    imageUrl = require(`bundles/Images/${equipped.image}`);
  }

	return (
		<div className="slot">
			{ !equipped && <img src={EmptySword} ref={drop} style={{ backgroundColor }} alt="left-hand" /> }
      { equipped && <img src={imageUrl} ref={drop} style={{ backgroundColor }} alt="left-hand" /> }
		</div>
	)
};

export default LeftHand;