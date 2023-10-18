import React from 'react'
import logo from "../assets/logo-color.png"
import { Link } from 'react-router-dom'


const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
            {/* Hero section */}
            <div className="pt-10 px-5">
                <img src={logo} alt="Logo" className="mx-auto h-60 w-auto shadow-lg bg-white hover:opacity-75 rounded-lg" />
                <h1 className="mt-6 text-4xl font-extrabold text-gray-900">Welcome to FJZ LLC</h1>
                <p className="mt-2 text-base text-gray-500">
                    Your one-stop platform for seamless apartment applications.
                </p>
            </div>

            {/* Services section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-5">
                <div className="py-5 px-6 bg-white rounded-md shadow-md text-left">
                    <h3 className="text-2xl font-semibold text-gray-800">Easy Applications</h3>
                    <p className="mt-2 text-gray-600">Apply for your future apartment with a few simple steps.</p>
                </div>
                <div className="py-5 px-6 bg-white rounded-md shadow-md text-left">
                    <h3 className="text-2xl font-semibold text-gray-800">Transparent Process</h3>
                    <p className="mt-2 text-gray-600">Track the progress of your application in real-time.</p>
                </div>
            </div>

            {/* Call to action */}
            <div className="mt-10 px-5">
                <Link to="/login" className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Log In
                </Link>
                <Link to="/application" className="ml-3 px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                    Apply Now
                </Link>
            </div>


            {/* Footer */}
            <footer className="mt-auto text-sm text-gray-500">
                <p>© 2023 FJZ LLC. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home
