import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import chatApi from "../../api/chatRequest";
import ChatBox from "../ChatBox/ChatBox";
import Conversation from "../Conversation/Conversation";
import LogoSearch from "../LogoSearch/LogoSearch";
import NavIcons from "../NavIcons/NavIcons";
import { io } from "socket.io-client";
import "./Chat.css";
const Chat = () => {
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [userCurrent, setUserCurrent] = useState({});
  const [currentChat, setCurrentChat] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [searchUserList, setSearchUserList] = useState(null);
  const [shouldOpenUserInfoDialog, setShouldOpenUserInfoDialog] =
    useState(false);
  const [receiverInfo, setReceiverInfo] = useState({});
  const [friendAll, setFriendAll] = useState([]);
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
    };
    getUserCurrent();
  }, []);

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
    };
    getConversation();
  }, [userCurrent._id]);

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
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });
  });

  //Get friend all
  useEffect(() => {
    const getFriendAll = async () => {
      try {
        const data = await chatApi.getFriendList();
        if (data) {
          setFriendAll(data?.friends);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFriendAll();
  }, []);

  const checkOnlineStatus = (conversations) => {
    const chatMember = conversations.recipients.find(
      (member) => member !== userCurrent._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleChangeSearchKeyWord = (e) => {
    const userName = e.target.value;
    const searchUser = async () => {
      try {
        const data = await chatApi.getUserByUserName(userName);
        setSearchUserList(data.user);
      } catch (err) {
        console.log(err);
        setSearchUserList(null);
      }
    };
    searchUser();
  };

  const getUserData = async (data, currentUserId) => {
    const userId = await data.recipients.find((id) => id !== currentUserId);
    try {
      const data = await chatApi.getUserById(userId);
      setReceiverInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateMessage = (receiver) => {
    let obj = {
      sender: userCurrent._id,
      recipient: receiver._id,
      text: "Hello",
      media: [],
    };

    const getConversation = async () => {
      try {
        const data = await chatApi.getConversation(userCurrent._id);
        if (data) {
          setConversations(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const createMessage = async () => {
      try {
        chatApi.createMessage(obj);
        setSearchUserList(null);
      } catch (err) {
        console.log(err);
      }
    };
    createMessage();
    getConversation();
  };

  return (
    <div
      className="row container"
      style={{
        maxWidth: "100%",
        height: "100vh",
        margin: "0",
        padding: "0 12px",
      }}
    >
      {/*Left side */}
      {/* <div className="Left-side-chat">
          <LogoSearch />
          <div className="Chat-container">
            <h2>Chats</h2>
            <div className="Chat-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setCurrentChat(conversation)}
                >
                  <Conversation
                    data={conversation}
                    currentUserId={userCurrent._id}
                    online={checkOnlineStatus(conversation)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div> */}
      <div className="col-3">
        <div className="row justify-content-center align-items-center">
          <div className="col-3">
            <img src="/Image/Ellipse 16.svg" alt="" />
            <img src="/Image/Ellipse 15.svg" alt="" />
            <img src="/Image/Ellipse 14.svg" alt="" />
          </div>
          <div className="col-9 d-flex justify-content-end">
            <div className="btn btn-default" style={{ boxShadow: "none" }}>
              <img className="edit" src={"./Image/Edit.svg"} alt="" />
            </div>

            <div className="btn btn-default" style={{ boxShadow: "none" }}>
              <img src="./Image/Expand_down.svg" alt="" />
            </div>
          </div>
        </div>
        <div
          className="row justify-content-center align-items-center"
          style={{ position: "relative" }}
        >
          <div className="col-12">
            <div className="search-box">
              <div className="search">
                <div className="search-field">
                  <div className="search-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="search-input"
                    name="search-input"
                    placeholder="Search or start new chat"
                    onChange={(e) => handleChangeSearchKeyWord(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-12"
            style={
              searchUserList
                ? {
                    position: "absolute",
                    top: "110%",
                    left: "0",
                    width: "100%",
                    maxHeight: "400px",
                    padding: "20px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    background: "#fff",
                  }
                : {}
            }
          >
            {searchUserList
              ? searchUserList?.map((user) => (
                  <div
                    key={user._id}
                    className="row justify-content-center align-items-center"
                    style={{ background: "#fff" }}
                    onClick={() => handleCreateMessage(user)}
                  >
                    <div className="col-12 user-wrapper">
                      <div
                        className="d-flex align-items-center"
                        style={{ padding: "10px 0" }}
                      >
                        <div className="user-thumbnail">
                          <div
                            className="user-avt"
                            style={{
                              background: `url(${user?.avatar}) top center / cover no-repeat`,
                            }}
                          ></div>
                        </div>
                        <div className="user-meta">
                          <div className="username">{user?.fullName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="col-12">
            <div className="status-box">
              <div className="row">
                <div className="col-12">
                  <div className="status-title text-uppercase justify-content-start">
                    status
                  </div>
                </div>
              </div>
              <div className="status-users">
                <div className="status-user">
                  {friendAll?.map((friend, index) => {
                    return (
                      <div className="user-item" key={index}>
                        <div className="user-thumbnail d-flex justify-content-center">
                          <div
                            className="user-image"
                            style={{
                              background: `url(${friend?.avatar}) top center / cover no-repeat`,
                            }}
                          ></div>
                        </div>
                        <div className="user-name text-center">
                          {friend?.lastName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="col-12 ">
            <div className="allchats" style={{ margin: "26px 0 0" }}>
              <div className="row">
                <div className="col-12">
                  <div className="status-title text-uppercase justify-content-start">
                    ALL CHATS
                  </div>
                </div>
              </div>
              {conversations.map((conversation) => (
                <>
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setCurrentChat(conversation);
                      getUserData(conversation, userCurrent._id);
                    }}
                  >
                    <Conversation
                      data={conversation}
                      currentUserId={userCurrent._id}
                      online={checkOnlineStatus(conversation)}
                    />
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={shouldOpenUserInfoDialog ? "col-6" : "col-9"}>
        {/* <div style={{ width: "20rem", alignSelf: "flex-end" }}>
            <NavIcons />
          </div> */}
        <ChatBox
          data={currentChat}
          currentUserId={userCurrent._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          shouldOpenUserInfoDialog={() =>
            setShouldOpenUserInfoDialog(!shouldOpenUserInfoDialog)
          }
        />
      </div>
      {shouldOpenUserInfoDialog ? (
        <div className="col-3">
          <div className="contact-wrapper">
            <div className="row justify-content-center align-items-center g-2">
              <div className="col-12">
                <div className="contact-header d-flex align-items-center">
                  <div
                    className="contact-icon"
                    onClick={() => setShouldOpenUserInfoDialog(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                    </svg>
                  </div>
                  <div className="contact-title">Contact info</div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-4">
                <div
                  className="contact-image"
                  style={{
                    background: `url(${receiverInfo?.avatar}) top center / cover no-repeat`,
                  }}
                ></div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="contact-name">{receiverInfo?.fullName}</div>
                <div className="contact-status">Online</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div className="contact-facetime">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-camera-video-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"
                    />
                  </svg>
                </div>
                <div className="contact-call">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-telephone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="about-wrapper">
                  <div className="about-title">About</div>
                  <div className="about-content">
                    Hello My name is Đăng and I'm handsome
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="media-wrapper">
                  <div className="media-title">Media,links and doc</div>
                  <div className="media-content d-flex flex-wrap">
                    <div className="media-item"></div>
                    <div className="media-item"></div>
                    <div className="media-item"></div>
                    <div className="media-item"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="action-wrapper">
                  <div className="action-item d-flex">
                    <div className="action-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-slash-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z" />
                      </svg>
                    </div>
                    <div className="action-name">Block Nghiêm Đăng</div>
                  </div>
                  <div className="action-item d-flex">
                    <div className="action-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-hand-thumbs-down"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
                      </svg>
                    </div>
                    <div className="action-name">Report Nghiêm Đăng</div>
                  </div>
                  <div className="action-item d-flex">
                    <div className="action-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                      </svg>
                    </div>
                    <div className="action-name">Delete chat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Chat;
