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
import Register from '@/pages/admin/register'
import Users from '@/pages/admin/users'
// import UserHome from '@/pages/user/home';

// toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// components
import AdminNav from '@/components/global/adminNav'

// private router
import PrivateRoute from '@/components/global/privateRoute'
import ShowUser from '@/pages/admin/userprofile'
import FacultySchedule from '@/pages/faculty'
import AccomplishmentReports from '@/pages/accomplishment_reports'
import CreateRFID from '@/pages/admin/users/rfid'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route index element={<Login />} />
            <Route path='/admin' element={<AdminNav />}>
                <Route path='home' element={<AdminHome />} />
                <Route path='faculty' element={<FacultySchedule />} />
                <Route path='accomplishment-reports' element={<AccomplishmentReports />} />

                <Route path='users'>
                    <Route index element={<Users />} />
                    <Route path=':id' element={<ShowUser />} />
                    <Route path='register' element={<Register />} />
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
