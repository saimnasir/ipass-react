import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoute = ({ children }) => {
    const { user, setUser } = useAuth()
  
    return <>
        {user ? <>{children}</> : <Navigate to={'/login'} replace={true} />
        }
    </>
}

export default PrivateRoute