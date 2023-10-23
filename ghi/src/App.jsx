import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { DarkModeProvider } from "./components/darkMode/darkModeContext";
import NavBar from "./components/navbar/NavBar";
import Home from "./components/Home";
import Login from "./components/login/Login";
import AdminPanel from "./components/admin/AdminPanel";
import Profile from "./components/profile/Profile";
import Application from "./components/application/Application";
import TimeClock from "./components/employee/TimeClock";
import Status from "./components/Status";
import { ClipLoader } from 'react-spinners';  // Import the spinner

function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
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
        return <ClipLoader color="#123abc" size={50} />;
    }

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
                        <Route path="/employee" element={<TimeClock />} />
                    </Routes>
                    <Status />
                </>
            </DarkModeProvider>
        </BrowserRouter>
    );
};

export default App;
