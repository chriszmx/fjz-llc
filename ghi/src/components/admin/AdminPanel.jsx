import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { app, firestore } from '../../Firebase';
import Calendar from 'react-calendar';
import AssignRole from './AssignRole';
import AdminViewApplications from './AdminViewApplications';
import TimeClockAdmin from './TimeClockAdmin';
import ViewBookings from './ViewBookings';
import 'react-calendar/dist/Calendar.css';


const AdminPanel = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);
    const auth = getAuth(app);
    const [value, onChange] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const componentsList = [
        { title: 'View Applications', component: <AdminViewApplications /> },
        { title: 'Time Clock', component: <TimeClockAdmin /> },
        { title: 'Assign Role', component: <AssignRole /> },
        { title: 'View Bookings', component: <ViewBookings /> },
        { title: 'Calendar', component: <Calendar onChange={onChange} value={value} className="text-black bg-gray-400 my-4" /> }
    ];

    const [activeComponentIndex, setActiveComponentIndex] = useState(null);

    const setActiveComponentByIndex = (index) => {
        setActiveComponentIndex(index);
        setActiveComponent(componentsList[index].component);
    };

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                const userDocRef = doc(firestore, 'users', user.uid);
                const unsubscribeUser = onSnapshot(userDocRef, docSnapshot => {
                    if (docSnapshot.exists() && docSnapshot.data().role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                });
                return unsubscribeUser;
            }
        });

        return () => unsubscribeAuth();
    }, [auth]);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 h-full">
            <header className="bg-indigo-600 text-white p-4 dark:bg-indigo-900 dark:text-gray-200">
                <h1 className="text-2xl mb-4">Admin Panel</h1>

                <div className="mb-4 flex space-x-4">
                    {componentsList.map((item, index) => (
                        <button
                            key={index}
                            className={`p-2 rounded transition duration-200
                            ${index === activeComponentIndex ? "bg-indigo-900" : "bg-indigo-600 hover:bg-indigo-700"}
                            dark:${index === activeComponentIndex ? "bg-indigo-400" : "hover:bg-indigo-500"}
                            text-white`}
                            onClick={() => setActiveComponentByIndex(index)}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>

                <p className='dark:text-gray-400'>{currentDateTime.toLocaleString()}</p>
            </header>

            <main className="p-4 flex justify-center items-center h-full">
                {activeComponent}
            </main>
        </div>
    );
};

export default AdminPanel;
