import React from "react";
import { getAuth, signOut } from 'firebase/auth';
import { app } from "../Firebase";

const Logout = () => {
    const auth = getAuth(app);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button className="text-red-500 hover:underline cursor-pointer"
        onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default Logout;
