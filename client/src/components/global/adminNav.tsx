import React from 'react'
import Navbar from './navbar'
import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '../ui/button'

const AdminNav = () => {
  return (
    <>
      <Navbar>

        <div className="h-20 bg-white rounded-full min-h-5 aspect-square"></div>

        <div className="flex flex-col w-full h-full gap-5 px-5">
          <Button asChild> 
            <NavLink to='/admin'> Home </NavLink>
          </Button>

          <Button asChild>
            <NavLink to='register'> Register </NavLink>
          </Button>
        </div>
      </Navbar>

      <div className="flex flex-col ml-[14rem] p-6">
        <Outlet />
      </div>
    </>
  )
}

export default AdminNav