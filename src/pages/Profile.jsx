import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import toast from "react-hot-toast";

import { PageContext } from "../MyContext";

const Profile = () => {
  const { thisPage, setThisPage } = useContext(PageContext);

  const navigate = useNavigate();
  const [languageList, setLanguageList] = useState([]);
  const [timezoneList, setTimezoneList] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [languageSpeaks, setLanguageSpeaks] = useState([]);
  const [timezone, setTimezone] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [fullName, setFullName] = useState("User");

  const [state, setState] = useState("");

  const [country, setCountry] = useState("");

  let picData = null;

  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      jwtToken: localStorage.getItem("token"),
    },
  };

  let jsonData = {};

  function editProfile() {
    jsonData = {
      userId: localStorage.getItem("userId"),
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: localStorage.getItem("email"),
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
      profilePic: imgUrl,
      zipCode: document.getElementById("zipCode").value,
      languagesSpeaks: [
        document.getElementById("language1").value,
        document.getElementById("language2").value,
      ],
      timezone: document.getElementById("timezone").value,
    };

    const options2 = {
      method: "POST",
      headers: {
        accept: "*/*",
        jwtToken: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    };

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/common/update/profile?userId=${localStorage.getItem(
        "userId"
      )}&role=${localStorage.getItem("role")}`,
      options2
    ).then(async (response) => {
      let resp = await response.json();
      // console.log(resp);

      if (resp.status === "Success") {
        toast.success(resp.message);
        setDisabled(true);
      } else {
        toast.error(resp.message);
      }
    });

    if (picData) {
      let formData = new FormData();
      formData.append("file", picData);
      formData.append("role", localStorage.getItem("role"));
      // console.log(formData.get("file"));

      const options3 = {
        method: "POST",
        body: formData,
        headers: {
          accept: "*/*",
          jwtToken: localStorage.getItem("token"),
        },
      };

      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/api/files/upload/profile-picture/${localStorage.getItem("userId")}`,
        options3
      ).then(async (response) => {
        let resp = await response.json();

        if (resp.status === "OK") {
          toast.success(resp.message);
          setImgUrl(resp.fileUrl);
        } else {
          toast.error(resp.message);
        }
      });
    }
  }

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      navigate("/");
    }

    setThisPage("profile");
  }, []);

  useEffect(() => {
    document
      .querySelectorAll("input, button, select")
      .forEach((val) => val.classList.add("shadow-none"));

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/common/v1/timezones?userId=${localStorage.getItem("userId")}`,
      options
    ).then(async (response) => {
      let resp = await response.json();

      setTimezoneList(resp);
    });

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/common/languages?userId=${localStorage.getItem("userId")}`,
      options
    ).then(async (response) => {
      let resp = await response.json();

      setLanguageList(resp);
    });

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

      if (resp.status !== "Failure" && localStorage.getItem("userId")) {
        setLanguageSpeaks(resp.languagesSpeaks);

        setTimezone(resp.timezone);

        setImgUrl(resp.profilePic);

        document.getElementById("firstName").value = resp.firstName;

        document.getElementById("lastName").value = resp.lastName;

        document.getElementById("city").value = resp.city;

        document.getElementById("state").value = resp.state;

        document.getElementById("zipCode").value = resp.zipCode;

        document.getElementById("country").value = resp.country;

        setFullName(resp.firstName + " " + resp.lastName);

        setState(resp.state);

        setCountry(resp.country);

        localStorage.setItem("email", resp.email);
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
              <h4>Profile</h4>
            </div>

            <div class="row align-items-center">
              <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                <div
                  class="pt-20 rounded-top"
                  style={{
                    background: "#E0F2FE",
                    backgroundSize: "cover",
                    border: "1px solid #eceef3",
                    position: "relative",
                  }}
                >
                  <h2 className="profileH2">Xpert Buddy</h2>
                </div>
                <div
                  class="card rounded-bottom smooth-shadow-sm"
                  style={{ borderRadius: "0 0 0.75rem 0.75rem" }}
                >
                  <div
                    class="d-flex align-items-center justify-content-between
          pt-4 pb-6 px-4"
                  >
                    <div class="d-flex align-items-center">
                      <div
                        class="avatar-xxl avatar-indicators avatar-online me-2
              position-relative d-flex justify-content-end
              align-items-end mt-n10"
                      >
                        <img
                          src={
                            !imgUrl
                              ? "https://bootdey.com/img/Content/avatar/avatar1.png"
                              : imgUrl
                          }
                          class="avatar-xxl
              rounded-circle border border-2 "
                          alt="Image"
                        />
                      </div>

                      {disabled ? (
                        <div class="lh-1">
                          <h2 class="mb-0" id="fullName">
                            {fullName}
                          </h2>
                          <p class="mb-0 d-block" id="email">
                            {state === country
                              ? country
                              : country && state
                              ? state + ", " + country
                              : state
                              ? state
                              : country
                              ? country
                              : ""}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label for="formFile" class="form-label">
                            Update profile picture
                          </label>
                          <input
                            class="form-control form-control-sm shadow-none"
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            onChange={(e) => {
                              picData = e.target.files[0];
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="row">
                      <div className="col-md-4 col-12 mb-4">
                        <h5>Profile details</h5>
                        <p style={{ fontSize: "14px", opacity: "0.8" }}>
                          Update your photo and personal details
                        </p>
                      </div>

                      <div className="col-md-8 col-12">
                        <div className="row">
                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              First name
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="firstName"
                              placeholder="Enter your first name"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Last name
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="lastName"
                              placeholder="Enter your last name"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              City
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="city"
                              placeholder="Enter your city"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              State
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="state"
                              placeholder="Enter your state"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Country
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="country"
                              placeholder="Enter your country"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Zip code
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              id="zipCode"
                              placeholder="Enter zip code"
                              disabled={disabled ? true : false}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Timezone
                            </label>
                            <select
                              name=""
                              id="timezone"
                              className="form-select"
                              disabled={disabled ? true : false}
                            >
                              <option value="">Select</option>
                              {timezoneList.map((val) => {
                                if (val === timezone) {
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
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Language speaks 1
                            </label>

                            <select
                              name=""
                              id="language1"
                              className="form-select"
                              disabled={disabled ? true : false}
                            >
                              <option value="">Select</option>
                              {languageList.map((val) => {
                                if (
                                  languageSpeaks?.length > 0 &&
                                  val === languageSpeaks[0]
                                ) {
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
                          </div>

                          <div className="col-md-6 col-12 mb-3">
                            <label
                              for="exampleFormControlInput1"
                              class="form-label"
                            >
                              Language speaks 2
                            </label>

                            <select
                              name=""
                              id="language2"
                              className="form-select"
                              disabled={disabled ? true : false}
                            >
                              <option value="">Select</option>
                              {languageList.map((val) => {
                                if (
                                  languageSpeaks?.length > 0 &&
                                  val === languageSpeaks[1]
                                ) {
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="card-footer text-body-secondary"
                    style={{ backgroundColor: "#F3F4F599" }}
                  >
                    <div className="text-end">
                      {disabled ? (
                        <button
                          className="btn-sm btn-dark"
                          onClick={() => setDisabled(false)}
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn-sm btn-light"
                            style={{ marginRight: "1rem" }}
                            onClick={() => setDisabled(true)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-sm btn-dark "
                            onClick={editProfile}
                          >
                            Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
