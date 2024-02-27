import React, { useEffect, useRef } from 'react';

import RightMenu from 'bundles/GameJS/RightMenu/RightMenu';
import RightMenuItem from 'bundles/GameJS/RightMenu/RightMenuItem';


const FoodMenu = ({ useItem, item_uuid }) => {

	return (
		<>
			<RightMenuItem name="Use" action={useItem} />
			<RightMenuItem name={item_uuid} />
			<RightMenuItem name="Look" />
		</>
	)
}

const PotionMenu = ({ useItem, item_uuid }) => {

	return (
		<>
			<RightMenuItem name="Use" action={useItem} />
			<RightMenuItem name={item_uuid} />
			<RightMenuItem name="Look" />
		</>
	)
}

const WeaponMenu = ({ useItem }) => {

	return (
		<>
			<RightMenuItem name="Equip" action={useItem} />
			<RightMenuItem name="Look" />
		</>
	)
}

const BackpackMenu = ({ useItem }) => {

	return (
		<>
			<RightMenuItem name="Open" action={useItem} />
		</>
	)
}

const ContextMenuItem = ({ id, type, useItem, item_uuid }) => {

	const closeMenu = () => {
		const menu = document.getElementById(id);
	  menu.style.display = 'none';
	};

	useEffect(() => {
		window.addEventListener('mousedown', (event) => {
		  const menu = document.getElementById(id);
		  if (menu != null && !menu.contains(event.target)) {  // Verifica se o clique não foi dentro do menu
		    closeMenu();
		  }
		});
	});

	return (
		<RightMenu id={id}>
			{ type == 'Food' || type == 0 && <FoodMenu useItem={useItem} item_uuid={item_uuid} /> }
			{ type == 'Potion' || type == 3 && <PotionMenu useItem={useItem} item_uuid={item_uuid} /> }
			{ type == 'Sword' || type == 4 && <WeaponMenu useItem={useItem} /> }
			{ type == 'Backpack' && <BackpackMenu useItem={useItem} /> }
		</RightMenu>
	)
};

export default ContextMenuItem;