import React from 'react';
import './Notification.scss';


function Notification({ message }) {

  return (
    <div className="notification">
  		{message}
    </div>
  );
}

export default Notification;
