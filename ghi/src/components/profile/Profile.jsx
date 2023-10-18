import React from 'react';

const Profile = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-600">Profile</h1>
                    <button className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 focus:outline-none">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left column for the avatar */}
                    <div className="flex justify-center items-center">
                        <img src="/path-to-avatar.jpg" alt="User Avatar" className="w-48 h-48 rounded-full object-cover shadow-lg" />
                    </div>

                    {/* Right column for user details */}
                    <div>
                        <h2 className="text-2xl mb-4">John Doe</h2>
                        <p className="mb-2"><span className="font-semibold">Email:</span> johndoe@example.com</p>
                        <p className="mb-2"><span className="font-semibold">Joined:</span> January 1, 2023</p>
                        <p className="mb-2"><span className="font-semibold">Role:</span> Member</p>

                        {/* Inject other components here */}
                        {/* <OtherComponent /> */}
                        {/* <AnotherComponent /> */}
                    </div>
                </div>

                {/* Additional content can be added below */}
                <div className="mt-8">
                    {/* Inject additional components here */}
                    {/* <MoreComponents /> */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
