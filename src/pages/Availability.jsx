import { useContext, useEffect, useState } from "react";

import { MyContext, PageContext } from "../MyContext";

import "../styles/profile.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

import joinIcon from "../assets/join_icon.png";
import { json, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Availability = () => {
  let jsonData = {
    timeSlots: [],
  };

  let elements = [];

  let visibleElements = [];

  const navigate = useNavigate();

  const [day, setDay] = useState("MONDAY");

  const { thisPage, setThisPage } = useContext(PageContext);

  const { imgSrc, setImgSrc } = useContext(MyContext);

  const [timezoneList, setTimezoneList] = useState([]);

  const [deleted, setDeleted] = useState(false);

  const [timeslots, setTimeslots] = useState([
    "00:00:00",
    "00:30:00",
    "01:00:00",
    "01:30:00",
    "02:00:00",
    "02:30:00",
    "03:00:00",
    "03:30:00",
    "04:00:00",
    "04:30:00",
    "05:00:00",
    "05:30:00",
    "06:00:00",
    "06:30:00",
    "07:00:00",
    "07:30:00",
    "08:00:00",
    "08:30:00",
    "09:00:00",
    "09:30:00",
    "10:00:00",
    "10:30:00",
    "11:00:00",
    "11:30:00",
    "12:00:00",
    "12:30:00",
    "13:00:00",
    "13:30:00",
    "14:00:00",
    "14:30:00",
    "15:00:00",
    "15:30:00",
    "16:00:00",
    "16:30:00",
    "17:00:00",
    "17:30:00",
    "18:00:00",
    "18:30:00",
    "19:00:00",
    "19:30:00",
    "20:00:00",
    "20:30:00",
    "21:00:00",
    "21:30:00",
    "22:00:00",
    "22:30:00",
    "23:00:00",
    "23:30:00",
    "24:00:00",
  ]);

  const [mySlots, setMySlots] = useState([]);

  const [meetings, setMeetings] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      jwtToken: localStorage.getItem("token"),
    },
  };

  function updateSlots() {
    elements = document.querySelectorAll(".slotWrapper");

    // Filter out elements with display: none
    visibleElements = Array.from(elements).filter((element) => {
      return window.getComputedStyle(element).display !== "none";
    });

    visibleElements.forEach((val) => {
      jsonData.timeSlots.push({
        startTimeUTC: val.childNodes[0].value,
        endTimeUTC: val.childNodes[1].value,
      });
    });

    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON

        jwtToken: localStorage.getItem("token"),
      },
      body: JSON.stringify(jsonData), // Convert JSON data to a string and set it as the request body
    };

    // Make the fetch request with the provided options

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/tutor/availability/save?tutorId=${localStorage.getItem(
        "userId"
      )}&role=${localStorage.getItem("role")}&dayOfWeek=${day}&tutorTimeZone=${
        document.getElementById("zoneInput").value
      }`,
      options2
    ).then(async (response) => {
      let resp = await response.json();
      console.log(resp);

      jsonData = {
        timeSlots: [],
      };

      if (resp.timeSlots) {
        toast.success("Timeslots updated for the day");
        setDeleted(true);
        setMySlots([]);
      } else if (resp.error) {
        toast.error(resp.error);
      } else {
        toast.error(resp.message);
      }
    });
  }

  function deleteSlot(e) {
    let myData = [
      {
        startTimeUTC: e.target.parentElement.childNodes[0].value,

        endTimeUTC: e.target.parentElement.childNodes[1].value,
      },
    ];

    const myOption = {
      method: "DELETE",
      headers: {
        accept: "*/*",

        "Content-Type": "application/json", // Set content type to JSON

        jwtToken: localStorage.getItem("token"),
      },
      body: JSON.stringify(myData), // Convert JSON data to a string and set it as the request body
    };

    // Make the fetch request with the provided options

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/tutor/availability/delete/slots?tutorId=${localStorage.getItem(
        "userId"
      )}&role=${localStorage.getItem("role")}&dayOfWeek=${day}&timeZone=${
        document.getElementById("zoneInput").value
      }`,
      myOption
    ).then(async (response) => {
      let resp = await response.json();
      console.log(resp);

      setDeleted(true);

      if (resp.status === "Success") {
        toast.success(resp.message);
      } else {
        toast.error(resp.message);
      }
    });
  }

  useEffect(() => {
    if (deleted) {
      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/tutor/availability/${localStorage.getItem(
          "userId"
        )}/slots?role=${localStorage.getItem("role")}&timezone=${
          imgSrc.timezone
        }`,
        options
      ).then(async (response) => {
        setDeleted(false);

        let resp = await response.json();

        console.log(resp);

        if (resp.body) {
          setMeetings(resp.body);
        }
      });
    }
  }, [deleted]);

  useEffect(() => {
    setThisPage("availability");

    if (localStorage.getItem("userId") === null) {
      navigate("/");
    }

    if (imgSrc.timezone) {
      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/tutor/availability/${localStorage.getItem(
          "userId"
        )}/slots?role=${localStorage.getItem("role")}&timezone=${
          imgSrc.timezone
        }`,
        options
      ).then(async (response) => {
        let resp = await response.json();

        console.log(resp);

        if (resp.body) {
          setMeetings(resp.body);
        }
      });
    }

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/common/v1/timezones?userId=${localStorage.getItem("userId")}`,
      options
    ).then(async (response) => {
      let resp = await response.json();

      setTimezoneList(resp);
    });

    document
      .querySelectorAll(".buttonSecondary, .buttonPrimary")
      .forEach((val) => {
        val.addEventListener("click", () => {
          setMySlots([]);
        });
      });
  }, [imgSrc]);

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
              <h4>Set your Availability</h4>
            </div>

            <div
              className="card"
              style={{ width: "100%", marginBottom: "2rem" }}
            >
              <ul className="list-group list-group-flush">
                <li className="list-group-item ">
                  <h6>Select time zone</h6>
                  <p style={{ marginBottom: "0.5rem" }}>
                    A correct time zone is essential to coordinate lessons with
                    international students
                  </p>
                  <select
                    className="form-select  form-select-sm "
                    name=""
                    id="zoneInput"
                  >
                    {timezoneList.map((val) => {
                      if (val === imgSrc.timezone) {
                        return (
                          <option value={val} selected>
                            {val}
                          </option>
                        );
                      } else {
                        return <option value={val}>{val}</option>;
                      }
                    })}
                  </select>
                </li>
              </ul>
            </div>

            <div class="card" style={{ width: "100%" }}>
              <ul class="list-group list-group-flush">
                <li className="list-group-item">
                  <h6>Set your availability</h6>
                  <p style={{ marginBottom: "0.5rem" }}>
                    Availability shows your potential working hours. Students
                    can book lessons at <br /> these times.
                  </p>

                  <div
                    style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
                  >
                    <button
                      onClick={() => setDay("MONDAY")}
                      className={
                        day === "MONDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Monday
                    </button>
                    <button
                      onClick={() => setDay("TUESDAY")}
                      className={
                        day === "TUESDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Tuesday
                    </button>
                    <button
                      onClick={() => setDay("WEDNESDAY")}
                      className={
                        day === "WEDNESDAY"
                          ? "buttonPrimary"
                          : "buttonSecondary"
                      }
                    >
                      Wednesday
                    </button>
                    <button
                      onClick={() => setDay("THURSDAY")}
                      className={
                        day === "THURSDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Thrusday
                    </button>
                    <button
                      onClick={() => setDay("FRIDAY")}
                      className={
                        day === "FRIDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Friday
                    </button>
                    <button
                      onClick={() => setDay("SATURDAY")}
                      className={
                        day === "SATURDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Saturday
                    </button>
                    <button
                      onClick={() => setDay("SUNDAY")}
                      className={
                        day === "SUNDAY" ? "buttonPrimary" : "buttonSecondary"
                      }
                    >
                      Sunday
                    </button>
                  </div>
                </li>

                <li class="list-group-item">
                  <h5 style={{ marginBottom: "0.5rem" }}>
                    {day[0] + day.slice(1).toLowerCase()}
                  </h5>

                  {
                    <div
                      style={{
                        display: "flex",
                        gap: "0.8rem",
                        alignItems: "center",
                      }}
                    >
                      <p className="form-label" style={{ width: "100%" }}>
                        From
                      </p>
                      <p className="form-label" style={{ width: "100%" }}>
                        To
                      </p>

                      <button
                        style={{
                          height: "36.19px",
                          borderRadius: "5px",
                          width: "60px",
                          visibility: "hidden",
                        }}
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  }

                  {meetings?.map((value) => {
                    if (value.dayOfWeek === day) {
                      return (
                        <>
                          {value.timeSlotsLocal.map((val) => {
                            return (
                              <div className="slotWrapper ">
                                <select
                                  name=""
                                  id=""
                                  className="form-select form-select-sm"
                                  disabled
                                >
                                  {timeslots.map((va) => {
                                    if (val.startTime === va) {
                                      return (
                                        <option value={va} selected>
                                          {va.slice(0, 5)}
                                        </option>
                                      );
                                    } else {
                                      return (
                                        <option value={va}>
                                          {va.slice(0, 5)}
                                        </option>
                                      );
                                    }
                                  })}
                                </select>

                                <select
                                  name=""
                                  id=""
                                  className="form-select form-select-sm"
                                  disabled
                                >
                                  {timeslots.map((va) => {
                                    if (val.endTime === va) {
                                      return (
                                        <option value={va} selected>
                                          {va.slice(0, 5)}
                                        </option>
                                      );
                                    } else {
                                      return (
                                        <option value={va}>
                                          {va.slice(0, 5)}
                                        </option>
                                      );
                                    }
                                  })}
                                </select>

                                <button
                                  onClick={deleteSlot}
                                  style={{
                                    height: "36.19px",
                                    borderRadius: "5px",
                                    width: "60px",
                                  }}
                                >
                                  <i
                                    class="bi bi-trash"
                                    style={{ pointerEvents: "none" }}
                                  ></i>
                                </button>
                              </div>
                            );
                          })}
                        </>
                      );
                    }
                  })}

                  {mySlots.map((val) => {
                    return (
                      <div className="slotWrapper ">
                        <select
                          name=""
                          id=""
                          className="form-select form-select-sm"
                        >
                          {timeslots.map((va) => {
                            if (val.startTimeUTC === va) {
                              return (
                                <option value={va} selected>
                                  {va.slice(0, 5)}
                                </option>
                              );
                            } else {
                              return (
                                <option value={va}>{va.slice(0, 5)}</option>
                              );
                            }
                          })}
                        </select>

                        <select
                          name=""
                          id=""
                          className="form-select form-select-sm"
                        >
                          {timeslots.map((va) => {
                            if (val.endTimeUTC === va) {
                              return (
                                <option value={va} selected>
                                  {va.slice(0, 5)}
                                </option>
                              );
                            } else {
                              return (
                                <option value={va}>{va.slice(0, 5)}</option>
                              );
                            }
                          })}
                        </select>

                        <button
                          style={{
                            height: "36.19px",
                            borderRadius: "5px",
                            width: "60px",
                          }}
                          onClick={(e) =>
                            (e.target.parentElement.style.display = "none")
                          }
                        >
                          <i
                            class="bi bi-trash"
                            style={{ pointerEvents: "none" }}
                          ></i>
                        </button>
                      </div>
                    );
                  })}

                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => {
                      setMySlots((prev) => [
                        ...prev,
                        {
                          startTimeUTC: "00:00:00",
                          endTimeUTC: "00:00:00",
                        },
                      ]);
                    }}
                  >
                    <i
                      style={{ marginRight: "2px" }}
                      class="bi bi-plus-circle"
                    ></i>{" "}
                    Add another timeslot
                  </button>
                </li>
              </ul>

              <div class="card-footer">
                <div className="text-end">
                  <button className="btn btn-sm btn-dark" onClick={updateSlots}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Availability;
