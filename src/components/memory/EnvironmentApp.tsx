import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import PrivateRoute from '../../context/PrivateRoute'

const EnvironmentApp = () => {


  return (
    <PrivateRoute>

      <div>EnvironmentApp Outlet</div>
      <Outlet />
    </PrivateRoute>
  )
}

export default EnvironmentApp