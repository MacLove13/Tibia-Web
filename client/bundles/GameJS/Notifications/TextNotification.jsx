import React, { useEffect, useState } from 'react';
import './Notification.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

const Notifications = ({ }) => {
	const [notification, setNotification] = useState(null);
	const socket = GameInstance.init.networkSystem.GetSocket();

	useEffect(() => {
		socket.on("character:textNotification", (data) => {
		  setNotification(data.Message);

		  setTimeout(() => {
		  	setNotification(null);
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