import React, { useEffect, useState } from 'react';
import './Battle.scss';

import MenuIcon from './Images/icon.svg';
import Enemy from './Enemy';

import Game, { EventType } from '../../../../../store/GameInit';

const Battle = ({ }) => {
	const [enemies, setEnemies] = useState([]);
	const [targetID, setTargetID] = useState(null);

	var gameInstance = new Game();

	useEffect(() => {
		setInterval(() => {
			setEnemies(gameInstance.init.networkSystem.enemiesList);
			setTargetID(gameInstance.init.networkSystem.targetID);
		}, 200);
	}, [])

	return (
		<>
			<div className="menu-title">
				<img width="14" src={MenuIcon} alt="/images/battle.svg" />
				<span>Battle</span>
			</div>
			<div className="menu-body">
				{ enemies.map ((enemy) => <Enemy key={`enemy-${enemy.id}`} enemy={enemy} isTarget={targetID !== null && enemy.id == targetID} /> )}
			</div>
		</>
	)
};

export default Battle;