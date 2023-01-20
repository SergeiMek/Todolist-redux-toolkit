import {Dispatch} from 'redux'
import {setAppStatusAC} from './app-reducer'
import {ActionsType} from "./store";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import {handlerServerError, handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ActionsLoginReducerType = ReturnType<typeof setIsLoggedInAC>

const initialState = {
    isLoggedIn: false
}



const slice = createSlice({
    initialState: initialState,
    name: 'auth',
    reducers: {
        setIsLoggedInAC(state,action:PayloadAction<{isLoggedIn:boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC}=slice.actions


export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.login(data).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn:true}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    ).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.logout().then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn:false}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    ).catch((error) => {
        handlerServerError(error, dispatch)
    })
}


