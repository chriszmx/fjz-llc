import React from "react"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Logout from "./components/Logout"
import Status from "./components/Status"
import Test from "./components/Test"
import ApplicationForm from "./components/ApplicationForm"

function App() {
  return (
    <>
      <Status/>
      <Test/>
      <Logout/>
      <ApplicationForm/>
      <Login/>
      <SignUp/>
    </>
  )
};

export default App
