import Navbar from './navbar'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useLogoutMutation, useGetProfileQuery } from '@/slices/usersApiSlice'
import { logout } from '@/slices/authSlice'
import ccslogo from './../../assets/images/ccs.jpg'
import coelogo from './../../assets/images/coe.jpg'

import { RiLogoutBoxLine } from 'react-icons/ri'
import { RiFileWarningFill } from 'react-icons/ri'

import {
    MdAnalytics,
    MdOutlineAnalytics,
    MdOutlineSpaceDashboard,
    MdSpaceDashboard,
} from 'react-icons/md'
import { useState, useEffect } from 'react'
import { BsCalendar2Week, BsFillCalendar2WeekFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

const UserNav = () => {
    const [pending, setPending] = useState(false)

    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { data: user } = useGetProfileQuery(userInfo!._id as string)

    const { role, department } = userInfo
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && user.isPendingAR) {
            setPending(user.isPendingAR.status)
        }
    }, [user])

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            toast.dismiss()

            await logoutApiCall().unwrap()
            dispatch(logout())

            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        if (role === 'admin') {
            navigate('/admin')
        }
    }, [])

    return (
        <>
            <Navbar department={department}>
                <div className='flex flex-col items-center gap-3'>
                    <div className='h-20 rounded-full min-h-5 aspect-square overflow-clip'>
                        {department == 'ccs' ? (
                            <img src={ccslogo} alt='' className='h-full' />
                        ) : (
                            <img src={coelogo} alt='' className='h-full' />
                        )}
                    </div>

                    <h2 className='text-center'>
                        {department == 'ccs'
                            ? 'College of Computer Studies'
                            : 'College of Engineering'}
                    </h2>
                </div>

                <div className='flex flex-col w-full h-full gap-3'>
                    <NavLink
                        className='aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center gap-2'
                        to='/'>
                        {({ isActive }) =>
                            isActive ? (
                                <>
                                    <MdSpaceDashboard size={20} />
                                    Home
                                </>
                            ) : (
                                <>
                                    <MdOutlineSpaceDashboard size={20} />
                                    Home
                                </>
                            )
                        }
                    </NavLink>

                    <NavLink
                        className='relative aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center justify-between gap-2'
                        to='accomplishment-reports'>
                        {({ isActive }) =>
                            isActive ? (
                                <>
                                    <MdAnalytics size={25} />
                                    Accomplishment Reports
                                    {pending == true && (
                                        <RiFileWarningFill className='absolute top-[-6px] right-[-8px] w-6 h-6 text-[#ff0000]' />
                                    )}
                                </>
                            ) : (
                                <>
                                    <MdOutlineAnalytics size={25} />
                                    Accomplishment Reports
                                    {pending == true && (
                                        <RiFileWarningFill className='absolute top-[-6px] right-[-8px] w-6 h-6 text-[#ff0000]' />
                                    )}
                                </>
                            )
                        }
                    </NavLink>

                    <NavLink
                        className='aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center gap-2'
                        to='schedule'>
                        {({ isActive }) =>
                            isActive ? (
                                <>
                                    <BsFillCalendar2WeekFill size={20} />
                                    My Schedule
                                </>
                            ) : (
                                <>
                                    <BsCalendar2Week size={20} />
                                    My Schedule
                                </>
                            )
                        }
                    </NavLink>

                    <button
                        onClick={logoutHandler}
                        className='rounded-lg px-5 py-5 mt-auto text-red-500 transition-all hover:bg-red-500 hover:text-white text-left flex gap-2 items-center'>
                        <RiLogoutBoxLine size={20} /> Logout
                    </button>
                </div>
            </Navbar>

            <div className='flex flex-col ml-[14rem] p-6 bg-[#FAFAFA] min-h-screen'>
                <Outlet />
            </div>
        </>
    )
}

export default UserNav
