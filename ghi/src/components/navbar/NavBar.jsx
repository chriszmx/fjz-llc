import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../Firebase';
import DarkModeToggle from '../darkMode/DarkModeToggle';

const NavBar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState(""); // Added role for Firestore
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists) {
                    setRole(userDoc.data().role || 'user');
                }
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
                setRole("");
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    const links = [
        ...loggedIn ? [] : [{ to: "/login", text: "Login/Register" }],
        { to: "/", text: "Home" },
        ...role === 'admin' ? [{ to: "/admin", text: "Admin" }] : [],
        ...role === 'employee' || role === 'admin' ? [{ to: "/employee", text: "Employee" }] : [],
        ...loggedIn ? [
            { to: "/profile", text: "Profile" },
            { to: "/application", text: "Fill Out Application" },
            { text: "Logout", onClick: handleLogout }
        ] : []
    ];

    return (
        <nav className="bg-white shadow-lg dark:bg-gray-800">
            <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-800 hover:text-gray-700 focus:outline-none focus:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400">FJZ LLC</Link>
                        <DarkModeToggle className="md:mr-4" />
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-gray-800 hover:text-gray-700 focus:outline-none focus:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400">
                            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                {showMenu ? (
                                    // Close icon
                                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                ) : (
                                    // Menu icon
                                    <path fillRule="evenodd" d="M4 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm1 5a1 1 0 100 2h14a1 1 0 100-2H5z" clipRule="evenodd"/>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`md:flex items-center ${showMenu ? "" : "hidden md:block"}`}>
                    <div className="flex flex-col md:flex-row md:mx-6">
                        {links.map((link, index) =>
                            link.onClick ? (
                                <button key={index} onClick={link.onClick} className="my-1 text-sm text-gray-700 hover:underline md:mx-4 md:my-0 dark:text-gray-200">
                                    {link.text}
                                </button>
                            ) : (
                                <Link key={index} to={link.to} className="my-1 text-gray-700 hover:underline md:mx-4 md:my-0 dark:text-gray-200">
                                    {link.text}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
