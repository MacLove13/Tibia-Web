import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';
import BackpackImg from 'bundles/Images/Backpacks/Default.gif';
import ContextMenuItem from 'bundles/GameJS/PlayerInfos/components/ItemMenu/ContextMenuItem';

const Backpack = () => {
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
    GameInstance.init.networkSystem.EmitServer("character:openMainBag");
  };

  const showContextMenu = (event) => {
    const menu = document.getElementById(`equipment-backpack`);
    if (menu == null) return;
    menu.style.display = 'block';
    menu.style.left = `${event.pageX - 220}px`;
    menu.style.top = `${event.pageY}px`;
  };

  // const imageUrl = require(`bundles/Images/${uItem.image}`);

	return (
    <>
      <ContextMenuItem id={`equipment-backpack`} type="Backpack" useItem={useItem} />
  		<div
        className="slot"
        onContextMenu={showContextMenu}
      >
  			<img src={BackpackImg} ref={drop} style={{ backgroundColor }} alt="left-hand" />
  		</div>
    </>
	)
};

export default Backpack;