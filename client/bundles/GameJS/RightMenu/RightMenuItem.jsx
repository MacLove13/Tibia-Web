import React from 'react';
import './RightMenu.scss';

const RightMenuItem = ({ name, action = null }) => {

	return (
		<>
			{ action == null && <li onClick={() => alert('oi')}>{name}</li> }
			{ action != null && <li onClick={() => alert('oi')}>{name}</li> }
		</>
	)
};

export default RightMenuItem;