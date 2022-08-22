import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import chatApi from '../../api/chatRequest';
import ChatBox from '../ChatBox/ChatBox';
import Conversation from '../Conversation/Conversation';
import LogoSearch from '../LogoSearch/LogoSearch';
import NavIcons from '../NavIcons/NavIcons';
import { io } from 'socket.io-client';
import './Chat.css';
const Chat = () => {
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [userCurrent, setUserCurrent] = useState({});
  const [currentChat, setCurrentChat] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    const getUserCurrent = async () => {
      try {
        const data = await chatApi.getUser();
        if (data) {
          setUserCurrent(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserCurrent();

  }, [])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const data = await chatApi.getConversation(userCurrent._id);
        if (data) {
          setConversations(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getConversation();
  }, [userCurrent._id])

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", userCurrent._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [userCurrent]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    //console.log('data la trong nay')
    socket.current.on("recieve-message", (data) => {
      //console.log(data);
      setReceivedMessage(data);
    }
    );
  });


  const checkOnlineStatus = (conversations) => {
    const chatMember = conversations.recipients.find((member) => member !== userCurrent._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  return (
    <div className='Chat'>
      {/*Left side */}
      <div className='Left-side-chat'>
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className='Chat-list'>
            {conversations.map(conversation => (
              <div key={conversation.id} onClick={() => setCurrentChat(conversation)}>
                <Conversation data={conversation} currentUserId={userCurrent._id} online={checkOnlineStatus(conversation)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='Right-side-chat'>
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox data={currentChat}
          currentUserId={userCurrent._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage} />
      </div>
    </div>
  )
}

export default Chat
