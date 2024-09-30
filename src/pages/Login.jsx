import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import navBrand from "../assets/nav_brand.png";
import studentLogo from "../assets/student.png";
import teacherLogo from "../assets/teacher.png";
import adminLogo from "../assets/admin.png";
import { toast } from "react-hot-toast";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input";
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
} from "../utils/firebase.utils";

const Login = () => {
  const navigate = useNavigate();

  const [emailState, setEmailState] = useState(true);
  const [numberState, setNumberState] = useState(false);
  const [otpState, setOtpState] = useState(false);
  const [number, setNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  const handleRoleSelection = (role) => {
    localStorage.setItem("role", role);
    setSelectedRole(role);
  };

  let jsonData = {
    email: "",
    password: "",
    role: "",
  };

  function emailLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = localStorage.getItem("role");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    // Check if email is in a valid format
    if (!emailPattern.test(email)) {
      toast.error(
        "Please enter a valid email (must include '@' and a valid domain)."
      );
      return;
    }

    // Check if password is blank or less than 5 characters
    if (!password || password.length < 5) {
      toast.error("Password must be at least 5 characters long.");
      return;
    }

    const jsonData = {
      email,
      password,
      role,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    };

    // Make the fetch request with the provided options
    fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/login?loginMethod=CUSTOM_EMAIL_PASSWORD`,
      options
    ).then(async (response) => {
      let resp = await response.json();
      console.log(resp);

      if (resp.success) {
        toast.success(resp.message);
        localStorage.setItem("userId", resp.userId);
        localStorage.setItem("token", resp.token);
        navigate("/dashboard");
      } else {
        toast.error(resp.message);
      }
    });
  }

  async function googleLogin() {
    const response = await signInWithGooglePopup();
    console.log(response);
    if (response?.user) {
      jsonData = {
        displayName: response.user.displayName,
        email: response.user.email,
        externalUid: response.user.uid,
        photoURL: response.user.photoURL,
        role: localStorage.getItem("role"),
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(jsonData),
      };

      fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login?loginMethod=GOOGLE`,
        options
      ).then(async (response) => {
        let resp = await response.json();
        console.log(resp);

        if (resp.success) {
          toast.success(resp.message);
          localStorage.setItem("userId", resp.userId);
          localStorage.setItem("token", resp.token);
          navigate("/dashboard");
        } else {
          toast.error(resp.message);
        }
      });
    }
  }

  async function facebookLogin() {
    const response = await signInWithFacebookPopup();
    console.log(response);
    if (response?.user) {
      jsonData = {
        displayName: response.user.displayName,
        email: response.user.email,
        externalUid: response.user.uid,
        photoURL: response.user.photoURL,
        role: localStorage.getItem("role"),
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
          accept: "*/*",
        },
        body: JSON.stringify(jsonData), // Convert JSON data to a string and set it as the request body
      };

      // Make the fetch request with the provided options
      fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login?loginMethod=FACEBOOK`,
        options
      ).then(async (response) => {
        let resp = await response.json();
        console.log(resp);

        if (resp.success) {
          toast.success(resp.message);
          localStorage.setItem("userId", resp.userId);
          localStorage.setItem("token", resp.token);
          navigate("/dashboard");
        } else {
          toast.error(resp.message);
        }
      });
    }
  }

  function mobileLogin(params) {
    const phoneNumber = parsePhoneNumber(number);

    if (params === "mobile" && phoneNumber) {
      const options = {
        method: "GET",
        headers: {
          accept: "*/*", // Set content type to JSON
        },
      };

      fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/generateOtp?mobileNumber=${phoneNumber.nationalNumber}&countryCode=${phoneNumber.countryCallingCode}&loginSignUp=SIGNUP`,
        options
      ).then(async (response) => {
        let resp = await response.json();
        console.log(resp);

        if (resp.status === "Success") {
          toast.success(resp.message);
          setOtpState(true);
          setNumberState(false);
          setEmailState(false);
        } else {
          toast.error(resp.message);
          setNumberState(false);
          setEmailState(true);
          setOtpState(false);
        }
      });
    } else {
      jsonData = {
        countryCode: phoneNumber.countryCallingCode,
        mobile: phoneNumber.nationalNumber,
        otp: document.getElementById("otp").value,
        role: localStorage.getItem("role"),
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
          accept: "*/*",
        },
        body: JSON.stringify(jsonData), // Convert JSON data to a string and set it as the request body
      };

      // Make the fetch request with the provided options
      fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login?loginMethod=MOBILE_OTP`,
        options
      ).then(async (response) => {
        let resp = await response.json();
        console.log(resp);

        if (resp.success) {
          toast.success(resp.message);
          localStorage.setItem("userId", resp.userId);
          localStorage.setItem("token", resp.token);
          navigate("/dashboard");
        } else {
          toast.error(resp.message);
        }
      });
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    document.querySelectorAll("button, input").forEach((value) => {
      value.classList.add("shadow-none");
    });

    localStorage.setItem("role", "STUDENT");
  }, []);

  return (
    <div className="logIn">
      <div className="imgContainer">
        <div className="imgBotom">
          <div>
            <h4>24X7 Availability</h4>
            <p>Get help anytime, anywhere</p>
          </div>

          <div>
            <h4>24X7 Availability</h4>
            <p>Get help anytime, anywhere</p>
          </div>

          <div>
            <h4>24X7 Availability</h4>
            <p>Get help anytime, anywhere</p>
          </div>

          <div>
            <h4>24X7 Availability</h4>
            <p>Get help anytime, anywhere</p>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <nav class="navbar " style={{ backgroundColor: "#A314D5" }}>
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <img
                src={navBrand}
                alt="Logo"
                style={{ height: "60px" }}
                class="d-inline-block align-text-top"
              />
            </a>
          </div>
        </nav>

        <div className="roleDiv">
          <ul class="list-group">
            <li
              className="list-group-item"
              onClick={() => handleRoleSelection("STUDENT")}
            >
              <div>
                <img src={studentLogo} alt="Student" />
                <label className="form-check-label" htmlFor="studentRadio">
                  Student
                </label>
              </div>
              <input
                className="form-check-input me-1"
                type="radio"
                name="listGroupRadio"
                value="STUDENT"
                id="studentRadio"
                checked={selectedRole === "STUDENT"}
                readOnly
              />
            </li>

            <li
              className="list-group-item"
              onClick={() => handleRoleSelection("TUTOR")}
            >
              <div>
                <img src={teacherLogo} alt="Tutor" />
                <label className="form-check-label" htmlFor="tutorRadio">
                  Tutor
                </label>
              </div>
              <input
                className="form-check-input me-1"
                type="radio"
                name="listGroupRadio"
                value="TUTOR"
                id="tutorRadio"
                checked={selectedRole === "TUTOR"}
                readOnly
              />
            </li>

            <li
              className="list-group-item"
              onClick={() => handleRoleSelection("ADMIN")}
            >
              <div>
                <img src={adminLogo} alt="Admin" />
                <label className="form-check-label" htmlFor="adminRadio">
                  Admin
                </label>
              </div>
              <input
                className="form-check-input me-1"
                type="radio"
                name="listGroupRadio"
                value="ADMIN"
                id="adminRadio"
                checked={selectedRole === "ADMIN"}
                readOnly
              />
            </li>
          </ul>
        </div>

        {emailState ? (
          <div className="formDiv" style={{ paddingBottom: "1rem" }}>
            <div>
              <h3>Sign In To InstaXpert</h3>
              <p className="form-label text-muted">
                Enter your details to proceed future
              </p>
            </div>

            <div className="socialDiv">
              <button className="btn btn-sm btn-light" onClick={googleLogin}>
                <i class="bi bi-google"></i> Google
              </button>
              <button className="btn btn-sm btn-light" onClick={facebookLogin}>
                <i class="bi bi-facebook"></i> Facebook
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={() => {
                  setEmailState(false);
                  setNumberState(true);
                }}
              >
                <i class="bi bi-phone-fill"></i> Mobile OTP
              </button>
            </div>

            <div class="divider d-flex align-items-center">
              <p class="text-center  mx-3 mb-0 text-muted">
                or login with email
              </p>
            </div>

            <div className="emailDiv">
              <div class="mb-3">
                <label for="email" class="form-label">
                  Email ID*
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                />
              </div>
              <div class="mb-3 position-relative">
                <label for="password" class="form-label">
                  Password*
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                />
                <i
                  onClick={togglePasswordVisibility}
                  class={`${
                    passwordVisible ? "bi bi-eye" : "bi bi-eye-slash"
                  } position-absolute`}
                  id="togglePassword"
                  style={{ right: "20px", top: "46px", cursor: "pointer" }}
                ></i>
              </div>

              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="mb-4"
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="gridCheck"
                  />
                  <label class="form-check-label" for="gridCheck">
                    Remember for 30 days
                  </label>
                </div>
                <a
                  onClick={() =>
                    toast.error(
                      <>
                        To reset your password.
                        <br />
                        please use our mobile app.
                        <br />
                        Thank you for your understanding!
                      </>
                    )
                  }
                  className="form-label"
                >
                  Forgot password?
                </a>
              </div>

              <button
                className="btn mb-3 btn-dark shadow-none"
                style={{ width: "100%" }}
                onClick={emailLogin}
              >
                LOGIN
              </button>
              <p className="form-label">
                Don't have an account?{" "}
                <a
                  onClick={() =>
                    toast.error(
                      <>
                        Sign Up Unavailable on Web.
                        <br />
                        To create an account, please use our mobile app.
                        <br />
                        Thank you for your understanding!
                      </>
                    )
                  }
                  className="text-dark text-underline"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        ) : numberState ? (
          <div className="formDiv" style={{ paddingTop: "5rem" }}>
            <h3 style={{ fontWeight: "700" }}>
              Verify your mobile number to continue
            </h3>

            <div class="col-12">
              <label className="form-label">Mobile number*</label>

              <PhoneInput
                placeholder="Enter mobile number"
                value={number}
                onChange={setNumber}
                defaultCountry="IN"
                onCountryChange={(e) => console.log(e)}
              />

              <button
                className="btn btn-dark mt-4 shadow-none"
                style={{ width: "100%", height: "46px" }}
                onClick={() => {
                  mobileLogin("mobile");
                }}
              >
                SEND
              </button>
            </div>
          </div>
        ) : (
          <div className="formDiv" style={{ paddingTop: "5rem" }}>
            <h3 style={{ fontWeight: "700" }}>
              Enter OTP to verify <br />
              mobile number
            </h3>

            <div class="col-12">
              <input
                type="text"
                className="form-control"
                id="otp"
                placeholder="123456"
              />

              <button
                className="btn btn-dark mt-4"
                style={{ width: "100%" }}
                onClick={() => {
                  mobileLogin("otp");
                }}
              >
                VERIFY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
