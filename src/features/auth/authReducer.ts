import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginTC, logoutTC} from "./auth-action";


export type ActionsLoginReducerType = ReturnType<typeof setIsLoggedInAC>


export const slice = createSlice({
    initialState: {
        isLoggedIn: false
    },
    name: 'auth',
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

//export const authReducer = slice.reducer
 export const {setIsLoggedInAC} = slice.actions
