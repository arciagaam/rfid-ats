import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAuthState {
    userInfo: {
        _id: string
        firstName: string
        middleName: string
        lastName: string
        email: string
        role: string
        department: string
    } | null
}

const initialState: IAuthState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IAuthState['userInfo']>) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state, action) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

// export auth state
export const selectAuth = (state: { auth: IAuthState }) => state.auth

export default authSlice.reducer
