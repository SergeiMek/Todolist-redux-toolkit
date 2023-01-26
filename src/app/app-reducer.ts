import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/auth/authReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


type InitialStateType = {
    status: StatusType,
    error: string | null,
    isInitialized: boolean
}

export type ActionAppType = ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppStatusAC>


export const initializeAppTC = createAsyncThunk('app/initializeApp', async (data, thunkAPI) => {
    const res = await authAPI.me()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
    } catch (error) {

    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})


export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC} = slice.actions

