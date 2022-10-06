import React from "react";
import { useState } from "react";
import authApi from "../../api/authApi";
import { Link } from "react-router-dom";
//import { GoogleLogin } from 'react-google-login';
import "./Login.css";
import { useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const clientId =
  "12782240243-rccmn1g2bg9ulfi8ghsqesbv2udgephi.apps.googleusercontent.com";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [user, setUser] = useState({});
  const [checklg, setCheckLg] = useState(false);

  async function loginUser(e) {
    e.preventDefault();

    try {
      const res = await authApi.login({
        userName: userName,
        passWord: passWord,
      });

      if (res.status === "ok") {
        localStorage.setItem("token", res.user);
        localStorage.setItem("permission", res.permission);
        window.location.href = "/chat";
      } else {
        toast.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
    }
  }
  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    setUserName(userObject.email);
    setPassWord(userObject.sub);
    register(userObject);
    if (checklg === false) {
      loginUser();
    }
  }
  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  async function register(user) {
    try {
      const res = await authApi.register({
        userName: user.email,
        passWord: user.sub,
        firstName: user.family_name,
        lastName: user.given_name,
        email: user.email,
        avatar: user.picture,
      });

      if (res.status === "ok") {
        localStorage.setItem("token", res.user);
        localStorage.setItem("permission", res.permission);
        setCheckLg(true);

        window.location.reload();
        alert("Đăng ký thành công");
      } else {
        alert("Đăng ký thất bại");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <ValidatorForm onSubmit={loginUser}>
              <TextValidator
                className="form-control form-control-lg mb-4"
                variant="outlined"
                label="UserName"
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                name="userName"
                value={userName === "" ? null : userName}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                className="form-control form-control-lg mb-4"
                variant="outlined"
                label="Password"
                type="password"
                onChange={(e) => setPassWord(e.target.value)}
                name="password"
                value={passWord === "" ? null : passWord}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <div className="d-flex justify-content-around align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="form1Example3"
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    {" "}
                    Remember me{" "}
                  </label>
                </div>
                <Link to={"/register"}>Register?</Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Login
              </button>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>

              <div
                className="btn btn-primary btn-lg btn-block w-100"
                style={{ backgroundColor: "#3b5998" }}
                role="button"
                id="signInDiv"
              >
                <i className="fab fa-facebook-f me-2"></i>Continue with Google
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
