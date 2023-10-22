import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { app, firestore } from '../../Firebase';

import AssignRole from './AssignRole';
import AdminViewApplications from './AdminViewApplications';


const AdminPanel = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth(app);

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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-indigo-600 text-white p-4 dark:bg-indigo-900 dark:text-gray-200">
                <h1 className="text-2xl">Admin Panel</h1>
            </header>
            <main className="p-4">

                <section className='mt-5 mb-10'>
                    {/* <h2 className="text-xl font-bold mb-4">View Applications</h2> */}
                    <AdminViewApplications />
                </section>

                <section className='mt-10 mb-10'>
                    {/* <h2 className="text-xl font-bold mb-4">Assign Role</h2> */}
                    <AssignRole />
                </section>

            </main>
        </div>
    );
};

export default AdminPanel;
