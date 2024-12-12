import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Attendance from "./components/Attendance";
import Sidenav from "./components/templates/Sidenav";
import Members from "./components/Members";
import Followups from "./components/Followups";
import Trainers from "./components/Trainers";
import Payments from "./components/Payments";
import Sales from "./components/Sales";

function App() {
  return (
    <div className="w-screen h-screen lg:overflow-auto">
      <Sidenav>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/attendance" element={<Attendance />}></Route>
          <Route path="/members" element={<Members />}></Route>
          <Route path="/follow-ups" element={<Followups />}></Route>
          <Route path="/trainers" element={<Trainers />}></Route>
          <Route path="/payments" element={<Payments />}></Route>
          <Route path="/sales" element={<Sales />}></Route>

          {/* <Route path="/about-me" element={< />}></Route>
          <Route path="/contact-me" element={< />}></Route> */}


        </Routes>
      </Sidenav>
    </div>
  );
}

export default App;
