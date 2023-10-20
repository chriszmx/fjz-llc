import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DarkModeProvider } from "./components/darkMode/darkModeContext"
import NavBar from "./components/navbar/NavBar"
import Home from "./components/Home"
import Login from "./components/login/Login"
import AdminPanel from "./components/admin/AdminPanel"
import Profile from "./components/profile/Profile"
import Application from "./components/application/Application"

import Status from "./components/Status"

function App() {

  return (
    <BrowserRouter>
    <DarkModeProvider>
      <NavBar />
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/application" element={<Application />} />
          <Route path="/employee" element={<h1>Employee</h1>} />
        </Routes>
        <Status />
      </>
      </DarkModeProvider>
    </BrowserRouter>

  );
};

export default App
