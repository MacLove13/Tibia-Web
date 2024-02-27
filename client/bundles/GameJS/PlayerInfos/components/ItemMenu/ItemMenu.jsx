import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; 
import './ItemMenu.scss';

const ItemMenu = ({
	children,
	close,
	height = 100,
	minHeight = 50,
	maxHeight = 100,
}) => {
	const [windowHeight, setWindowHeight] = useState(height);

  const onResize = (event, {node, size, handle}) => {
  	let height = size.height;
  	if (height > maxHeight) height = maxHeight;
  	if (height < minHeight) height = minHeight;
    setWindowHeight(height);
  };

  const defineMaxHeight = (value) => {
  	setMaxHeight(value);
  }

	return (
		<div className="menu-window">
			<Resizable
	      height={windowHeight}
	      width={100}
	      onResize={onResize}
	  	>
				<div
					className="menu-content"
					style={{
	        	height: windowHeight + 'px'
	       	}}
				>
		  		<div className="close-item-menu" onClick={close}>x</div>
					{ children }
				</div>
			</Resizable>
		</div>
	)
};

export default ItemMenu;