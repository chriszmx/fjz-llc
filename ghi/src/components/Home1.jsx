import Logo from '../assets/logo-color.png'
// import { signInWithGoogle, db } from './utils/authUtils'
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { PacmanLoader } from 'react-spinners';
import checkRedirectResult from './utils/checkRedirectResult';
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "../Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";


export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const checkUserAuth = async () => {
      const user = await checkRedirectResult();
      if (user) {
        handleUser(user);
      }
    };
    checkUserAuth();
  }, []);

  const handleUser = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        switch (userData.role) {
          case "admin":
            navigate("/admin");
            break;
          case "guest":
            navigate("/application");
            break;
          case "employee":
            navigate("/employee");
            break;
          case "renter":
            navigate("/profile");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error("Error in handleUser:", error);
      setLoading(false);
      toast.error("Error processing user data!");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success("Successfully logged in with Google!");
      return result.user; // This will return the signed-in user
    } catch (error) {
      console.error(error);
      toast.error("Error logging in with Google!");
    }
  };


  const handleSignInWithGoogle = async () => {
    setLoading(true);
    console.log("Started loading...");
    try {
      const user = await signInWithGoogle();
      if (user) {
        await handleUser(user);
        // No need for a timeout here. Stop loading immediately after handling the user.
        setLoading(false);
      }
    } catch (error) {
      console.error("Redirection error:", error);
      setLoading(false);
    }
  };


  // const handleSignInWithGoogle = async () => {
  //     setLoading(true);
  //     console.log("Started loading...");
  //     try {
  //         const user = await signInWithGoogle();
  //         if (user) {
  //             await handleUser(user);
  //             // ITS PACMAN!
  //             console.log("Starting Pacman timer...");
  //             setTimeout(() => {
  //                 console.log("Stopping loading after 5 seconds...");
  //                 setLoading(false);
  //             }, 7000);
  //         }
  //     } catch (error) {
  //         console.error("Redirection error:", error);
  //         setLoading(false);
  //     }
  // };




  return (
<div className="bg-white dark:bg-gray-900">
  {loading ? (
    <div className="flex flex-col justify-center items-center h-screen animate-pulsate space-y-5 bg-gray-50 dark:bg-gray-900">
        <PacmanLoader color="#123abc" size={50} />
        <div className="text-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow-lg">
            <p className="mb-2 text-gray-700 dark:text-gray-300">Having trouble loading?</p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">Preferred browser support: Google Chrome.</p>
            <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-500 dark:hover:text-indigo-300">
                If using iPhone & Safari Browser, click HERE & click 'Login In With Google' Twice.
            </a>
        </div>
    </div>

      ) : (
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto dark:text-indigo-500">
                Welcome to FJZ LLC
              </h1>

              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Simple, easy, and transparent apartment applications. Apply for your future apartment with a few simple steps. Track the progress of your application in real-time. <br /><br />$0 Application Fee. <br /><br />Sign in with Google to get started.
                </p>


                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    onClick={e => {
                      e.preventDefault();
                      handleSignInWithGoogle();
                    }}
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center text-xl"
                  >
                    Click Here to Sign In With Google
                    <br />
                    Fill Out Application
                  </a>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-x-6">
                <h2>Current Listings:</h2>
                <ul>
                  <li>1108 Kenmore Ave, Buffalo 14216</li>
                  <li>APT 5</li>
                  <li>1 Bedroom 1 Bath</li>
                  <li>900 sqft</li>
                  <li>Available November 1st</li>
                  <li>$900/month</li>
                </ul>
<br />
                <ul>
                  <li>171 Mead St, Tonawanda 14150</li>
                  <li>APT 5</li>
                  <li>1 Bedroom 1 Bath</li>
                  <li>900 sqft</li>
                  <li>Available December 1st</li>
                  <li>$1,000/month</li>
                </ul>
              </div>

              <img
                src={Logo}
                alt=""
                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
        </div>
      )}
    </div>
  )
}
