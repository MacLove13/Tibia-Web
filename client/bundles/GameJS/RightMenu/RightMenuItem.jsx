import React from 'react';
import './RightMenu.scss';

const RightMenuItem = ({ name, action }) => {

	return (
		<>
			<li onClick={action}>{name} 1</li>
		</>
	)
};

export default RightMenuItem;