import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// pages
import Login from '@/pages/login';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' >
            <Route index element={<Login/>}/>
        </Route>
    )
);

const Router = () => {
    return (<RouterProvider router={router}/>)
}

export default Router;