import Navbar from './navbar'
import { Outlet } from 'react-router-dom'

const userNav = () => {
  return (
    <>
    <Navbar>
      <div className="flex flex-col">
        UserNav
      </div>
    </Navbar>

    <div className="flex flex-col ml-[14rem] p-6">
      <Outlet/>
    </div>
  </>
  )
}

export default userNav