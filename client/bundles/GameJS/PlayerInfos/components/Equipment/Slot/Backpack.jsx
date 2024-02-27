import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';
import ContextMenuItem from 'bundles/GameJS/PlayerInfos/components/ItemMenu/ContextMenuItem';

import EmptyBag from '../Images/item/empty_bag.gif';

const Backpack = ({ equipped }) => {
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    canDrop: (item) => item.type === 'Backpack',
    drop: (item) => onEquip(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onEquip = (item) => {

  	if (item.type != "Backpack") {
  		console.log('Este item não é uma Mochila.')
  		return;
  	}

  	console.log('Equip Item')
  	console.log(item)
  }

  let backgroundColor = 'transparent';
  if (isOver) {
    backgroundColor = canDrop ? 'green' : 'red';
  }

  const useItem = () => {
    GameInstance.init.networkSystem.EmitServer("Character:OpenEquippedBag");
  };

  const showContextMenu = (event) => {
    const menu = document.getElementById(`equipment-backpack`);
    if (menu == null) return;
    menu.style.display = 'block';
    menu.style.left = `${event.pageX - 220}px`;
    menu.style.top = `${event.pageY}px`;
  };

  let imageUrl = null;
  if (equipped && equipped.image != null) {
    imageUrl = require(`bundles/Images/${equipped.image}`);
  }

	return (
    <>
      { equipped && equipped.uuid != null && <>
          <ContextMenuItem id={`equipment-backpack`} type="Backpack" useItem={useItem} />
      		<div
            className="slot"
            onContextMenu={showContextMenu}
          >
            { !imageUrl && <img src={EmptyBag} ref={drop} style={{ backgroundColor }} alt="bag" /> }
            { imageUrl && <img src={imageUrl} ref={drop} style={{ backgroundColor }} alt="bag" /> }
      		</div>
        </>
      }

      { (!equipped || equipped.uuid == null) && !imageUrl && <div className="slot">
          <img src={EmptyBag} ref={drop} style={{ backgroundColor }} alt="bag" />
        </div>
      }
    </>
	)
};

export default Backpack;