import React from 'react';
import './RightMenu.scss';

const RightMenuItem = ({ name, action }) => {

	const closeMenu = (event) => {
		const menu = event.target.parentNode.parentNode;
	  menu.style.display = 'none';
	};

	const OnClick = (e) => {
		closeMenu(e);
		action();
	};

	return (
		<>
			<li onClick={OnClick}>{name}</li>
		</>
	)
};

export default RightMenuItem;