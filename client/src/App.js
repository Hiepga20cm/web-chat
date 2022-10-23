import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Landing from "./components/layout/Landing";
import Login from "./components/LoginForm/Login";
import Register from "./components/Register/Register";
import "mdb-ui-kit/css/mdb.min.css";
import * as mdb from "mdb-ui-kit"; // lib
import { Input } from "mdb-ui-kit"; // module

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");
  const permission = localStorage.getItem("permission");

  let check = false;
  if (permission === "admin") {
    check = true;
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={!token ? <Register /> : <Login />} />
          <Route path="/chat" element={token ? <Chat /> : <Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
