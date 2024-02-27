import React, { useEffect, useState } from 'react';
import './Battle.scss';

import MenuIcon from './Images/icon.svg';
import Enemy from './Enemy';

import GameInstance, { EventType } from '../../../../../store/GameInit';

const Battle = ({ }) => {
	const socket = GameInstance.init.networkSystem.GetSocket();
	const [enemies, setEnemies] = useState([]);
	const [targetID, setTargetID] = useState(null);

	useEffect(() => {
	  socket.on("BattleMenu", (data) => {
	    setEnemies(data.Data.battleList);
	  });
	}, [socket]);

	return (
		<>
			<div className="menu-title">
				<img width="14" src={MenuIcon} alt="/images/battle.svg" />
				<span>Battle</span>
			</div>
			<div className="menu-body">
				{ enemies.length > 0 && enemies.map ((enemy) => <Enemy key={`enemy-${enemy.id}`} enemy={enemy} /> )}
			</div>
		</>
	)
};

export default Battle;