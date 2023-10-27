import React, { useState } from 'react';
import './Notification.scss';

import Draggable from 'react-draggable';

const GameNotification = ({ data, onClick, zIndex, closeNotification }) => {
	const [hidden, setHidden] = useState(false);

	const notificationStyle = {
      zIndex: zIndex,
      display: hidden ? 'none' : 'block',
  };

  const changeZIndex = () => {
  	onClick(data.Id);
  };

  const onCloseNotification = () => {
  	closeNotification(data.Id);
  	setHidden(true);
  };

	return (
		<Draggable>
			<div className="notification" style={notificationStyle} onClick={changeZIndex}>
				<div className="main">
					<div className="title">{data.Title} <span onClick={onCloseNotification}>x</span></div>
					<div className="content">
						{data.Content}
					</div>
				</div>
			</div>
		</Draggable>
	)
};

export default GameNotification;