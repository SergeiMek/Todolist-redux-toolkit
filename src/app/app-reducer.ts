import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initializeAppTC} from "./app-action";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


type InitialStateType = {
    status: StatusType,
    error: string | null,
    isInitialized: boolean
}

export type ActionAppType = ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppStatusAC>


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

