import { Session } from "@talkjs/react"; 
import { Inbox } from "@talkjs/react"; 

import { useContext, useEffect } from "react";

import { PageContext } from "../MyContext";

import "../styles/profile.css";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = payload.exp - currentTime;
  console.log(
    `Token expiration time: ${new Date(payload.exp * 1000).toLocaleString()}`
  );
  // console.log(`Current time: ${new Date(currentTime * 1000).toLocaleString()}`);
  console.log(`Time left before token expires: ${timeLeft} seconds`);
  return payload.exp < currentTime;
};

const tokenFetcher = async (userId, jwtToken) => {
  try {
    const storedToken = localStorage.getItem("chatToken");
    if (storedToken && !isTokenExpired(storedToken)) {
      return storedToken;
    }

    // Fetch a new token
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/token?userId=${userId}&tokenType=USER`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          jwtToken: `Bearer ${jwtToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch token: ${errorText}`);
    }

    const data = await response.json();
    localStorage.setItem("chatToken", data.token);
    console.log(data.token, "new token");
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return ""; // Return an empty string on error
  }
};

const Chat = () => {
  const { thisPage, setThisPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setThisPage("chat");
  }, []);

  // const chatbox = {
  //   messageFilter: [
  //     "any",
  //     [
  //       { custom: { visibleTo: "!exists" } },
  //       { custom: { visibleTo: ["==", localStorage.getItem("userId")] } }, // A filter that matches messages where the custom value "visibleTo" matches the user ID.
  //     ],
  //   ],
  // };

  const chatbox = {
    messageFilter: [
      "any",
      [
        { custom: { visibleTo: "!exists" } },
        ...(localStorage.getItem("role") !== "ADMIN"
          ? [{ custom: { visibleTo: ["==", localStorage.getItem("userId")] } }]
          : [{}]),
      ],
    ],
  };

  return (
    <div class="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      <SideNav />

      <div class="flex-grow-1 overflow-y-lg-auto">
        <TopNav />

        <main class=" bg-white pt-3">
          <div class="container-fluid p-0">
            <Session
              appId={process.env.REACT_APP_CHAT_ID}
              userId={
                localStorage.getItem("userId")
                  ? localStorage.getItem("userId")
                  : navigate("/")
              }
              tokenFetcher={() =>
                tokenFetcher(
                  localStorage.getItem("userId"),
                  localStorage.getItem("token")
                )
              }
            >
              <Inbox
                loadingComponent={
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "5rem",
                    }}
                  >
                    Loading...
                  </h4>
                }
                messageFilter={chatbox.messageFilter}
                style={{ width: "100%" }}
                className="chat-container"
              />
            </Session>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
