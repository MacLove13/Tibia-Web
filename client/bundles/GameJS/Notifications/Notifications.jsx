import React, { useEffect, useState } from 'react';
import './Notification.scss';

import Game, { EventType } from 'bundles/GameJS/store/GameInit';
import GameNotification from './GameNotification';



const Notifications = ({ }) => {
	const [notifications, setNotifications] = useState([]);
	const notificationsToRemove = React.useRef([]);
	const notificationIdRef = React.useRef(0);
  const highestZIndexRef = React.useRef(50000);
	const gameInstance = new Game();
	

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

	const GetNotifications = () => {
	    let newNotifications = gameInstance.init.networkSystem.GetNotifications().map((notification) => {

	    	notificationIdRef.current++;
	      highestZIndexRef.current++;

		    return {
		      ...notification,
		      Id: notificationIdRef.current,
		      zIndex: highestZIndexRef.current,
		    };
			});

		  setNotifications(prevNotifications => {
		    // Filtrar para remover a notificação com o idToRemove
		    const updatedPrevNotifications = prevNotifications.filter(notification => !notificationsToRemove.current.includes(notification.Id));
		    // Concatenar as novas notificações
		    return [...updatedPrevNotifications, ...newNotifications];
		  });

	    gameInstance.init.networkSystem.ClearNotifications();
	}

	useEffect(() => {
		const intervalId = setInterval(GetNotifications, 1000);
    	return () => clearInterval(intervalId);
	}, []);

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