import { getFirestore, doc, getDoc } from "firebase/firestore";
import { setPersistence, browserLocalPersistence, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { toast } from "react-toastify";
import { app } from "../../Firebase";


export const db = getFirestore(app);
export const auth = getAuth(app);



export const signInWithGoogle = async () => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // await signInWithRedirect(auth, provider);
        toast.success("Successfully logged in with Google!");
        return auth.currentUser;
    } catch (error) {
        console.error(error);
        toast.error("Error logging in with Google!");
        return null;
    }
};
