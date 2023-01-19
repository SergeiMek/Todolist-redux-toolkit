import {Dispatch} from 'redux'
import {setAppStatusAC} from './app-reducer'
import {ActionsType} from "./store";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import {handlerServerError, handleServerAppError} from "../utils/error-utils";
import {updateTasksAC} from "./tasks-reducer";


export type ActionsLoginReducerType = ReturnType<typeof setIsLoggedInAC>

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsLoginReducerType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)


export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    ).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout().then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    ).catch((error) => {
        handlerServerError(error, dispatch)
    })
}


