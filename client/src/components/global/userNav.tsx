import Navbar from './navbar'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useLogoutMutation } from '@/slices/usersApiSlice'
import { logout } from '@/slices/authSlice'
import logo from './../../assets/images/logo.png'

import { RiLogoutBoxLine } from 'react-icons/ri'
import { MdAnalytics, MdOutlineAnalytics, MdOutlineSpaceDashboard, MdSpaceDashboard } from 'react-icons/md'
import { useEffect } from 'react'

const UserNav = () => {

  const location = useLocation();

  const { userInfo } = useSelector((state: RootState) => state.auth)

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
    if(!userInfo) {
      navigate('/login');
    }

    const { role } = userInfo;

    if (role === 'admin') {
      navigate('/admin')
    }

  }, []);

  return (
    <>
      <Navbar>
        <div className="flex flex-col items-center gap-3 px-5">
          <div className='h-20 rounded-full min-h-5 aspect-square'>
            <img src={logo} alt="" className='h-full' />
          </div>

          <h2 className='text-center'>College of Computer Studies</h2>
        </div>

        <div className='flex flex-col w-full h-full'>
          <NavLink className='aria-[current]:bg-primary-purple-800 aria-[current]:text-white px-5 py-5 transition-all text-black/30 hover:bg-primary-purple-800 hover:text-white flex items-center gap-2' to='/'>
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


          <NavLink className='aria-[current]:bg-primary-purple-800 aria-[current]:text-white px-5 py-5 transition-all text-black/30 hover:bg-primary-purple-800 hover:text-white flex items-center gap-2' to='accomplishment-reports'>
            {({ isActive }) => (
              isActive ?
                <>
                  <MdAnalytics size={20} />
                  Accomplishment Reports
                </>
                :
                <>
                  <MdOutlineAnalytics size={20} />
                  Accomplishment Reports
                </>
            )}
          </NavLink>


          <button onClick={logoutHandler} className='px-5 py-5 mt-auto text-red-500 transition-all hover:bg-red-500 hover:text-white text-left flex gap-2 items-center'>
            <RiLogoutBoxLine size={20} /> Logout
          </button>
        </div>
      </Navbar>

      <div className="flex flex-col ml-[14rem] p-6 bg-[#FAFAFA] min-h-screen">
        <Outlet />
      </div>
    </>
  )
}

export default UserNav