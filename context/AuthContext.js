import { db } from "@/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setAuth = (authUser) => {
        setUser(authUser);
    }

    const setUserData = (userData) => {
        setUser({...userData})
    }

    const register = async (email, userId) => {
        try{
            
            await setDoc(doc(db, "users", userId), {
                email,
                userId,
                createdAt : Timestamp.fromDate(new Date()),
            });

            return {success : true};
        }catch(err){
            return {success : false, msg : err};
        }
    }

    return (
        <AuthContext.Provider value={{ user, setAuth, setUserData , register}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}