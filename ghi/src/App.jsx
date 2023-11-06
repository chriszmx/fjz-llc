import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { DarkModeProvider } from "./components/darkMode/darkModeContext";
import NavBar from "./components/navbar/NavBar";
import SideNav from "./components/navbar/SideNav";

import Home from "./components/homePage/Home";
import Home1 from "./components/Home1";
import Login from "./components/login/Login";
import AdminPanel from "./components/admin/AdminPanel";
import Profile from "./components/profile/Profile";
import Application from "./components/application/Application";
import TimeClock from "./components/employee/TimeClock";
import Footer from "./components/footer/Footer";
import EmployeeAI from "./components/ai-chat/EmployeeAI";
import { RingLoader } from 'react-spinners';
import checkRedirectResult from "./components/utils/checkRedirectResult";

import AdminViewApplications from "./components/admin/AdminViewApplications";
import TimeClockAdmin from "./components/admin/TimeClockAdmin";
import AssignRole from "./components/admin/AssignRole";
import ViewBookings from "./components/admin/ViewBookings";
import AiAppEvaluation from "./components/admin/AIAppEvaluation";



function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [showSlowLoadingMessage , setShowSlowLoadingMessage] = useState(false);

    useEffect(() => {
        checkRedirectResult();
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setInitializing(false);
        });

        const timeoutId = setTimeout(() => {
            setShowSlowLoadingMessage(true);
        }, 5000); // Show after 5 seconds

        return () => {
            unsubscribe();  // Cleanup on component unmount
            clearTimeout(timeoutId); // Clear the timeout if component is unmounted
        };
    }, []);

    const handleForceLoad = () => {
        setInitializing(false);
    };

    if (initializing) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <RingLoader color="#123abc" size={200} />
                <div>
                    <h1 className="text-2xl text-white">Loading Your Future Apartment...</h1>
                    {showSlowLoadingMessage && (
                        <div>
                            {/* <a className="text-white" href="https://fjz-llc.web.app/">Loading slow? Please click HERE.</a> */}
                            <button onClick={handleForceLoad} className="mt-2 p-2 bg-blue-500 text-white rounded">Force Load</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <BrowserRouter>
            <DarkModeProvider>
                {/* Display SideNav on mobile and hide on medium screens and up */}
                <div className="sm:hidden">
                    <SideNav />
                </div>

                {/* Hide NavBar on mobile and display on medium screens and up */}
                <div className="hidden sm:block">
                    <NavBar />
                </div>

                <Routes>
                    <Route path="/test" element={<Home1 />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/view-applications" element={<AdminViewApplications />} />
                    <Route path="/timeclock-admin" element={<TimeClockAdmin />} />
                    <Route path="/assign-role" element={<AssignRole />} />
                    <Route path="/view-bookings" element={<ViewBookings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/employee" element={<TimeClock />} />
                    <Route path="/AI-Employee-Assistant" element={<EmployeeAI />} />
                    <Route path="/AI-App-Evaluation" element={<AiAppEvaluation />} />
                </Routes>
                <Footer />
            </DarkModeProvider>
        </BrowserRouter>
    );
};

export default App;
