import React, { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../Backpack.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

import ContextMenuItem from 'bundles/GameJS/PlayerInfos/components/ItemMenu/ContextMenuItem';

const Item = ({ item, backpack_uuid }) => {
	const ref = useRef(null); // Cria uma referência para o elemento DOM do item

	  const [, drag] = useDrag(() => (item), [item]); // Depende de item para evitar recriações desnecessárias
	  const [, drop] = useDrop({
	    accept: 'ITEM', // Defina o tipo de item que esse componente pode aceitar
	    drop: (draggedItem) => {

	      console.log('Item solto sobre outro item', draggedItem);
	      console.log(item)

	      console.log("Quantity: " + draggedItem.quantity + 1)
	      console.log(draggedItem.quantity + 1 > 100)

	      if (draggedItem.quantity + 1 > 100) return;

	      console.log("Sending event")
	      GameInstance.init.networkSystem.EmitServer("Backpack:JoinItem", {
		      moved_item: draggedItem.uuid,
		      join_in_item: item.item.uuid,
		      backpack_uuid: backpack_uuid,
		    });
	    },
	  });


	drag(drop(ref));

  const uItem = item.item;


	const onClickItem = () => {

		if (uItem.item_template.type == 2 && uItem.healPoints != null) {
			GameInstance.PublishEvent(EventType.PlayerSelfHeal, {
		    Points: uItem.healPoints
		  })
		}

		console.log(uItem)

		if (uItem.item_template.type == 3 && uItem.healPoints != null) {
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

		const mouseY = event.clientY;
		const windowHeight = window.innerHeight;
		const threshold = 300;

		if ((windowHeight - mouseY) <= threshold) {
	        menu.style.top = `${event.pageY - 220}px`;
	    } else {
	        menu.style.top = `${event.pageY}px`;
	    }

		
	};

	const imageUrl = require(`bundles/Images/${uItem.item_template.image}`);

	return (
    <div className="backpack">
      <ContextMenuItem
        id={`item-menu-${uItem.uuid}`}
        type={uItem.item_template.type}
        useItem={useItem}
        item_uuid={uItem.uuid}
      />
      <div
        className="slot"
        onClick={onClickItem}
        onContextMenu={showContextMenu}
        ref={ref} // Utiliza a referência aqui
      >
        <div className="item" style={{ backgroundImage: `url(${imageUrl})` }} />
        {uItem.quantity > 1 && <span>{uItem.quantity}</span>}
      </div>
    </div>
  );

};

export default Item;