import React, { useEffect } from 'react';
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

const Backpack = ({ }) => {
	
	return (
		<>
			
			<div className="menu-title">
				{/*<img width="14" src={BackpackImage} alt="/images/coin/backpack.gif" />*/}
				<span>Backpack</span>
			</div>
			<div className="menu-body slot-list">
				<Item />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
				<EmptySlot />
			</div>
		</>
	)
};

export default Backpack;