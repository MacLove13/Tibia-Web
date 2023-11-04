import React, { useEffect, useState, useRef } from 'react';
import './Notification.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

const Notifications = ({ }) => {
	const [notification, setNotification] = useState(null);
	const notificationTimer = useRef(null);
	const socket = GameInstance.init.networkSystem.GetSocket();

	useEffect(() => {
		socket.on("character:textNotification", (data) => {
		  setNotification(data.Message);

		  if (notificationTimer.current) {
		  	clearTimeout(notificationTimer.current);
		  }

		  notificationTimer.current = setTimeout(() => {
		  	setNotification(null);
		  	notificationTimer.current = null;
		  }, 5000)
		});
	}, []);

	return (
		<>
			{
    		notification && <div className="text-notification">{notification}</div>
			}
		</>
	)
};

export default Notifications;