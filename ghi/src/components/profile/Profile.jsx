import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        role: '',
        phoneNumber: ''
    });

    const db = getFirestore();
    const auth = getAuth();
    const userID = auth.currentUser.uid;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userID));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                } else {
                    console.log('No such user!');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUserProfile();
    }, [db, userID]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            await updateDoc(doc(db, 'users', userID), {
                phoneNumber: userProfile.phoneNumber,
                name: userProfile.name
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 md:mb-0">Profile</h1>
                    <button className="bg-indigo-600 dark:bg-indigo-500 text-white rounded px-4 py-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none transition duration-200" onClick={handleEditToggle}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                {isEditing ? (
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block font-semibold mb-1 dark:text-gray-300">Name:</label>
                            <input
                                type="text"
                                value={userProfile.name}
                                onChange={(e) => setUserProfile(prevState => ({ ...prevState, name: e.target.value }))}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 dark:text-gray-300">Email:</label>
                            <input
                                type="email"
                                value={userProfile.email}
                                readOnly // Email can't be edited
                                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 dark:text-gray-300">Phone Number:</label>
                            <input
                                type="tel"
                                value={userProfile.phoneNumber}
                                onChange={(e) => setUserProfile(prevState => ({ ...prevState, phoneNumber: e.target.value }))}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mt-4">
                            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 transition duration-200">
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <p className="dark:text-gray-300"><span className="font-semibold">Name:</span> {userProfile.name}</p>
                        <p className="dark:text-gray-300"><span className="font-semibold">Email:</span> {userProfile.email}</p>
                        <p className="dark:text-gray-300"><span className="font-semibold">Role:</span> {userProfile.role}</p>
                        <p className="dark:text-gray-300"><span className="font-semibold">Phone Number:</span> {userProfile.phoneNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
