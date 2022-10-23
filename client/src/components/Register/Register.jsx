import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../api/authApi";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { MenuItem } from "@mui/material";
import { toast } from "react-toastify";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");

  const genderList = [
    { value: "Female", name: "Female" },
    { value: "Male", name: "Male" },
    { value: "Other", name: "Other" },
  ];

  async function register(e) {
    e.preventDefault();

    try {
      const res = await authApi.register({
        userName: userName,
        passWord: passWord,
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
      });
      if (res.status === "ok") {
        localStorage.setItem("token", res.user);
        localStorage.setItem("permission", res.permission);
        toast.success("Đăng ký tài khoản thành công!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        toast.error("Đăng ký tài khoản thất bại!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Đăng ký tài khoản thất bại!");
      console.log(error);
    }
  }

  return (
    <section className="vh-100" style={{ backgroundColor: "#8fc4b7" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-12 col-lg-12 col-xl-12 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Register
                    </p>

                    <ValidatorForm
                      className="mx-1 mx-md-4 row"
                      onSubmit={register}
                    >
                      <div className="row">
                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <TextValidator
                            className="form-control form-control-lg mb-4 "
                            variant="outlined"
                            label="UserName"
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                            name="userName"
                            value={userName}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </div>

                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <TextValidator
                            className="form-control form-control-lg mb-4"
                            variant="outlined"
                            label="Password"
                            type="password"
                            onChange={(e) => setPassWord(e.target.value)}
                            name="Password"
                            value={passWord}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </div>

                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <TextValidator
                            className="form-control form-control-lg mb-4"
                            variant="outlined"
                            label="First Name"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            name="firstName"
                            value={firstName}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <TextValidator
                            className="form-control form-control-lg mb-4"
                            variant="outlined"
                            label="Last Name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            name="lastName"
                            value={lastName}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <TextValidator
                            className="form-control form-control-lg mb-4"
                            variant="outlined"
                            label="Email"
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            value={email}
                            validators={["required", "isEmail"]}
                            errorMessages={[
                              "this field is required",
                              "email is not valid",
                            ]}
                          />{" "}
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6">
                          <SelectValidator
                            className="form-control form-control-lg mb-4"
                            variant="outlined"
                            label="Gender"
                            onChange={(e) => setGender(e.target.value)}
                            name="gender"
                            value={gender}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          >
                            {genderList.map((gender) => (
                              <MenuItem key={gender.value} value={gender.value}>
                                {gender.name}
                              </MenuItem>
                            ))}
                          </SelectValidator>
                        </div>
                        <div className="form-check d-flex justify-content-center mb-5">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example3c"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form2Example3"
                          >
                            I agree all statements in{" "}
                            <a href="#!">Terms of service</a>
                          </label>
                        </div>
                        <div className="d-flex justify-content-center mb-5 ">
                          <div>
                            <Link
                              to={"/login"}
                              type="submit"
                              className="btn btn-primary btn-lg"
                              style={{ marginRight: "10px" }}
                            >
                              Login
                            </Link>
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </ValidatorForm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
