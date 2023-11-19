import Navbar from './navbar'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useLogoutMutation } from '@/slices/usersApiSlice'
import { logout } from '@/slices/authSlice'
import { MdAnalytics, MdOutlineAnalytics, MdOutlineSpaceDashboard, MdSpaceDashboard } from 'react-icons/md'
import { PiUsersFill, PiUsersBold } from 'react-icons/pi'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { AiOutlineSchedule, AiFillSchedule } from 'react-icons/ai'

import ccslogo from './../../assets/images/ccs.jpg'
import coelogo from './../../assets/images/coe.jpg'
import SubNav from './subNav'
import { useEffect } from 'react'

const AdminNav = () => {
    const location = useLocation();

    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { role, department } = userInfo

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if (!userInfo) {
            navigate('/login');
        }

        if (role !== 'admin') {
            navigate('/')
        }

    }, [])

    return (
        <>
            <Navbar>
                <div className="flex flex-col items-center gap-3">
                    <div className='h-20 rounded-full min-h-5 aspect-square overflow-clip'>
                        {
                    department == 'ccs' ?
                    <img src={ccslogo} alt="" className='h-full' /> :
                    <img src={coelogo} alt="" className='h-full' />
                    }
                    </div>

                    <h2 className='text-center'>
                        {
                            department == 'ccs' ? 'College of Computer Studies' : 'College of Engineering'
                        }
                    </h2>

                </div>

                <div className='flex flex-col w-full h-full gap-3'>
                    <NavLink className='aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center gap-2' to='home'>
                        {({ isActive }) => (
                            isActive ?
                                <>
                                    <MdSpaceDashboard size={20} />
                                    Home
                                </>
                                :
                                <>
                                    <MdOutlineSpaceDashboard size={20} />
                                    Home
                                </>
                        )}
                    </NavLink>

                    <NavLink className='aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center gap-2' to='users'>
                        {({ isActive }) => (
                            isActive ?
                                <>
                                    <PiUsersFill size={20} />
                                    Users
                                </>
                                :
                                <>
                                    <PiUsersBold size={20} />
                                    Users
                                </>
                        )}
                    </NavLink>

                    <NavLink className='aria-[current]:bg-primary-blue-500 aria-[current]:text-white py-4 px-3 rounded-lg transition-all text-primary-blue-900/50 hover:bg-primary-blue-500 hover:text-white flex items-center gap-2' to='faculty-schedules'>
                        {({ isActive }) => (
                            isActive ?
                                <>
                                    <AiFillSchedule size={20} />
                                    Faculty Schedules
                                </>
                                :
                                <>
                                    <AiOutlineSchedule size={20} />
                                    Faculty Schedules
                                </>
                        )}
                    </NavLink>

                    <SubNav
                        label="Accomplishment Report"
                        icon={{ active: <MdAnalytics size={25} />, inactive: <MdOutlineAnalytics size={25} /> }}
                        active={location.pathname.includes('admin/accomplishment-reports')}

                    >
                        <Link to="accomplishment-reports/regular" className='hover:bg-primary-blue-500 hover:text-white py-5 px-5 bg-white'>Regular Faculty</Link>
                        <Link to="accomplishment-reports/part-time" className='hover:bg-primary-blue-500 hover:text-white py-5 px-5 bg-white'>Part Time Faculty</Link>
                    </SubNav>

                    <button onClick={logoutHandler} className='rounded-lg px-5 py-5 mt-auto text-red-500 transition-all hover:bg-red-500 hover:text-white text-left flex gap-2 items-center'>
                        <RiLogoutBoxLine size={20} /> Logout
                    </button>
                </div>
            </Navbar>

            <div className='flex flex-col ml-[14rem] p-6 bg-white min-h-screen'>
                <Outlet />
            </div>
        </>
    )
}

export default AdminNav
