import React, { useEffect, useState } from 'react';
import './Backpack.scss';

// import BackpackImage from '../../../../components/Equipment/Images/backpack/default.gif';
// import Coins100 from './Images/Gold/100.gif';

import Game, { EventType } from '../../../../../store/GameInit';

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
	const emptySlotsCount = slots - itemsCount;

	const emptySlotsComponents = [...Array(emptySlotsCount)].map((_, index) => (
	  <EmptySlot key={`empty-slot-${index}`} />
	));

	return (
		<>
			<div className="menu-title">
				{/*<img width="14" src={BackpackImage} alt="/images/coin/backpack.gif" />*/}
				<span>Backpack</span>
			</div>
			<div className="menu-body slot-list">
				{ itemsCount > 0 && items.map((item) => <Item key={`item-${item.item.uuid}`} backpack_uuid={uuid} item={item} /> )}
				{emptySlotsComponents}
			</div>
		</>
	)
};

export default Backpack;