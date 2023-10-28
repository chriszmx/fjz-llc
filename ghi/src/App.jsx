import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { DarkModeProvider } from "./components/darkMode/darkModeContext";
import NavBar from "./components/navbar/NavBar";
import SideNav from "./components/navbar/SideNav";

import Home from "./components/Home";
import Login from "./components/login/Login";
import AdminPanel from "./components/admin/AdminPanel";
import Profile from "./components/profile/Profile";
import Application from "./components/application/Application";
import TimeClock from "./components/employee/TimeClock";
import Footer from "./components/footer/Footer";
import EmployeeAI from "./components/ai-chat/EmployeeAI";
import { RingLoader } from 'react-spinners';
import checkRedirectResult from "./components/utils/checkRedirectResult";

function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

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

        return () => unsubscribe();  // Cleanup on component unmount
    }, []);

    if (initializing) {
        return <div className="flex justify-center items-center h-screen bg-gray-900"><RingLoader color="#123abc" size={200} /></div>;
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
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/employee" element={<TimeClock />} />
                    <Route path="/AI-Employee-Assistant" element={<EmployeeAI />} />
                </Routes>
                <Footer />
            </DarkModeProvider>
        </BrowserRouter>
    );
};

export default App;
