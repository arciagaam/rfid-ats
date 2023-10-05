import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const PrivateRoute = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth)

    return userInfo ? <Outlet /> : <Navigate to='/' replace />
}

export default PrivateRoute
