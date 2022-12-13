import React from 'react'
import { Outlet } from 'react-router-dom'
import PrivateRoute from '../../context/PrivateRoute'

const OrganizationApp = () => {
    return (
        <PrivateRoute>

            <div>OrganizationApp Outlet</div>
            <Outlet />
        </PrivateRoute>
    )
}

export default OrganizationApp