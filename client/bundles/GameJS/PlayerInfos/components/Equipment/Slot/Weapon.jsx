import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Game, { EventType } from 'bundles/GameJS/store/GameInit';
import EmptySword from '../Images/item/empty_sword.gif';

const Weapon = () => {
	var gameInstance = new Game();
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    // canDrop: (item) => item.type === 'Weapon',
    drop: (item) => onEquip(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onEquip = (item) => {

  	if (item.type != "Sword") {
  		console.log('Este item não é uma arma.')
  		return;
  	}

  	console.log('Equip Item')
  	console.log(item)
  }

  let backgroundColor = 'white';
  if (isOver) {
    backgroundColor = canDrop ? 'green' : 'red';
  }

  // const imageUrl = require(`bundles/Images/${uItem.image}`);

	return (
		<div className="slot">
			<img src={EmptySword} ref={drop} style={{ backgroundColor }} alt="left-hand" />
		</div>
	)
};

export default Weapon;