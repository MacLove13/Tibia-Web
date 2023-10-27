import React from 'react';
import './RightMenu.scss';

import RightMenuItem from './RightMenuItem';

const RightMenu = ({ children, id }) => {

	return (
		<div id="custom-menu" className="right-menu">
			<ul>
			  {children}
			  <li>Inspect</li>
			  <li>Cyclopedia</li>
			  <li>Open in new window</li>
			  <hr />
			  <li>Trade with ...</li>
			  <hr />
			  <li>Manage Containers ...</li>
			  <li>Add to Loot List</li>
			</ul>
		</div>
	)
};

export default RightMenu;