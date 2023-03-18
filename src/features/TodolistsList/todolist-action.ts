import {createAsyncThunk} from "@reduxjs/toolkit";
import {todolistsAPI} from "../../api/todolists-api";
import {handlerServerError, handleServerAppError} from "../../utils/error-utils";
import {setAppStatusAC} from "../../app/app-reducer";
import {changeTodolistEntityStatusAC} from "./todolists-reducer";

export const fetchTodolistTC = createAsyncThunk('todolist/fetchTodolist', async (params, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    let res = await todolistsAPI.getTodolists()
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (error) {
        handlerServerError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const removeTodolistTC = createAsyncThunk('todolist/removeTodolist', async (params: { todolistId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: params.todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(params.todolistId)
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: params.todolistId}
    } catch (error) {
        handlerServerError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async (params: { todolistTitle: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(params.todolistTitle)
    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handlerServerError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolist/changeTodolistTitle', async (params: { todolistId: string, todolistTitle: string }, {
    dispatch,
    rejectWithValue
}) => {
    const res = await todolistsAPI.updateTodolist(params.todolistId, params.todolistTitle)
    try {
        if(res.data.resultCode === 0){
            return {id: params.todolistId, title: params.todolistTitle}
        }
        else{
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handlerServerError(error, dispatch)
        return rejectWithValue(null)
    }
})