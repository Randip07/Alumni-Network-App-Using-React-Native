// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIkzIKN2LI4ZWkhY3IHBRfwugLgfGJdtk",
  authDomain: "connect-e9f45.firebaseapp.com",
  projectId: "connect-e9f45",
  storageBucket: "connect-e9f45.firebasestorage.app",
  messagingSenderId: "854762368709",
  appId: "1:854762368709:web:3ba13708f4aef921be4aac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence : getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");