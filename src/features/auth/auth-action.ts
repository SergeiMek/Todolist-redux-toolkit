import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/app-reducer";
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {handlerServerError, handleServerAppError} from "../../utils/error-utils";

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (data: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({fieldsErrors: res.data.fieldsError, errors: res.data.messages})
        }
    } catch (error: any) {
        handlerServerError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({fieldsErrors: undefined, errors: [error.message]})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handlerServerError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})