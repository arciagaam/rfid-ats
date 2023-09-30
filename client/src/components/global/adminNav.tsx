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
        console.log('logout')
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
                <div className='h-20 bg-white rounded-full min-h-5 aspect-square'></div>

                <div className='flex flex-col w-full h-full gap-5 px-5'>
                    <Button asChild>
                        <NavLink to='/admin'> Home </NavLink>
                    </Button>

                    <Button asChild>
                        <NavLink to='register'> Register </NavLink>
                    </Button>

                    <Button asChild onClick={logoutHandler}>
                        <NavLink to='register'> Logout </NavLink>
                    </Button>
                </div>
            </Navbar>

            <div className='flex flex-col ml-[14rem] p-6'>
                <Outlet />
            </div>
        </>
    )
}

export default AdminNav
