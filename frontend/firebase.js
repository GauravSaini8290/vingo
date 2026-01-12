// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "vingo-food-bd4c8.firebaseapp.com",
  projectId: "vingo-food-bd4c8",
  storageBucket: "vingo-food-bd4c8.firebasestorage.app",
  messagingSenderId: "724671274964",
  appId: "1:724671274964:web:2e867778bbaa1f98fc0041"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)