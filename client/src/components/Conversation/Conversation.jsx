import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import chatApi from "../../api/chatRequest";

const Conversation = ({ data, currentUserId, online, receiverInfo }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const userId = await data.recipients.find((id) => id !== currentUserId);
      try {
        const data = await chatApi.getUserById(userId);
        setUserData(data);
        receiverInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (data !== null) getUserData();
  }, [data, currentUserId]);

  return (
    <>
      {/* <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={`${userData.avatar}`}
            alt=""
            className="followerImage"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span> </span>
            <span style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} /> */}
      <div className="row justify-content-center align-items-center">
        <div className="col-12 user-wrapper">
          <div className="user d-flex">
            <div className="user-thumbnail">
              <div
                className="user-avt"
                style={{
                  background: `url(${userData?.avatar}) top center / cover no-repeat`,
                }}
              ></div>
            </div>
            <div className="user-meta">
              <div className="username">{userData?.fullName}</div>
              <div className="user-content">Thank you very much, I am wait</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
