import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const location = useLocation();

    const navigate = useNavigate();
    const db = getFirestore(app);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            (async () => {  // This is an immediately invoked async function
                if (user && location.pathname === "/login") {
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
                }
            })();
        });

        return () => unsubscribe();
    }, [auth, db, navigate, location]);


    const handleLogin = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Successfully logged in!");
        } catch (error) {
            console.error(error);
            toast.error("Error logging in!");
        }
    };

    const signInWithGoogle = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast.success("Successfully logged in with Google!");
        } catch (error) {
            console.error(error);
            toast.error("Error logging in with Google!");
        }
    };

    const handleRegister = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Successfully registered!");
        } catch (error) {
            console.error(error);
            toast.error("Error during registration!");
        }
    };


    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent!");
        } catch (error) {
            console.error(error);
            toast.error("Error sending reset email!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-blue-500 to-green-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-gray-200">
                        {isLogin ? "Sign In to your account" : "Register a new account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                        {isLogin ? "Don't have a Gmail? Create an account with any email. " : "Already have an account? "}
                        <span
                            className="cursor-pointer text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Register now!" : "Login!"}
                        </span>
                    </p>
                </div>
                <input
                    className="w-full px-3 py-2 mt-8 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full px-3 py-2 mt-4 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isLogin ? (
                    <>
                        <button
                            className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none hover:bg-indigo-700"
                            type="button"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <p className="text-red-500 text-center pt-5 pb-3"><strong>If using an iPhone with Safari <br /> Please Click <br /> -- Login with Google Twice --</strong></p>
                        <button
                            className="w-full mt-2 bg-red-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-red-600"
                            type="button"
                            onClick={signInWithGoogle}
                        >
                            Login / Register with Google
                        </button>
                        <p className="mt-3 text-sm text-right text-gray-600 hover:text-indigo-700 cursor-pointer dark:text-gray-200" onClick={handleForgotPassword}>
                            Forgot Password?
                        </p>
                    </>
                ) : (
                    <button
                        className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded focus:outline-none hover:bg-green-700"
                        type="button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
