import React, { createContext, useContext, useState, useEffect } from "react";
import { getData, removeData, storeData } from "../helpers/localStorage";
const Context = createContext();

export const TenantProvider = ({ children }) => {
    const TENANT_KEY = 'tenant'
    const initialState = getData(TENANT_KEY);
    const [tenant, setTenant] = useState(initialState) 

    useEffect(() => { 
        if (tenant) {
            storeData(TENANT_KEY, tenant)
        } else {
            removeData(TENANT_KEY)
        }
    }, [tenant])

    const data = { tenant, setTenant } 
    
    return (
        <Context.Provider value={data}>
            {children}
        </Context.Provider>
    )

}

export const useTenant= () => {
    return useContext(Context)
}