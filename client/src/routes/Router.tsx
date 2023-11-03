import React from 'react'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'

// pages
import Login from '@/pages/login'
import AdminHome from '@/pages/admin/home'
import Users from '@/pages/admin/users'
// import UserHome from '@/pages/user/home';

// toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// components
import AdminNav from '@/components/global/adminNav'
import UserNav from '@/components/global/userNav'

// private router
import PrivateRoute from '@/components/global/privateRoute'
import ShowUser from '@/pages/admin/userprofile'
import FacultySchedule from '@/pages/faculty'

import UserHome from '@/pages/user/home/index'
import UserAccomplishmentReport from '@/pages/user/accomplishment_reports/index'
import UserShowAccomplishmentReport from '@/pages/user/accomplishment_reports/show'

import CreateRFID from '@/pages/admin/users/rfid'
import AccomplishmentReport from '@/pages/admin/accomplishment_reports'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route path="/login" element={<Login />} />

            {/* users only route */}
            <Route path="/" element={<UserNav/>}>
                <Route index element={<UserHome/>} />

                <Route path='/accomplishment-reports'> 
                    <Route index element={<UserAccomplishmentReport/>} />
                    <Route path=':id' element={<UserShowAccomplishmentReport/>} />
                </Route>
            </Route>

            {/* admin only route */}
            <Route path='/admin' element={<AdminNav />}>
                <Route path='home' element={<AdminHome />} />
                <Route path='faculty' element={<FacultySchedule />} />
                <Route path='accomplishment-reports'>
                    <Route path='regular' element={<AccomplishmentReport/>}/>
                    <Route path='part-time' element={<AccomplishmentReport/>}/>
                </Route>

                <Route path='users'>
                    <Route index element={<Users />} />
                    <Route path=':id' element={<ShowUser />} />
                    <Route path='rfid' element={<CreateRFID />} />
                </Route>
            </Route>
        </Route>
    )
)

const Router = () => {
    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    )
}

export default Router
