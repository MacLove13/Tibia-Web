import React, { useEffect } from 'react';
import '../Backpack.scss';

import Coins100 from 'bundles/Images/items/potions/1.png';

import Game, { EventType } from 'bundles/GameJS/store/GameInit';

import RightMenu from 'bundles/GameJS/RightMenu/RightMenu';
import RightMenuItem from 'bundles/GameJS/RightMenu/RightMenuItem';

const ConstructMenu = ({ id, useItem }) => {

	const closeMenu = () => {
		const menu = document.getElementById(id);
	  menu.style.display = 'none';
	};

	useEffect(() => {
		// window.addEventListener('mousedown', (event) => {
		//   const menu = document.getElementById(id);
		//   if (event.button !== 2) {  // Se não for um clique com o botão direito
		//     menu.style.display = 'none';
		//   }
		// });

		window.addEventListener('mousedown', (event) => {
		  const menu = document.getElementById(id);
		  if (!menu.contains(event.target)) {  // Verifica se o clique não foi dentro do menu
		    closeMenu();
		  }
		});
	});

	return (
		<RightMenu id={id}>
			<RightMenuItem name="Use" action={useItem} />
			<RightMenuItem name="Look" />
		</RightMenu>
	)
};

const Item = ({ }) => {
	var gameInstance = new Game();

	const onClickHeal = () => {
		gameInstance.PublishEvent(EventType.PlayerSelfHeal, {
	    Points: 30
	  })
	};

	const useItem = () => {
		console.log('Usando Item')
		gameInstance.PublishEvent(EventType.UseItem, {
	    Points: 30
	  })
	}

	const showContextMenu = (event) => {
		const menu = document.getElementById('custom-menu');
		menu.style.display = 'block';
		menu.style.left = `${event.pageX - 220}px`;
		menu.style.top = `${event.pageY}px`;
	};

	const imageUrl = require('bundles/Images/items/potions/1.gif');

	return (
		<div className="backpack">
			<ConstructMenu id="custom-menu" useItem={useItem} />
			<div
				className="slot"
				onClick={onClickHeal}
				onContextMenu={showContextMenu}
				style={{ backgroundImage: `url(${imageUrl})` }}
			>
				<span>51</span>
			</div>
		</div>
	)
};

export default Item;