import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/navbar/NavBar"
import Home from "./components/Home"
import Login from "./components/login/Login"
import AdminPanel from "./components/admin/AdminPanel"

import Logout from "./components/Logout"
import Status from "./components/Status"
import Test from "./components/Test"
import ApplicationForm from "./components/ApplicationForm"

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/application" element={<h1>Application</h1>} />
          <Route path="/employee" element={<h1>Employee</h1>} />
          <Route path="/profile" element={<h1>Profile</h1>} />
        </Routes>
        <Status />
        <Test />
        <Logout />
        <ApplicationForm />
      </>
    </BrowserRouter>
  );
};

export default App
