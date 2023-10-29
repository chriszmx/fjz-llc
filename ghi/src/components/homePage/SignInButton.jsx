import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import {
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../Firebase";
import checkRedirectResult from '../utils/checkRedirectResult';
import { PacmanLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


function SignInButton() {
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const navigate = useNavigate();

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
      const auth = getAuth(app);
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Redirection error:", error);
      setLoading(false);
    }
  };

  return (
    <div>
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
        <div>
          <button
            onClick={handleSignInWithGoogle}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Click Here to Sign In With Google &rarr; Start Your Application
          </button>
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default SignInButton;
