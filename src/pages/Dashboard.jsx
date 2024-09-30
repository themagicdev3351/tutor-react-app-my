import { useContext, useEffect, useState } from "react";

import { PageContext } from "../MyContext";

import "../styles/profile.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

import joinIcon from "../assets/join_icon.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import finalAvatar from "../assets/avatar_final.png";

import illustration from "../assets/Illustration.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const { thisPage, setThisPage } = useContext(PageContext);

  const [meetings, setMeetings] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      jwtToken: localStorage.getItem("token"),
    },
  };

  function joinMeeting(params) {
    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/tutor/booking/get-meeting-token?userId=${localStorage.getItem(
        "userId"
      )}&bookingId=${params}&role=${localStorage.getItem("role")}`,
      options
    ).then(async (response) => {
      let resp = await response.json();

      console.log(resp);

      if (resp.success) {
        localStorage.setItem("meetingToken", resp.data.token);

        navigate(`/meetings/${params}`);
      } else {
        toast.error(resp.message);

        document.querySelectorAll(".button-join").forEach((val) => {
          val.lastChild.innerText = "Join Meeting";
        });
      }
    });
  }

  useEffect(() => {
    setThisPage("dashboard");

    if (localStorage.getItem("userId") === null) {
      navigate("/");
    }

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/tutor/booking/session/meetings/today?userId=${localStorage.getItem(
        "userId"
      )}`,
      options
    ).then(async (response) => {
      let resp = await response.json();

      console.log(resp);

      if (!resp.error) {
        setMeetings(resp);
      }
    });
  }, []);

  return (
    <div class="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      <SideNav />

      <div class="h-screen flex-grow-1 overflow-y-lg-auto">
        <TopNav />

        <main class="py-6 bg-surface-secondary">
          <div class="container-fluid">
            <div
              style={{
                padding: "1rem 1.5rem",
                backgroundColor: "white",
                marginBottom: "2rem",
                borderRadius: "7px",
              }}
            >
              <h4>Today's Meetings</h4>
            </div>

            <div class="card" style={{ width: "100%" }}>
              <ul class="list-group list-group-flush">
                {meetings.length === 0 ? (
                  <li className="list-group-item">
                    <div
                      style={{
                        paddingTop: "4rem",
                        paddingBottom: "4rem",
                        textAlign: "center",
                      }}
                    >
                      <img src={illustration} alt="" />{" "}
                      <h5 style={{ marginTop: "1rem" }}>No meetings today</h5>
                    </div>
                  </li>
                ) : (
                  ""
                )}

                {meetings?.map((value) => {
                  return (
                    <li class="list-group-item">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          rowGap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={
                              value.studentProfileAvatar
                                ? value.studentProfileAvatar
                                : finalAvatar
                            }
                            alt=""
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h5>{value.studentName}</h5>
                            <p style={{ fontSize: "13px" }}>
                              {value.studentTimeZone}
                            </p>
                            <p style={{ fontSize: "13px", opacity: "0.8" }}>
                              {localStorage.getItem("role") === "TUTOR"
                                ? value.tutorTimeSlot.startTime + " - " + value.tutorTimeSlot.endTime
                                : value.timeSlot.startTime + " - " + value.timeSlot.endTime}


                              




                            </p>
                          </div>
                        </div>

                        <button
                          href="#"
                          class="btn btn-sm btn-neutral button-join shadow-none"
                          style={{ minWidth: "141.39px" }}
                          onClick={(e) => {
                            e.target.lastChild.innerText = "Joining...";
                            joinMeeting(value.bookingId);
                          }}
                        >
                          <img
                            src={joinIcon}
                            alt=""
                            style={{
                              marginRight: "0.3rem",
                              pointerEvents: "none",
                              maxWidth: "initial",
                            }}
                          />{" "}
                          <span style={{ pointerEvents: "none" }}>
                            Join Meeting
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
