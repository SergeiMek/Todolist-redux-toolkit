import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./authReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


type InitialStateType = {
    status: StatusType,
    error: string | null,
    isInitialized: boolean
}

export type ActionAppType = ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppInitializedAC>

const initialState : InitialStateType = {
    status: 'idle',
    error: null ,
    isInitialized: false
}

const slice = createSlice({
    name:'app',
    initialState:initialState,
    reducers:{
        setAppErrorAC(state,action:PayloadAction<{error:string | null}>){
            state.error = action.payload.error
        },
        setAppInitializedAC(state,action:PayloadAction<{value: boolean}>){
            state.isInitialized=action.payload.value
        },
        setAppStatusAC(state,action:PayloadAction<{status: StatusType}>){
            state.status=action.payload.status
        }
    }
})


export const appReducer = slice.reducer
export const {setAppErrorAC,setAppInitializedAC,setAppStatusAC}=slice.actions


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn:true}));
        } else {

        }

        dispatch(setAppInitializedAC({value:true}));
    })
}