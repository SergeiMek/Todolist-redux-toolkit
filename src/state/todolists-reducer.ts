import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {setAppStatusAC, StatusType} from "./app-reducer";
import {handlerServerError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


///types
export type FilterValueType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: StatusType
}
export type actionsTypeTodolists =
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


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
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: res.data.data.item}
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
        return {id: params.todolistId, title: params.todolistTitle}
    } catch (error) {
        handlerServerError(error, dispatch)
        return rejectWithValue(null)
    }
})


const slice = createSlice({
    initialState: [] as Array<TodolistDomainType>,
    name: 'todolist',
    reducers: {
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: StatusType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].entityStatus = action.payload.status
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].filter = action.payload.filter
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            state[state.findIndex(tl => tl.id === action.payload.id)].title = action.payload.title
        })
    }
})


export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
} = slice.actions



