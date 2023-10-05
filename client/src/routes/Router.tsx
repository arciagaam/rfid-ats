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

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route index element={<Login />} />
            <Route path='' element={<PrivateRoute />}>
                <Route path='/admin' element={<AdminNav />}>
                    <Route index element={<AdminHome />} />
                    <Route path='register' element={<Register />} />
                    <Route path='users' element={<Users />} />
                </Route>
                <Route path='/user' element={<AdminNav />}></Route>
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
