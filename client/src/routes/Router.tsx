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
// import UserHome from '@/pages/user/home';

// toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// components
import AdminNav from '@/components/global/adminNav'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route index element={<Login />} />
            <Route path='/admin' element={<AdminNav />}>
                <Route index element={<AdminHome />} />
                <Route path='register' element={<Register />} />
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