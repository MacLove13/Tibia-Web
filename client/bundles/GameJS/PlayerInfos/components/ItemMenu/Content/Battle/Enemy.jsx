import React, { useEffect, useState } from 'react';
import './Battle.scss';

import Game, { EventType } from '../../../../../store/GameInit';

import MonsterRat from './Images/monster/rat.gif';

const Enemy = ({ enemy, isTarget }) => {
	var gameInstance = new Game();
	let health = (enemy.hp * 100 / enemy.max_hp);

	if (enemy.hp <= 0)
		return null;

	const onClickAttack = () => {
		gameInstance.PublishEvent(EventType.PlayerTarget, { ID: enemy.id, IsTargeting: !isTarget });
	};

	return (
		<div className="monster" onClick={onClickAttack}>
			<div className={`photo ${isTarget ? 'target' : ''}`}>
				<img height="21" src={MonsterRat} alt={enemy.name} />
			</div>
			<div className="data">
				<span>{enemy.name} {enemy.distance}</span>
				<div className="life">
					<div className="bar" style={{ marginTop: '1px', borderTop: '3px solid green', width: `${health}%` }}></div>
				</div>
			</div>
		</div>
	)
};

export default Enemy;