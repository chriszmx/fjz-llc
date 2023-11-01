import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { app, firestore } from '../../Firebase';

import AssignRole from './AssignRole';
import AdminViewApplications from './AdminViewApplications';
import TimeClockAdmin from './TimeClockAdmin';
import ViewBookings from './ViewBookings';

const AdminPanel = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);
    const auth = getAuth(app);

    const componentsList = [
        { title: 'View Applications', component: <AdminViewApplications /> },
        { title: 'Time Clock', component: <TimeClockAdmin /> },
        { title: 'Assign Role', component: <AssignRole /> },
        { title: 'View Bookings', component: <ViewBookings /> }
    ];

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

    if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 h-full">
            <header className="bg-indigo-600 text-white p-4 dark:bg-indigo-900 dark:text-gray-200">
                <h1 className="text-2xl">Admin Panel</h1>
                </header>
            <main className="p-4">

                <div className="mb-6">
                    {componentsList.map((item, index) => (
                        <button
                        key={index}
                        className="mr-4 p-2 mt-4 mb-4 bg-indigo-600 hover:bg-indigo-900 text-white rounded dark:bg-indigo-900 dark:hover:bg-indigo-600 focus:outline-none transition duration-200"
                        onClick={() => setActiveComponent(item.component)}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>

                <section className='mt-5 mb-10'>
                    {activeComponent}
                </section>

            </main>
        </div>
    );
};

export default AdminPanel;
