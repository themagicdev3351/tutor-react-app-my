import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/meeting.css";

import joinIcon from "../assets/join_icon.png";
import toast from "react-hot-toast";
import illustration from "../assets/Illustration.png";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

import avatarFinal from "../assets/avatar_final.png";

import { useContext } from "react";

import { PageContext } from "../MyContext";

const Meetings = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pageCount, setPageCount] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isPast, setIsPast] = useState(false);

  const navigate = useNavigate();

  const { thisPage, setThisPage } = useContext(PageContext);

  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      jwtToken: localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      navigate("/");
    }

    setThisPage("meetings");
  }, []);

  useEffect(() => {
    if (!isPast) {
      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/tutor/booking/session/meetings?userId=${localStorage.getItem(
          "userId"
        )}&page=${currentPage}&size=10`,
        options
      ).then(async (response) => {
        let resp = await response.json();

        console.log(resp);

        if (resp.upcoming) {
          setTotalItems(resp.totalItems);

          setUpcomingBookings(resp.upcoming);
        }

        if (pageCount.length === 0) {
          let num = resp.totalPages;

          for (let i = 0; i < num; i++) {
            pageCount.push(i + 1);
          }
        }
      });
    } else {
      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/tutor/booking/session/meetings?userId=${localStorage.getItem(
          "userId"
        )}&isPast=true&page=${currentPage}&size=10`,
        options
      ).then(async (response) => {
        let resp = await response.json();

        console.log(resp);

        if (resp.past) {
          setTotalItems(resp.totalItems);

          setUpcomingBookings(resp.past);
        }

        if (pageCount.length === 0) {
          let num = resp.totalPages;

          for (let i = 0; i < num; i++) {
            pageCount.push(i + 1);
          }
        }
      });
    }
  }, [currentPage, isPast]);

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
              <h4>{isPast ? "Past Meetings" : "Upcoming Meetings"}</h4>
            </div>

            <div class="card shadow border-0 mb-7">
              <div class="card-header" style={{ padding: "0 1.5rem" }}>
                <ul class="nav nav-tabs  overflow-x border-0">
                  <li class="nav-item ">
                    <a
                      href="#"
                      className={`nav-link ${
                        !isPast ? "active" : "font-regular"
                      }`}
                      onClick={() => {
                        if (isPast) {
                          setIsPast(false);
                          setUpcomingBookings([]);
                          setPageCount([]);
                          setCurrentPage(0);
                          setTotalItems(0);
                        }
                      }}
                    >
                      Upcoming Meetings
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#"
                      className={`nav-link ${
                        isPast ? "active" : "font-regular"
                      }`}
                      onClick={() => {
                        if (!isPast) {
                          setIsPast(true);
                          setUpcomingBookings([]);
                          setPageCount([]);
                          setCurrentPage(0);
                          setTotalItems(0);
                        }
                      }}
                    >
                      Past Meetings
                    </a>
                  </li>
                </ul>
              </div>
              <div class="table-responsive">
                <table class="table table-hover table-nowrap">
                  <thead class="thead-light">
                    <tr>
                      <th scope="col ">
                        {localStorage.getItem("role") === "STUDENT"
                          ? "Tutor"
                          : "Student"}
                      </th>

                      <th scope="col">Subject</th>
                      <th scope="col">Booking ID</th>
                      <th scope="col">Date & Time</th>
                      <th scope="col">Timezone</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Type</th>

                      {!isPast ? (
                        <th></th>
                      ) : (
                        <th scope="col">Meeting Status</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.length !== 0 ? (
                      upcomingBookings.map((value, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <img
                                alt="..."
                                src={
                                  value.studentProfileAvatar
                                    ? value.studentProfileAvatar
                                    : avatarFinal
                                }
                                class="avatar avatar-sm rounded-circle me-2"
                              />
                              <a class="text-heading font-semibold" href="#">
                                {localStorage.getItem("role") === "STUDENT"
                                  ? value.tutorName
                                  : value.studentName}
                              </a>
                            </td>
                            <td>{value.subjectName}</td>
                            <td>
                              <a class="text-heading font-semibold" href="#">
                                {value.bookingId}
                              </a>
                            </td>
                            <td>
                              {localStorage.getItem("role") === "TUTOR"
                                ? value.tutorAppointmentDate +
                                  " at " +
                                  value.tutorTimeSlot.startTime.slice(0, 5)
                                : value.appointmentDate +
                                  " at " +
                                  value.timeSlot.startTime.slice(0, 5)}
                            </td>
                            <td>
                              {localStorage.getItem("role") === "STUDENT"
                                ? value.tutorTimeZone
                                : value.studentTimeZone}
                            </td>
                            <td>{value.paymentDetails.lessonDuration}</td>
                            <td>{"$ " + value.paymentDetails.bookingAmount}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-light"
                                style={{ minWidth: "94.89px" }}
                              >
                                {value.lessonType}
                              </button>
                            </td>

                            {!isPast ? (
                              <td class="text-end">
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
                              </td>
                            ) : (
                              <td>
                                <a href="#" className="btn btn-sm btn-success">
                                  {value.bookingStatus}
                                </a>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          style={{
                            paddingTop: "4rem",
                            paddingBottom: "4rem",
                            textAlign: "center",
                          }}
                        >
                          <img src={illustration} alt="" />{" "}
                          <h5 style={{ marginTop: "1rem" }}>
                            No meetings today
                          </h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                class="card-footer border-0 py-5 d-flex align-items-center justify-content-center"
                style={{ gap: "1rem", flexWrap: "wrap" }}
              >
                <span class="text-muted text-sm">
                  Showing {upcomingBookings.length} of {totalItems} Entries
                </span>
                <nav aria-label="Page navigation example">
                  <ul class="pagination">
                    <li class="page-item">
                      <a
                        class="page-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (currentPage > 0) {
                            setCurrentPage((prev) => prev - 1);
                          }
                        }}
                      >
                        <i class="bi bi-chevron-left"></i>
                      </a>
                    </li>

                    {pageCount.map((value, index) => {
                      return (
                        <li
                          className={`page-item 


         
          
          
          `}
                        >
                          <a
                            className={`page-link  ${
                              index === currentPage ? "myActive" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              if (
                                Number(e.target.innerText) - 1 !==
                                currentPage
                              ) {
                                setCurrentPage(Number(e.target.innerText) - 1);
                              }
                            }}
                          >
                            {value}
                          </a>
                        </li>
                      );
                    })}

                    <li class="page-item">
                      <a
                        class="page-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (currentPage < pageCount.length - 1) {
                            setCurrentPage((prev) => (prev += 1));
                          }
                        }}
                      >
                        <i class="bi bi-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Meetings;
