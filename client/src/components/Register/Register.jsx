import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';
const Register = () => {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [firsName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');

    async function register(e) {
        e.preventDefault();

        try {
            const res = await authApi.register({
                userName: userName,
                passWord: passWord,
                firsName: firsName,
                lastName: lastName,
                email: email,
                gender: gender
            });
            if (res.status === 'ok') {
                localStorage.setItem('token', res.user);
                localStorage.setItem('permission', res.permission);
                window.location.reload();
                alert('Đăng nhập thành công');
            } else {
                alert('Đăng nhập thất bại');
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
                Chat Fun Register
            </div>
            <form className="p-3 mt-3" onSubmit={register}>
                <div className="form-field d-flex align-items-center">
                    <span className="far fa-user"></span>
                    <input type="text" name="userName" id="userName" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="password" name="password" id="pwd" placeholder="Password" value={passWord} onChange={(e) => setPassWord(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="text" name="firstName" id="pwd" placeholder="First Name" value={firsName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="text" name="lastName" id="pwd" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="email" name="email" id="pwd" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="text" name="lastName" id="pwd" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="text" name="hender" id="pwd" placeholder="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
                </div>

                <button className="btn mt-3" type="onSubmit" >Login</button>
            </form>
            <div className="text-center fs-6">
                <Link to={''}>Forget password?</Link> or <Link to={'/register'}>Sign up</Link>
            </div>
        </div>
    )
}

export default Register
