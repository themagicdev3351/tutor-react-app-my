import React, { useEffect } from "react";

import { useContext } from "react";
import { MyContext, PageContext } from "../MyContext";

import avatarFinal from "../assets/avatar_final.png";

import avatar from "../assets/Avatar.png";
import dashLogo from "../assets/Icon_0.png";
import meetLogo from "../assets/Icon_1.png";
import chatLogo from "../assets/Icon_2.png";
import availabilityLogo from "../assets/Icon_3.png";
import navBrand from "../assets/nav_brand.png";
import homeIcon from "../assets/home.png";
import logOutLogo from "../assets/logout.png";
import { Link, useNavigate } from "react-router-dom";

const SideNav = () => {
  const { imgSrc, setImgSrc } = useContext(MyContext);

  const { thisPage, setThisPage } = useContext(PageContext);

  const navigate = useNavigate();

  return (
    <nav
      class="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
    >
      <div class="container-fluid">
        <button
          class="navbar-toggler ms-n2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0" href="/dashboard">
          <img src={navBrand} alt="..." style={{ height: "60px" }} />
        </a>

        <div class="collapse navbar-collapse" id="sidebarCollapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link
                class={
                  thisPage === "dashboard" ? "nav-link activePage" : "nav-link"
                }
                to={"/dashboard"}
              >
                <img src={dashLogo} alt="" style={{ marginRight: "0.5rem" }} />{" "}
                Dashboard
              </Link>
            </li>
            <li class="nav-item">
              <Link
                to={"/meetings"}
                className={
                  thisPage === "meetings" ? "nav-link activePage" : "nav-link"
                }
              >
                <img src={meetLogo} alt="" style={{ marginRight: "0.5rem" }} />{" "}
                Meetings
              </Link>
            </li>
            <li class="nav-item">
              <Link
                to={`/chat`}
                class={thisPage === "chat" ? "nav-link activePage" : "nav-link"}
              >
                <img src={chatLogo} alt="" style={{ marginRight: "0.5rem" }} />{" "}
                Chat
              </Link>
            </li>

            {localStorage.getItem("role") === "TUTOR" ? (
              <li class="nav-item">
                <Link
                  to={"/availability"}
                  class={
                    thisPage === "availability"
                      ? "nav-link activePage"
                      : "nav-link"
                  }
                >
                  <img
                    src={availabilityLogo}
                    alt=""
                    style={{ marginRight: "0.5rem" }}
                  />{" "}
                  Availability
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>

          <hr class="navbar-divider my-5 opacity-20" />

          <div class="mt-auto"></div>

          <ul class="navbar-nav ">
            <li style={{ borderTop: "1px solid rgba(0, 0, 0, 0.2)" }}>
              {/* 

            <p class="nav-link d-flex align-items-center">
              <div class="me-4">
                <div class="position-relative d-inline-block text-white">
                  <img
                    alt="Image Placeholder"
                    src={avatar}
                    class="avatar rounded-circle"
                  />
                </div>
              </div>
              <div>
                <span class="d-block text-xs text-muted font-regular">
                  Welcome back 👋
                </span>
                <span class="d-block text-sm font-bold">Jakson James</span>
              </div>
              <div class="ms-auto">
              <i class="bi bi-gear-fill"  style={{cursor:'pointer'}} onClick={()=>navigate('/profile')}></i>
              </div>
            </p>

 */}

              <div class="accordion accordion-flush " id="accordionExample">
                <div class="accordion-item">
                  <h2 class="accordion-header ">
                    <button
                      class="accordion-button collapsed shadow-none"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      id="myAccordation"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <p
                        class="nav-link d-flex "
                        style={{ alignItems: "center", padding: "0" }}
                      >
                        <div class="me-4">
                          <div class="position-relative d-inline-block text-white">
                            <img
                              alt="Image Placeholder"
                              src={imgSrc.picSrc ? imgSrc.picSrc : avatarFinal}
                              class="avatar rounded-circle"
                            />
                          </div>
                        </div>
                        <div>
                          <span class="d-block text-xs text-muted font-regular">
                            Welcome back 👋
                          </span>
                          <span class="d-block text-sm font-bold">
                            {imgSrc.fullName !== "undefined undefined"
                              ? imgSrc.fullName
                              : "User"}
                          </span>
                        </div>
                      </p>{" "}
                      <i class="bi bi-chevron-down"></i>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    class="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body" style={{ padding: "0 20px" }}>
                      <ul class="navbar-nav">
                        <li class="nav-item">
                          <Link class="nav-link" to={"/profile"}>
                            <img
                              src={homeIcon}
                              alt=""
                              style={{ marginRight: "0.5rem" }}
                            />{" "}
                            View profile
                          </Link>
                        </li>
                        <li class="nav-item">
                          <Link
                            class="nav-link"
                            style={{ color: "red" }}
                            to={"/"}
                            onClick={() => {
                              localStorage.removeItem("userId");
                              localStorage.removeItem("token");
                              localStorage.removeItem("chatToken");
                            }}
                          >
                            <img
                              src={logOutLogo}
                              alt=""
                              style={{ marginRight: "0.5rem" }}
                            />{" "}
                            Log out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
