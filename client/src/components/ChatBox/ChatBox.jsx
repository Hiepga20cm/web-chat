import React, { useState, useEffect, useRef } from 'react'
import chatApi from '../../api/chatRequest';
import InputEmoji from 'react-input-emoji';
import './ChatBox.css';
import { format } from "timeago.js";
import CryptoJS from "react-native-crypto-js";//mahoa

const P = 23, G = 6;
const token = localStorage.getItem('token');
// let publicKeyA = ((G ** (token.length)) % P);
//let secretKey = publicKeyA ** (token.length);

console.log('1')

const ChatBox = ({ data, currentUserId, setSendMessage, receivedMessage }) => {
    const [userData, setUserData] = useState({});
    const [check, setCheck] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [publicKey, setPublicKey] = useState('');
    // console.log('day la tin nhan', setSendMessage);
    console.log(currentUserId);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userId = await data.recipients.find((id) => id !== currentUserId)
                const data1 = await chatApi.getUserById(userId);
                if (data1) {

                    setUserData(data1);
                    setCheck(true);

                }
            } catch (error) {
                console.log(error);
            }
        }
        if (data !== null) { getUserData(); }
    }, [data, currentUserId]);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await chatApi.getMessages(data._id);
                if (messages) {
                    setMessages(messages);
                    console.log('2')
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [data]);

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }
    // Send Message
    const handleSend = async (e) => {
        e.preventDefault();

        const receiverId = data.recipients.find((id) => id !== currentUserId);
        console.log('3');
        let ciphertext = CryptoJS.AES.encrypt(newMessage, 'khoa by mat dung chung').toString();//ma hoa
        const publicKeyA = ((G ** (token.length)) % P);

        //console.log(currentUserId.length)
        const message = {
            sender: currentUserId,
            text: ciphertext,
            conversation: data._id,
            recipient: receiverId,
            // khóa công khai của người gửi x = (5^a mod 23) = 4  (a : khoa bi mat nguoi gui)
            // người nhận lấy khóa bí mật của mình tìm ra khóa bí mật chung // giả sử khóa bí mật a= 6
            publicKeyA: publicKeyA
        }
        // send message to socket server
        setSendMessage({ ...message, receiverId })
        try {
            const data = await chatApi.addMessage(message);
            if (data) {
                setMessages([...messages, data]);
                setNewMessage("");
                console.log('4')
            }
        }
        catch
        {
            console.log("error")
        }
    }

    // Receive Message from parent component
    useEffect(() => {

        //console.log("Message Arrived: ", receivedMessage)
        if (receivedMessage !== null && receivedMessage.conversation === data._id) {
            setMessages(prev => [...prev, receivedMessage]);
        }
        console.log('5')
    }, [receivedMessage, data])

    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const scroll = useRef();
    const imageRef = useRef();

    const decryptOwn = (e) => {

        //if()// lấy độ dài mật khẩu để làm khóa bí mật khóa bí mật của server là 
        //const differ = tokena.length + (tokenb.length + secret.length)
        
        let bytes = CryptoJS.AES.decrypt(e, 'khoa by mat dung chung');
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log(originalText);
        return originalText;

    }

    const decryptOthers = (e) => {

        //if()// lấy độ dài mật khẩu để làm khóa bí mật khóa bí mật của server là 
        //const differ = tokena.length + (tokenb.length + secret.length)

        let bytes = CryptoJS.AES.decrypt(e, 'khoa by mat dung chung');
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log(originalText);
        return originalText;

    }

    return (
        <>
            <div className='ChatBox-container'>
                {check && (
                    <>
                        <div className="chat-header">
                            <div className="follower">
                                <div>
                                    <div className='online-dot'></div>
                                    <img src={`${userData.avatar}`} alt="" className='folloerImage' style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                    <div className='name' style={{ fontSize: '0.8rem' }}>
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
                        </div>



                        {/* chat box messages */}
                        <div className='chat-body'>
                            {messages.map((message) => (
                                <div key={message.id} ref={scroll} className={(message.sender === currentUserId) ? "message own" : "message"}>
                                    <span>{(message.sender === currentUserId) ? decryptOwn(message.text) : decryptOthers(message.text)}</span>{" "}
                                    <span>{format(message.createdAt)}</span>
                                </div>
                            ))}
                        </div>

                        {/*chat sender */}
                        <div className="chat-sender">
                            <div onClick={() => imageRef.current.click()}>+</div>
                            <InputEmoji value={newMessage} onChange={handleChange} />
                            <div className="send-button button" style={{ cursor: 'pointer' }} onClick={handleSend}>Send</div>
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
export default ChatBox
