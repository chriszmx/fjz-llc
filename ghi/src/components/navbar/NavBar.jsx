import { useState, useEffect, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../Firebase';
import DarkModeToggle from '../darkMode/DarkModeToggle';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const NavBar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const location = useLocation();

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

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    const userMenuLinks = [
        // { name: 'Your Profile', href: '/profile' },
        // { name: 'Settings', href: '#settings' },
        // { name: 'Logout', onClick: handleLogout }
        ...loggedIn ? [{name: `${user.email}` }, { name: 'Profile', href: '/profile' }, { name: 'Logout', onClick: handleLogout }] : [],
    ];

    const navigationLinks = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        ...loggedIn ? [] : [],
        ...role === 'admin' ? [{ name: 'Admin', href: '/admin', current: location.pathname === '/admin' }] : [],
        ...role === 'employee' || role === 'admin' ? [{ name: 'Employee', href: '/employee', current: location.pathname === '/employee' }, { name: 'AI Assistant', href: '/AI-Employee-Assistant'}] : [],
        ...role === 'guest' || role === 'admin' ? [{ name: 'Fill Out Application', href: '/application', current: location.pathname === '/application' }] : []
    ];

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link to="/" className="text-white font-semibold">FJZ LLC</Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                    {navigationLinks.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'px-3 py-2 rounded-md text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <DarkModeToggle />

                                <Menu as="div" className="ml-3 relative">
                                    <Menu.Button className="bg-gray-800 rounded-full flex text-sm focus:outline-none hover:text-white focus:text-white">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="https://placedog.net/640/480?random"
                                            alt="User avatar"
                                        />
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        >
                                            {userMenuLinks.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <Link
                                                            to={item.href || '#'}
                                                            onClick={item.onClick}
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigationLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

export default NavBar;








// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { app } from '../../Firebase';
// import DarkModeToggle from '../darkMode/DarkModeToggle';

// const NavBar = () => {
//     const [loggedIn, setLoggedIn] = useState(false);
//     const [role, setRole] = useState(""); // Added role for Firestore
//     const [showMenu, setShowMenu] = useState(false);

//     const navigate = useNavigate();
//     const auth = getAuth(app);
//     const db = getFirestore(app);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 const userDoc = await getDoc(doc(db, 'users', user.uid));
//                 if (userDoc.exists) {
//                     setRole(userDoc.data().role || 'user');
//                 }
//                 setLoggedIn(true);
//             } else {
//                 setLoggedIn(false);
//                 setRole("");
//             }
//         });

//         return () => unsubscribe();
//     }, [auth, db]);

//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             navigate("/");
//         } catch (error) {
//             console.error("Error signing out", error);
//         }
//     };

//     const toggleMenu = () => {
//         setShowMenu(prev => !prev);
//     };

//     const links = [
//         ...loggedIn ? [] : [{ to: "/login", text: "Login/Register" }],
//         { to: "/", text: "Home" },
//         ...role === 'admin' ? [{ to: "/admin", text: "Admin" }] : [],
//         ...role === 'employee' || role === 'admin' ? [{ to: "/employee", text: "Employee" }] : [],
//         ...role === 'guest' || role === 'admin' ? [{ to: "/application", text: "Fill Out Application" }] : [],
//         ...loggedIn ? [
//             { to: "/profile", text: "Profile" },
//             // { to: "/application", text: "Fill Out Application" },
//             { text: "Logout", onClick: handleLogout }
//         ] : []
//     ];

//     return (
//         <nav className="bg-white shadow-lg dark:bg-gray-800">
//             <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center space-x-4">
//                         <Link to="/" className="text-gray-800 hover:text-gray-700 focus:outline-none focus:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400">FJZ LLC</Link>
//                         <DarkModeToggle className="md:mr-4" />
//                     </div>
//                     <div className="md:hidden">
//                         <button onClick={toggleMenu} className="text-gray-800 hover:text-gray-700 focus:outline-none focus:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400">
//                             <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
//                                 {showMenu ? (
//                                     // Close icon
//                                     <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/>
//                                 ) : (
//                                     // Menu icon
//                                     <path fillRule="evenodd" d="M4 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm1 5a1 1 0 100 2h14a1 1 0 100-2H5z" clipRule="evenodd"/>
//                                 )}
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 <div className={`md:flex items-center ${showMenu ? "" : "hidden md:block"}`}>
//                     <div className="flex flex-col md:flex-row md:mx-6">
//                         {links.map((link, index) =>
//                             link.onClick ? (
//                                 <button key={index} onClick={link.onClick} className="my-1 text-sm text-gray-700 hover:underline md:mx-4 md:my-0 dark:text-gray-200">
//                                     {link.text}
//                                 </button>
//                             ) : (
//                                 <Link key={index} to={link.to} className="my-1 text-gray-700 hover:underline md:mx-4 md:my-0 dark:text-gray-200">
//                                     {link.text}
//                                 </Link>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default NavBar;
