import React from "react";

import logo from "../assets/Vector - 0.png";
import vector1 from "../assets/Vector - 1.png";
import vector2 from "../assets/Vector - 2.png";

const Nav = () => {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary" style={{borderBottom:'1px solid rgba(0, 0, 0, 0.2)', backgroundColor:'#f7fafa'}}>
      <div class="container-fluid">
        <a
          class="navbar-brand"
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "16px" }} class="" />
          <h3
            style={{
              fontSize: "18px",
              lineHeight: "23px",
              marginBottom: "0",
              fontWeight: "700",
            }}
          >
            Tutoring Co
          </h3>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarSupportedContent"
          style={{ justifyContent: "end" }}
        >
          <ul class="navbar-nav  mb-2 mb-lg-0">
          <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#0D171C",
                }}
              >
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#0D171C",
                }}
              >
                Students
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#0D171C",
                }}
              >
                Classes
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#0D171C",
                }}
              >
                Meetings
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#0D171C",
                }}
              >
                Reports
              </a>
            </li>
          </ul>
          <div>
          <button type="button" class="btn btn-light" style={{backgroundColor:'#E8EDF2'}}><img src={vector1}></img></button>
          <button type="button" class="btn btn-light" style={{backgroundColor:'#E8EDF2'}}> <img src={vector2} alt="" /> </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
