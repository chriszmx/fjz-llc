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
import Footer from "./components/footer/Footer";
import { RingLoader } from 'react-spinners';  // Import the spinner

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
        return <div className="flex justify-center items-center h-screen"><RingLoader color="#123abc" size={500} /></div>;
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
                    <Footer />
                </>
            </DarkModeProvider>
        </BrowserRouter>
    );
};

export default App;
