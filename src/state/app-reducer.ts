import {Dispatch} from "redux";
import {ActionsType} from "./store";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./authReducer";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


export type InitialStateType = {
    status: StatusType,
    error: string | null,
    isInitialized: boolean
}

export type ActionAppType = ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppInitializedAC>

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const appReducer = (state = initialState, action: ActionAppType) => {

    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return {...state}
    }
}

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    error
} as const)
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', value} as const)
export const setAppStatusAC = (status: StatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {

        }

        dispatch(setAppInitializedAC(true));
    })
}