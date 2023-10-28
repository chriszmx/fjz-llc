import { getRedirectResult } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "./authUtils"

const checkRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);

        // Check if result exists and then check for the user property
        if (result && result.user) {
            toast.success("Successfully logged in with Google!");
            return result.user;
        }
    } catch (error) {
        console.error(error);
        toast.error("Error logging in with Google!");
        return null;
    }
};


export default checkRedirectResult;
