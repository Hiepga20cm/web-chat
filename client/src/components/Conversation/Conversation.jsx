import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import chatApi from '../../api/chatRequest';

const Conversation = ({ data, currentUserId, online }) => {
    const [userData, setUserData] = useState({});

    useEffect(() => {

        const getUserData = async () => {
            const userId = await data.recipients.find((id) => id !== currentUserId)
            try {
                const data = await chatApi.getUserById(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        }
        if (data !== null) getUserData();
    }, [data, currentUserId]);

    return (
        <>
            <div className='follower conversation'>
                <div>
                {online && <div className="online-dot"></div>}
                    <img src={`${userData.avatar}`} alt="" className='followerImage' style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <div className='name' style={{ fontSize: '0.8rem' }}>
                        <span>{userData.lastName} </span>
                        <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
                    </div>
                </div>
            </div>
            <hr style={{ width: '85%', border: '0.1px solid #ececec' }} />

        </>
    )
}

export default Conversation
