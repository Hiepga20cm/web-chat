import React from 'react';
import { Navigate } from 'react-router-dom';
const Landing = () => {
    return <Navigate replace={true} to='/chat' />;
}

export default Landing;
