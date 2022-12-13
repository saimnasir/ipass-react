import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import PrivateRoute from '../../context/PrivateRoute'

const MemoryApp = () => {


  return (
    <PrivateRoute>

      <div>MemoryApp Outlet</div>
      <Outlet />
    </PrivateRoute>
  )
}

export default MemoryApp