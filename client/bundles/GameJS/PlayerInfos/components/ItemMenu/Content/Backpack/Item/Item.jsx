import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../Backpack.scss';

import Game, { EventType } from 'bundles/GameJS/store/GameInit';

import ContextMenuItem from 'bundles/GameJS/PlayerInfos/components/ItemMenu/ContextMenuItem';

const Item = ({ item }) => {
	var gameInstance = new Game();
	const [, drag] = useDrag(() => (item));
	const uItem = item.item;

	const onClickItem = () => {

		if (uItem.type == 'Food' && uItem.healPoints != null) {
			gameInstance.PublishEvent(EventType.PlayerSelfHeal, {
		    Points: uItem.healPoints
		  })
		}
	};

	const useItem = () => {
		gameInstance.init.networkSystem.EmitServer("UseItem", {
	    ItemUuid: uItem.uuid
	  });
	}

	const showContextMenu = (event) => {
		const menu = document.getElementById(`item-menu-${uItem.id}`);
		if (menu == null) return;
		menu.style.display = 'block';
		menu.style.left = `${event.pageX - 220}px`;
		menu.style.top = `${event.pageY}px`;
	};

	const imageUrl = require(`bundles/Images/${uItem.image}`);

	return (
		<div className="backpack">
			<ContextMenuItem id={`item-menu-${uItem.id}`} type={uItem.type} useItem={useItem} />
			<div
				className="slot"
				onClick={onClickItem}
				onContextMenu={showContextMenu}
				ref={drag}
			>
				<div className="item" style={{ backgroundImage: `url(${imageUrl})` }} />
				<span>{uItem.quantity}</span>
			</div>
		</div>
	)
};

export default Item;