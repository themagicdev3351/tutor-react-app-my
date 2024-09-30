import React, { useEffect, useRef, useState } from "react";

import { useContext } from "react";
import { MyContext } from "../MyContext";

import avatarFinal from "../assets/avatar_final.png";

import icon from "../assets/Icon.png";
import icon2 from "../assets/Icon2.png";
import image from "../assets/Image.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "../utils/firebase.utils";

const TopNav = () => {
  const { imgSrc, setImgSrc } = useContext(MyContext);

  const [notifications, setNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const [data, setData] = useState([]);

  const [type, setType] = useState("all");

  const [request, setRequest] = useState(false);

  const [issue, setIssue] = useState(false);

  const navigate = useNavigate();

  function convertTo12HourFormat(time24) {
    // Split the input string into hours and minutes
    let [hours, minutes] = time24.split(":");

    // Convert the hours and minutes to numbers
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Determine the AM/PM period
    let period = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Combine hours, minutes, and period
    return `${hours}:${minutes} ${period}`;
  }

  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      jwtToken: localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/common/user/profile?userId=${localStorage.getItem(
        "userId"
      )}&role=${localStorage.getItem("role")}`,
      options
    ).then(async (response) => {
      let resp = await response.json();
      // console.log(resp);

      setImgSrc({
        picSrc: resp.profilePic,
        fullName: resp.firstName + " " + resp.lastName,
        timezone: resp.timezone,
      });

      if (resp.message === "Invalid Token") {
        fetch(
          `${
            process.env.REACT_APP_API_URL
          }/api/auth/refreshToken?userId=${localStorage.getItem("userId")}`,
          options
        ).then(async (response) => {
          let resp = await response.json();

          if (resp.token) {
            localStorage.setItem("token", resp.token);
            window.location.reload();
          }
        });
      }
    });

    fetch(
      `${process.env.REACT_APP_API_URL}/history?userId=${localStorage.getItem(
        "userId"
      )}`,

      {
        method: "POST",
        headers: {
          jwtToken: localStorage.getItem("token"),
          accept: "*/*",
        },
      }
    ).then(async (response) => {
      const resp = await response.json();

      // console.log(resp);

      if (response.status === 200) {
        resp.forEach((val) => {
          if (val.notificationType === "LESSON_REQUEST") {
            setRequest(true);
          } else if (val.notificationType === "LESSON_ISSUE") {
            setIssue(true);
          }
        });
        setData(resp);
      } else {
        setData([]);
      }
    });
  }, []);

  const handleClickOutside = (event) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setNotifications(false);
    }
  };

  useEffect(() => {
    if (notifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifications]);

  useEffect(() => {
    const messaging = getMessaging(firebaseApp);

    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          await retrieveToken(messaging);
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    const retrieveToken = async (messaging) => {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          await registerToken(currentToken);
        } else {
          console.log("No registration token available.");
        }
      } catch (error) {
        console.error("An error occurred while retrieving token:", error);
      }
    };

    requestNotificationPermission();
  }, []);

  const registerToken = async (currentToken) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const apiUrl = `${process.env.REACT_APP_API_URL}/registerToken?userId=${userId}&token=${currentToken}`;

      const response = await fetch(apiUrl, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json",
          jwtToken: `Bearer ${token}`,
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Token registered successfully:", data);
    } catch (error) {
      console.error("Error registering token:", error);
    }
  };

  return (
    <header class="bg-surface-primary border-bottom p-3">
      <div class="container-fluid">
        <div class="mb-npx">
          <div class="row align-items-center justify-content-end">
            <div class="col-sm-6 col-12 text-sm-end">
              <div
                class="mx-n1"
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  justifyContent: "end",
                  position: "relative",
                }}
              >
                <img
                  src={icon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/chat")}
                />

                <div style={{ position: "relative" }}>
                  <i
                    class="bi bi-bell"
                    onClick={() => setNotifications(true)}
                    style={{
                      fontSize: "20px",
                      color: "black",
                      cursor: "pointer",
                    }}
                  ></i>

                  {data.length !== 0 && (
                    <div
                      style={{
                        minWidth: "10px",
                        minHeight: "10px",
                        backgroundColor: "#A314D5",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "8px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "0",
                        left: "9px",
                        padding: "2px",
                      }}
                    >
                      {data.length}
                    </div>
                  )}

                  {notifications && (
                    <div
                      className="notifications"
                      ref={notificationsRef}
                      style={{
                        boxShadow:
                          "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                        width: "340px",

                        height: "550px",

                        position: "absolute",
                        backgroundColor: "white",
                        bottom: "-0.3rem",

                        zIndex: "1000",
                        overflowY: "scroll",
                        padding: "1rem",
                        borderRadius: "7px",

                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <h3>Notifications</h3>

                        <i
                          class="bi bi-x"
                          onClick={() => setNotifications(false)}
                          style={{
                            fontSize: "20px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            background: "white",
                            border: "1px solid rgba(0, 0, 0, 0.3)",
                            padding: "0 6px",
                          }}
                        ></i>
                      </div>

                      <ul
                        class="nav nav-tabs  overflow-x border-0"
                        style={{ marginBottom: "1rem" }}
                      >
                        <li class="nav-item " style={{ marginRight: "0" }}>
                          <a
                            href="#"
                            className={`nav-link ${
                              type === "all" ? "active" : "font-regular"
                            }`}
                            onClick={() => setType("all")}
                            style={{ padding: "0.3rem 0" }}
                          >
                            All
                          </a>
                        </li>

                        <li class="nav-item" style={{ marginRight: "0" }}>
                          <a
                            href="#"
                            className={`nav-link ${
                              type === "request" ? "active" : "font-regular"
                            }`}
                            style={{ padding: "0.3rem 0" }}
                            onClick={() => setType("request")}
                          >
                            Lesson Request
                          </a>
                        </li>

                        <li class="nav-item" style={{ marginRight: "0" }}>
                          <a
                            href="#"
                            className={`nav-link ${
                              type === "issue" ? "active" : "font-regular"
                            }`}
                            style={{ padding: "0.3rem 0" }}
                            onClick={() => setType("issue")}
                          >
                            Lesson Issue
                          </a>
                        </li>
                      </ul>

                      {(!request && type === "request" && data.length !== 0) ||
                      (!issue && type === "issue" && data.length !== 0) ? (
                        <h4
                          style={{
                            textAlign: "center",
                            marginTop: "10rem",
                            opacity: "0.6",
                          }}
                        >
                          No notifications
                        </h4>
                      ) : (
                        ""
                      )}

                      {data.length === 0 ? (
                        <h4
                          style={{
                            textAlign: "center",
                            marginTop: "10rem",
                            opacity: "0.6",
                          }}
                        >
                          No notifications
                        </h4>
                      ) : type === "all" ? (
                        data.map((val) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.5rem",
                                padding: "0.7rem 0",
                              }}
                            >
                              <img
                                src={val.imageUrl ? val.imageUrl : avatarFinal}
                                alt=""
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  border: "1px solid",
                                  objectFit: "cover",
                                }}
                              />

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.5rem",
                                }}
                              >
                                <h5 style={{ fontSize: "14px" }}>
                                  {val.title}
                                </h5>
                                <div
                                  style={{
                                    padding: "0.5rem",
                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {val.body}
                                  </h6>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <p
                                    className="form-label"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {convertTo12HourFormat(
                                      val.createdAt.split("T")[1].slice(0, 5)
                                    )}
                                  </p>{" "}
                                  <p
                                    className="form-label"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {val.createdAt.split("T")[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : type === "request" ? (
                        data.map((val) => {
                          if (val.notificationType === "LESSON_REQUEST") {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.5rem",
                                  padding: "0.7rem 0",
                                }}
                              >
                                <img
                                  src={
                                    val.imageUrl ? val.imageUrl : avatarFinal
                                  }
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    border: "1px solid",
                                    objectFit: "cover",
                                  }}
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <h5 style={{ fontSize: "14px" }}>
                                    {val.title}
                                  </h5>
                                  <div
                                    style={{
                                      padding: "0.5rem",
                                      border: "1px solid rgba(0, 0, 0, 0.2)",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      {val.body}
                                    </h6>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <p
                                      className="form-label"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {convertTo12HourFormat(
                                        val.createdAt.split("T")[1].slice(0, 5)
                                      )}
                                    </p>{" "}
                                    <p
                                      className="form-label"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {val.createdAt.split("T")[0]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return "";
                          }
                        })
                      ) : type === "issue" ? (
                        data.map((val) => {
                          if (val.notificationType === "LESSON_ISSUE") {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.5rem",
                                  padding: "0.7rem 0",
                                }}
                              >
                                <img
                                  src={
                                    val.imageUrl ? val.imageUrl : avatarFinal
                                  }
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    border: "1px solid",
                                    objectFit: "cover",
                                  }}
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <h5 style={{ fontSize: "14px" }}>
                                    {val.title}
                                  </h5>
                                  <div
                                    style={{
                                      padding: "0.5rem",
                                      border: "1px solid rgba(0, 0, 0, 0.2)",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      {val.body}
                                    </h6>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <p
                                      className="form-label"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {convertTo12HourFormat(
                                        val.createdAt.split("T")[1].slice(0, 5)
                                      )}
                                    </p>{" "}
                                    <p
                                      className="form-label"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {val.createdAt.split("T")[0]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return "";
                          }
                        })
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={imgSrc.picSrc ? imgSrc.picSrc : avatarFinal}
                    alt=""
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "10px",
                        fontWeight: "600",
                        lineHeight: "12.6px",
                      }}
                    >
                      Welcome back 👋
                    </p>
                    <h5 style={{ lineHeight: "15.12px", fontSize: "12px" }}>
                      {imgSrc.fullName !== "undefined undefined"
                        ? imgSrc.fullName
                        : "User"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
