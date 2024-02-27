import React, { useState, useEffect } from 'react';
import './style.scss';

import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';

import ChatMessages from 'bundles/GameJS/GameChat/components/ChatMessages';

const PLAYER_INFO_SIZE = 201;

const GameChat = ({ Init }) => {
	const socket = GameInstance.init.networkSystem.GetSocket();
	const [inputText, setInputText] = useState("");
	const [chatWidth, setChatWidth] = useState(window.innerWidth - PLAYER_INFO_SIZE);
	const [conversations, setConversations] = useState([]);
	const [activeConversationId, setActiveConversationId] = useState(-1);
	const [disabledInputText, setDisabledInputText] = useState(true);

	useEffect(() => {
	  socket.on("chat:sendMessage", (data) => {
	    setConversations(prevChats => {
	      const existentConversationIndex = prevChats.findIndex(channel => channel.id == data.id);

	      if (existentConversationIndex !== -1) {
	        let updatedChats = [...prevChats];
	        updatedChats[existentConversationIndex] = {
	          ...updatedChats[existentConversationIndex],
	          messages: [...updatedChats[existentConversationIndex].messages, ...data.messages]
	        };
	        return updatedChats;
	      } else {

	      	if (data.id == 0) {
	      		setActiveConversationId(0);
	      		setDisabledInputText(false);
	      	}

	        return [
	          ...prevChats,
	          {
	            id: data.id,
	            name: data.name,
	            messages: data.messages
	          }
	        ];
	      }
	    });
	  });
	}, [socket]);


  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const openChat = (chatId) => {
  	setActiveConversationId(chatId);
  };

  const changeActiveConversation = (conversationId) => {
  	setActiveConversationId(conversationId);
  };

  const inputKeyPress = (e) => {
  	var key = e.keyCode || e.which;
  	if (key != 13) return;
  	if (inputText.length < 1) return;
  	if (inputText[0] == "!") {
      let text = inputText.substring(1);
      let strline = text.split(" ");
      let command = strline[0];
      let args = strline.slice(1);

      GameInstance.init.networkSystem.EmitServer("chat:command:execute", {
          cmd: command,
          args: args
      });
      setInputText("");
      return
    }

  	GameInstance.init.networkSystem.EmitServer("chat:sendMessage", {
  		chatId: activeConversationId,
  		message: inputText
	  });
  	setInputText("");
  };

  const findChatById = (chatId) => {
  	return conversations.find(channel => channel.id == chatId)
  };

  useEffect(() => {
    function handleResize() {
      setChatWidth(window.innerWidth - PLAYER_INFO_SIZE);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

	return (
		<div style={{ width: `${chatWidth}px` }} className="chat-container">
			<div className="conversations">
					<ul className="list">
						{conversations.map((channel, index) => (
	            <li key={index} onClick={() => openChat(channel.id)}>{channel.name}</li>
	          ))}
					</ul>

					<div className="chat-box">
						<div className="conversation">
							<ChatMessages conversation={findChatById(activeConversationId)} />
						</div>

						<input
							id="ChatInput"
							type="text"
							className="chat-input"
							onChange={handleChange}
							onKeyPress={inputKeyPress}
							value={inputText}
							disabled={disabledInputText}
						/> 
					</div>
			</div>
		</div>
	);
};

export default GameChat;