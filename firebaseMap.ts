import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For now, we are using placeholders. The user needs to replace these with actual values.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-PLACEHOLDER",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "costli-app.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "costli-app",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "costli-app.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};
