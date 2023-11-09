import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import GameInstance from '../../../../../store/GameInit';
import './Backpack.scss';

// import BackpackImage from '../../../../components/Equipment/Images/backpack/default.gif';
// import Coins100 from './Images/Gold/100.gif';

import Item from './Item/Item';

const EmptySlot = ({ }) => {

	return (
		<div className="backpack">
			<div className="slot" />
		</div>
	)
};

const Backpack = ({ slots, items, uuid }) => {
	const itemsCount = items.length;
	let emptySlotsCount = slots - itemsCount;
	if (emptySlotsCount < 0) emptySlotsCount = 0;

	const emptySlotsComponents = [...Array(emptySlotsCount)].map((_, index) => (
	  <EmptySlot key={`empty-slot-${index}`} />
	));

	const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['ITEM', 'EQUIPPED_ITEM'],
    // canDrop: (item) => item.type === '4',
    drop: (item) => onPutItem(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onPutItem = (item) => {
  	console.log('onPutItem');
  	console.log(item)

  	if (item.type == 'EQUIPPED_ITEM') {
  		GameInstance.init.networkSystem.EmitServer("UnequipItem", {
	      slot: item.slot,
	      item_uuid: item.uuid,
	      backpack_uuid: uuid,
	    });
  	}

  	// if (item.item_template.type != "Sword" && item.item_template.type != "4") {
  	// 	console.log('Este item não é uma arma.')
  	// 	return;
  	// }
  }

	return (
		<>
			<div className="menu-title">
				{/*<img width="14" src={BackpackImage} alt="/images/coin/backpack.gif" />*/}
				<span>Backpack</span>
			</div>
			<div className="menu-body slot-list" ref={drop}>
				{ itemsCount > 0 && items.map((item) => <Item key={`item-${item.item.uuid}`} backpack_uuid={uuid} item={item} /> )}
				{emptySlotsComponents}
			</div>
		</>
	)
};

export default Backpack;