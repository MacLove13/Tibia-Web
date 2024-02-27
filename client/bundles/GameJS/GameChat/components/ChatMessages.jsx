import React, { Fragment, useState, useEffect, useRef } from 'react';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

const ChatMessages = ({ conversation }) => {
	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
	}, [conversation])

	return (
		<>
      {conversation ? (
        <ul>
          {conversation.messages.map((message, index) => (
            <li key={index}>
            	<em>[{message.hour}] </em>
              <strong>{message.sender.name}: </strong>
              {message.message}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      ) : (
        <span />
      )}
    </>
	);
};

export default ChatMessages;