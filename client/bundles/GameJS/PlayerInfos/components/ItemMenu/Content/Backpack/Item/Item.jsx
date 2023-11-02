import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../Backpack.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

import ContextMenuItem from 'bundles/GameJS/PlayerInfos/components/ItemMenu/ContextMenuItem';

const Item = ({ item, backpack_uuid }) => {
	const [, drag] = useDrag(() => (item));
	const uItem = item.item;

	const onClickItem = () => {

		if (uItem.type == 'Food' && uItem.healPoints != null) {
			GameInstance.PublishEvent(EventType.PlayerSelfHeal, {
		    Points: uItem.healPoints
		  })
		}
	};

	const useItem = () => {
		GameInstance.init.networkSystem.EmitServer("UseItem", {
	    item_uuid: uItem.uuid,
	    backpack_uuid: backpack_uuid
	  });
	}

	const showContextMenu = (event) => {
		const menu = document.getElementById(`item-menu-${uItem.uuid}`);
		if (menu == null) return;
		menu.style.display = 'block';
		menu.style.left = `${event.pageX - 220}px`;
		menu.style.top = `${event.pageY}px`;
	};

	const imageUrl = require(`bundles/Images/${uItem.image}`);

	return (
		<div className="backpack">
			<ContextMenuItem id={`item-menu-${uItem.uuid}`} type={uItem.type} useItem={useItem} item_uuid={uItem.uuid} />
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