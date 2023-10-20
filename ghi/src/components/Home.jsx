import React from 'react';
import logo from "../assets/logo-color.png";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {/* Hero section */}
            <div className="pt-10 px-5">
                <img src={logo} alt="Logo" className="mx-auto h-60 w-auto shadow-lg bg-white hover:opacity-75 rounded-lg" />
                <h1 className="mt-6">Welcome to FJZ LLC</h1>
                <p className="mt-2">
                    Your one-stop platform for seamless apartment applications.
                </p>
            </div>

            {/* Services section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-5">
                <div className="py-5 px-6 bg-white rounded-md shadow-md text-left">
                    <h3>Easy Applications</h3>
                    <p className="mt-2">Apply for your future apartment with a few simple steps.</p>
                </div>
                <div className="py-5 px-6 bg-white rounded-md shadow-md text-left">
                    <h3>Transparent Process</h3>
                    <p className="mt-2">Track the progress of your application in real-time.</p>
                </div>
            </div>

            {/* Call to action */}
            <div className="mt-10 px-5">
                <Link to="/login" className="cta-btn btn-primary">
                    Log In
                </Link>
                <Link to="/application" className="ml-3 cta-btn btn-secondary">
                    Apply Now
                </Link>
            </div>

            {/* Footer */}
            <footer className="mt-auto text-sm">
                <p>© 2023 FJZ LLC. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
