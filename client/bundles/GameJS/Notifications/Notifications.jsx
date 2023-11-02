import React, { useEffect, useState } from 'react';
import './Notification.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';
import GameNotification from './GameNotification';

const Notifications = ({ }) => {
	const [notifications, setNotifications] = useState([]);
	const notificationsToRemove = React.useRef([]);
	const notificationIdRef = React.useRef(0);
  const highestZIndexRef = React.useRef(50000);
	const socket = GameInstance.init.networkSystem.GetSocket();

	useEffect(() => {
		socket.on("character:showNotification", (data) => {
		  notificationIdRef.current++;
		  highestZIndexRef.current++;

		  console.log(data);

		  const newNotification = {
		    Id: notificationIdRef.current,
		    Title: data.Title,
		    Content: data.Content,
		    zIndex: highestZIndexRef.current
		  }

		  setNotifications(prevNotifications => {
		    // Remove notifications that are in the notificationsToRemove ref
		    const updatedPrevNotifications = prevNotifications.filter(notification => 
		      !notificationsToRemove.current.includes(notification.Id)
		    );
		    // Add the new notification to the array of previous notifications
		    return [...updatedPrevNotifications, newNotification];
		  });
		});
	}, []);


  const handleNotificationClick = (nId) => {
    let updatedNotifications = notifications.map(notification => {
        if (notification.Id === nId) {
        		highestZIndexRef.current++;

            return {
                ...notification,
                zIndex: highestZIndexRef.current,
            };
        }
        return notification;
    });
    
    	setNotifications(updatedNotifications);
	};

	const removeNotification = (nId) => {
		if (!notificationsToRemove.current.includes(nId)) notificationsToRemove.current.push(nId);
	};

	return (
		<>
			{ 
    		notifications.length > 0 && 
    		notifications.map((notif) => <GameNotification
    			key={`notification-${notif.Id}`}
    			data={notif}
    			onClick={handleNotificationClick}
    			zIndex={notif.zIndex}
    			closeNotification={removeNotification}
    		/> )
			}

		</>
	)
};

export default Notifications;