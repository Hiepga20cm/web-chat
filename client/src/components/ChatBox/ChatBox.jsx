import React, { useState, useEffect, useRef } from "react";
import chatApi from "../../api/chatRequest";
import InputEmoji from "react-input-emoji";
import "./ChatBox.css";
import { format } from "timeago.js";
import CryptoJS from "react-native-crypto-js"; //mahoa

const P = 23,
  G = 6;
//let secretKey = publicKeyA ** (token.length);

const ChatBox = ({ data, currentUserId, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState({});
  const [check, setCheck] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const privateKey = localStorage.getItem("token");
  let privateKeyA = privateKey.length;

  console.log("--------------");
  console.log(userData);
  //const publicKeyB = ((G ** (userData._id.length)) % P);
  //console.log(publicKeyB)
  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("aaa");
        const userId = await data.recipients.find((id) => id !== currentUserId);
        const data1 = await chatApi.getUserById(userId);
        if (data1) {
          setUserData(data1);
          setCheck(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (data !== null) {
      getUserData();
    }
  }, [data, currentUserId]);

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
    //console.log("Message Arrived: ", receivedMessage)
    if (receivedMessage !== null && receivedMessage.conversation === data._id) {
      setMessages((prev) => [...prev, receivedMessage]);
    }
    console.log("5");
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
    console.log(Key);
    let bytes = CryptoJS.AES.decrypt(e, `${Key}`);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
    return originalText;
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
                        class="bi bi-camera-video-fill"
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
                        class="bi bi-telephone-fill"
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
