import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { app, firestore } from '../../Firebase';
import AssignRole from './AssignRole';

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
        <div className="min-h-screen bg-gray-100">
            <header className="bg-indigo-600 text-white p-4">
                <h1 className="text-2xl">Admin Panel</h1>
            </header>
            <main className="p-4">
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Rental Applications</h2>
                    {/* This can be a list or table displaying rental application data */}
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-4">Other Section</h2>
                    {/* Any other section you'd like to add */}
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-4">Assign Role</h2>
                    <AssignRole />
                </section>
            </main>
        </div>
    );
};

export default AdminPanel;
