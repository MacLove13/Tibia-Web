import React, { useEffect, useRef } from 'react';

import RightMenu from 'bundles/GameJS/RightMenu/RightMenu';
import RightMenuItem from 'bundles/GameJS/RightMenu/RightMenuItem';


const FoodMenu = ({ useItem }) => {

	return (
		<>
			<RightMenuItem name="Use" action={useItem} />
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

const ContextMenuItem = ({ id, type, useItem }) => {

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
			{ type == 'Food' || type == 0 && <FoodMenu useItem={useItem} /> }
			{ type == 'Sword' && <WeaponMenu useItem={useItem} /> }
			{ type == 'Backpack' && <BackpackMenu useItem={useItem} /> }
		</RightMenu>
	)
};

export default ContextMenuItem;