import React from 'react'
import Navbar from './navbar'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useLogoutMutation } from '@/slices/usersApiSlice'
import { logout } from '@/slices/authSlice'
import { Button } from '../ui/button'

const AdminNav = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Navbar>
                <div className='h-20 rounded-full bg-primary-purple-700 min-h-5 aspect-square'></div>

                <div className='flex flex-col w-full h-full'>
                        <NavLink className='px-5 py-5 transition-all text-primary-purple-800 hover:bg-primary-purple-800 hover:text-white' to='/admin'> Home </NavLink>
                        <NavLink className='px-5 py-5 transition-all text-primary-purple-800 hover:bg-primary-purple-800 hover:text-white' to='users'> Users </NavLink>
                        <button onClick={logoutHandler} className='px-5 py-5 mt-auto text-red-500 transition-all hover:bg-red-500 hover:text-white'> Logout </button>
                </div>
            </Navbar>

            <div className='flex flex-col ml-[14rem] p-6 bg-[#FAFAFA] min-h-screen'>
                <Outlet />
            </div>
        </>
    )
}

export default AdminNav
