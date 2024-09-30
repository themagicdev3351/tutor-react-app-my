import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Meetings from "./pages/Meetings";
import MeetingUI from "./pages/MeetingUI";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { MyContext, PageContext } from "./MyContext";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Availability from "./pages/Availability";

function App() {
  const [imgSrc, setImgSrc] = useState("");
  const [thisPage, setThisPage] = useState("");

  return (
    <div className="App">
      <MyContext.Provider value={{ imgSrc, setImgSrc }}>
        <PageContext.Provider value={{ thisPage, setThisPage }}>
          <Router>
            <Routes>
              <Route element={<Meetings />} path="/meetings" />

              <Route element={<Login />} path="/" />

              <Route element={<MeetingUI />} path="/meetings/:bookingId" />

              <Route element={<Profile />} path="/profile" />

              <Route element={<Chat />} path="/chat" />

              <Route element={<Dashboard />} path="/dashboard" />

              <Route element={<Availability />} path="/availability" />
            </Routes>
          </Router>

          <Toaster />
        </PageContext.Provider>
      </MyContext.Provider>
    </div>
  );
}

export default App;
