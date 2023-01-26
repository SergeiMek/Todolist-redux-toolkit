import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../../app/app-reducer";
import {todolistsAPI, UpdateTaskModelType} from "../../../api/todolists-api";
import {handlerServerError, handleServerAppError} from "../../../utils/error-utils";
import {AppRootState} from "../../../state/store";
import {UpdateDomainTaskModelType} from "./tasks-reducer";

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