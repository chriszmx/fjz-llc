import { React, useState, useEffect} from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from "../Firebase";
import DarkModeToggle from "../components/darkMode/DarkModeToggle";

const Status = () => {
    const auth = getAuth(app);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <div>

            {user ? (
                <><p>Welcome, {user.email}!</p><div><DarkModeToggle /></div></>

            ) : (
                <p>No user is currently logged in.</p>
            )}
        </div>
    );
};

export default Status;
