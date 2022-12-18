import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import PrivateRoute from '../../context/PrivateRoute'

const TenantApp = () => {


  return (
    <PrivateRoute>

      <div>TenantApp Outlet</div>
      <Outlet />
    </PrivateRoute>
  )
}

export default TenantApp