import {createAsyncThunk} from "@reduxjs/toolkit";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/auth/authReducer";





export const initializeAppTC = createAsyncThunk('app/initializeApp', async (data, thunkAPI) => {

    const res = await authAPI.me()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }

    } catch (error) {

    }
})