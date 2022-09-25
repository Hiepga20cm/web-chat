import React from 'react';
import { useState } from 'react';
import authApi from '../../api/authApi';
import { Link } from 'react-router-dom';
//import { GoogleLogin } from 'react-google-login';
import './Login.css';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const clientId = '12782240243-rccmn1g2bg9ulfi8ghsqesbv2udgephi.apps.googleusercontent.com';

const Login = () => {

  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [user, setUser] = useState({});
  const [checklg, setCheckLg] = useState(false);


  async function loginUser(e) {
    e.preventDefault();

    try {
      const res = await authApi.login({
        userName: userName,
        passWord: passWord
      });

      if (res.status === 'ok') {
        localStorage.setItem('token', res.user);
        localStorage.setItem('permission', res.permission);
        window.location.reload();
        alert('Đăng nhập thành công');
      } else {
        alert('Đăng nhập thất bại');
        //window.location.reload();
      }

    } catch (error) {
      console.log(error);
    }

  }
  function handleCallbackResponse(response) {
    console.log(response.credential);
    var userObject = jwt_decode(response.credential);
   // console.log(userObject);
    setUser(userObject);
    // console.log(userObject.email);
    setUserName(userObject.email);
    console.log(userObject.sub);
    setPassWord(userObject.sub);
    console.log(userObject.sub);
    // console.log(userObject.jti);
    //loginUser();
    register(userObject);
    if (checklg === false) {
      loginUser();
    }
  }
  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large' }
    )
  }, [])

  async function register(user) {

    try {

      console.log(user);
      const res = await authApi.register({
        userName: user.email,
        passWord: user.sub,
        firstName: user.family_name,
        lastName: user.given_name,
        email: user.email,
        avatar: user.picture
      });

      if (res.status === 'ok') {
        localStorage.setItem('token', res.user);
        localStorage.setItem('permission', res.permission);
        setCheckLg(true);
        window.location.reload();
        alert('Đăng ký thành công');
      } else {
        alert('Đăng ký thất bại');
        window.location.reload();
      }

    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="wrapper">
      <div className="logo">
        <img src="https://res.cloudinary.com/bluecyber/image/upload/v1659776402/bygtkd6vlf6pt1eyzgdh.jpg" alt="" />
      </div>
      <div className="text-center mt-4 name">
        Chat Fun
      </div>
      <form className="p-3 mt-3" onSubmit={loginUser}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input type="text" name="userName" id="userName" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input type="password" name="password" id="pwd" placeholder="Password" value={passWord} onChange={(e) => setPassWord(e.target.value)} />
        </div>
        <button className="btn mt-3" type="onSubmit" >Login</button>
      </form>
      <div className="text-center fs-6">
        <Link to={''}>Forget password?</Link> or <Link to={'/register'}>Sign up</Link>
      </div>
      <div id="signInDiv" ></div>
    </div>
  )
}
export default Login;