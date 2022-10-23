import React, { useState, useEffect, useRef } from "react";
import chatApi from "../../api/chatRequest";
import InputEmoji from "react-input-emoji";
import "./ChatBox.css";
import { format } from "timeago.js";
import CryptoJS from "react-native-crypto-js"; //mahoa

const P = 23,
  G = 6;
//let secretKey = publicKeyA ** (token.length);

const ChatBox = ({
  data,
  currentUserId,
  setSendMessage,
  receivedMessage,
  shouldOpenUserInfoDialog,
}) => {
  const [userData, setUserData] = useState({});
  const [check, setCheck] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFriend, setIsFriend] = useState(false);
  const [isFriendRequest, setIsFriendRequest] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const privateKey = localStorage.getItem("token");
  let privateKeyA = privateKey.length;

  //const publicKeyB = ((G ** (userData._id.length)) % P);
  //console.log(publicKeyB)
  const getUserData = async () => {
    try {
      const userId = await data.recipients.find((id) => id !== currentUserId);
      const data1 = await chatApi.getUserById(userId);
      const currentUser = await chatApi.getUserById(currentUserId);

      currentUser?.friends.find((friendId) => friendId === data1._id)
        ? setIsFriend(true)
        : setIsFriend(false);
      currentUser?.friendsRequest.find((friendId) => friendId === data1._id)
        ? setIsFriendRequest(true)
        : setIsFriendRequest(false);
      currentUser?.friendsWaitToAccept.find(
        (friendId) => friendId === data1._id
      )
        ? setIsAccept(true)
        : setIsAccept(false);
      if (data1) {
        setUserData(data1);
        setCheck(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data !== null) {
      getUserData();
    }
  }, [data, currentUserId]);

  useEffect(() => {}, [userData]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await chatApi.getMessages(data._id);
        if (messages) {
          setMessages(messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [data]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const receiverId = data.recipients.find((id) => id !== currentUserId);
    const privateKey = userData._id.length;
    const publicKeyB = G ** privateKey % P;
    const Key = publicKeyB ** privateKeyA % P;
    let ciphertext = CryptoJS.AES.encrypt(newMessage, `${Key}`).toString(); //ma hoa
    //const publicKeyA = ((G ** (token.length)) % P);

    //console.log(currentUserId.length)
    const message = {
      sender: currentUserId,
      text: ciphertext,
      conversation: data._id,
      recipient: receiverId,
      // khóa công khai của người gửi x = (5^a mod 23) = 4  (a : khoa bi mat nguoi gui)
      // người nhận lấy khóa bí mật của mình tìm ra khóa bí mật chung // giả sử khóa bí mật a= 6
    };
    // send message to socket server
    setSendMessage({ ...message, receiverId });
    try {
      const data = await chatApi.addMessage(message);
      if (data) {
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch {
      console.log("error");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend(event);
    }
  };
  // Receive Message from parent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.conversation === data._id) {
      setMessages((prev) => [...prev, receivedMessage]);
    }
  }, [receivedMessage, data]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scroll = useRef();
  const imageRef = useRef();

  const decryptOwn = (e) => {
    //if()// lấy độ dài mật khẩu để làm khóa bí mật khóa bí mật của server là
    //const differ = tokena.length + (tokenb.length + secret.length)

    const privateKey = userData._id.length;
    const publicKeyB = G ** privateKey % P;
    const Key = publicKeyB ** privateKeyA % P;
    let bytes = CryptoJS.AES.decrypt(e, `${Key}`);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };

  const handleAddFriend = (userId) => {
    const addFriend = async () => {
      try {
        await chatApi.addFriend(userId);
        getUserData();
      } catch (error) {
        console.log(error);
      }
    };
    addFriend();
  };

  const handleAccpet = (userId) => {
    const acceptFriend = async () => {
      try {
        await chatApi.acceptFriend(userId);
        getUserData();
      } catch (error) {
        console.log(error);
      }
    };
    acceptFriend();
  };

  return (
    <>
      <div className="box-chat-wrapper">
        {check && (
          <>
            {/* <div className="chat-header">
              <div className="follower">
                <div>
                  <div className="online-dot"></div>
                  <img
                    src={`${userData.avatar}`}
                    alt=""
                    className="folloerImage"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>{userData.lastName} </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div> */}
            <div className="row justify-content-center align-items-center g-2">
              <div className="col-12">
                <div className="box-chat-header d-flex justify-content-between align-items-center">
                  <div className="header-left d-flex">
                  <div className="online-dot"></div>
                    <div
                      className="user-avt"
                      style={{
                        background: `url(${userData?.avatar}) top center / cover no-repeat`,
                      }}
                    ></div>
                    <div className="user-meta">
                      <div className="user-name line-height">
                        {userData.fullName}{" "}
                      </div>
                      <div className="user-status">Online</div>
                    </div>
                  </div>
                  <div className="header-right d-flex">
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
                    <div
                      className="contact-info"
                      onClick={shouldOpenUserInfoDialog}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-info-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                {!isFriend && !isFriendRequest && !isAccept && (
                  <div className="add-friend">
                    <div
                      className="add-friend-btn"
                      onClick={() => handleAddFriend(userData?._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        class="bi bi-person-plus-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path
                          fill-rule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                      <span style={{ marginLeft: "10px" }}>Kết bạn</span>
                    </div>
                  </div>
                )}
                {isFriendRequest && (
                  <div className="add-friend">
                    <div
                      className="add-friend-btn"
                      //onClick={() => handleAddFriend(userData?._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        class="bi bi-person-plus-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path
                          fill-rule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                      <span style={{ marginLeft: "10px" }}>Chờ phản hồi</span>
                    </div>
                  </div>
                )}
                {isAccept && (
                  <div className="add-friend">
                    <div
                      className="add-friend-btn"
                      onClick={() => handleAccpet(userData?._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        class="bi bi-person-plus-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path
                          fill-rule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                      <span style={{ marginLeft: "10px" }}>Đồng ý</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* chat box messages */}
            {/* <div className="chat-body">
              {messages.map((message) => (
                <div
                  key={message.id}
                  ref={scroll}
                  className={
                    message.sender === currentUserId ? "message own" : "message"
                  }
                >
                  <span>{decryptOwn(message.text)}</span>{" "}
                  <span>{format(message.createdAt)}</span>
                </div>
              ))}
            </div> */}
            <div className="row justify-content-center align-items-center g-2">
              <div className="col-12">
                <div className="box-chat">
                  {messages.map((message) => (
                    <div
                      className={
                        message.sender === currentUserId
                          ? "send-wrapper"
                          : "receive-wrapper"
                      }
                    >
                      <div
                        className={
                          message.sender === currentUserId
                            ? "messenger-send"
                            : "messenger-receive"
                        }
                      >
                        <div className="messenger-content-send">
                          {decryptOwn(message?.text)}
                        </div>
                      </div>
                      <div className="time-send">
                        {format(message?.createdAt)}
                      </div>
                    </div>
                  ))}

                  {/* <div className="box-chat-footer">
                    <div className="input-wrapper">
                      <div className="input-icon1">
                        <i className="bi bi-emoji-smile"></i>
                      </div>
                      <input
                        className="input-box"
                        type="text"
                        placeholder="Type a message"
                      />
                      <div className="input-icon2">
                        <i className="bi bi-paperclip"></i>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            {/*chat sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
              />
              <div
                className="send-button button"
                style={{ cursor: "pointer" }}
                onClick={handleSend}
              >
                Send
              </div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
};
export default ChatBox;
