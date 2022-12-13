import React, { createContext, useContext, useState, useEffect } from "react";
import { getData, removeData, storeData } from "../helpers/localStorage";
const Context = createContext();

export const AuthProvider = ({ children }) => {
    const USER_KEY = 'user'
    const initialState = getData(USER_KEY);
    const [user, setUser] = useState(initialState) 

    useEffect(() => { 
        if (user) {
            storeData(USER_KEY, user)
        } else {
            removeData(USER_KEY)
        }
    }, [user])

    const data = { user, setUser } 
    
    return (
        <Context.Provider value={data}>
            {children}
        </Context.Provider>
    )

}

export const useAuth = () => {
    return useContext(Context)
}