import {addTodolistTC, fetchTodolistTC, removeTodolistTC} from "./todolists-reducer";
import {TaskPriorities, TasksStateType, TasksStatuses, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";

import {AppRootState} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {handlerServerError, handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

///types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string | null
    status?: TasksStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


let initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    let tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks, todolistId}
})


export const removeTasksTC = createAsyncThunk('tasks/removeTasks', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    return {
        taskId: param.taskId,
        todolistId: param.todolistId
    }
})

export const addTasksTC = createAsyncThunk('tasks/addTasks', async (param: { taskTitle: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTask(param.todolistId, param.taskTitle)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item

        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handlerServerError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (params: { taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootState
    const task = state.tasks[params.todolistId].find(t => t.id === params.taskId)

    if (!task) {
        return thunkAPI.rejectWithValue("task not found in the state")
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...params.domainModel
    }

    const res = await todolistsAPI.updateTask(params.todolistId, params.taskId, apiModel)
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {
                taskId: params.taskId,
                model: params.domainModel,
                todolistId: params.todolistId
            }

        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)

        }
    } catch (error) {
        handlerServerError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolistTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removeTasksTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})


export const tasksReducer = slice.reducer;

