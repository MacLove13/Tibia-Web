import React from 'react';
import './PlayerInfos.scss';

import Equipment from '../components/Equipment/Equipment';
import ItemMenu from '../components/ItemMenu/ItemMenu';

import Battle from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Battle/Battle'
import Skills from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Skills/Skills'
import Backpack from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Backpack/Backpack';

const PlayerInfos = ({ Init }) => {

	return (
		<div className="player-infos">
			<Equipment />
			<ItemMenu maxHeight={200}>
				<Battle />
			</ItemMenu>
			<ItemMenu>
				<Skills />
			</ItemMenu>
			<ItemMenu maxHeight={176}>
				<Backpack />
			</ItemMenu>
		</div>
	);
};

export default PlayerInfos;