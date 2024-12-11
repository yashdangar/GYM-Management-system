import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Attendance from "./components/Attendance";
import Sidenav from "./components/templates/Sidenav";

function App() {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Sidenav>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/attendance" element={<Attendance />}></Route>
        </Routes>
      </Sidenav>
    </div>
  );
}

export default App;
