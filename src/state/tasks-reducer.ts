import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
} from "./todolists-reducer";
import {
    TaskPriorities,
    TasksStateType,
    TasksStatuses,
    TaskType,
    todolistsAPI, TodolistType,
    UpdateTaskModelType
} from "../api/todolists-api";
import {/**/Dispatch} from "redux";
import {ActionsType, AppRootState} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {handlerServerError, handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

///types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string | null
    status?: TasksStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


export type actionsTypeTasks =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof updateTasksAC>

let initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    let tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks, todolistId}
})


export const removeTasksTC = createAsyncThunk('tasks/removeTasks', (param: { taskId: string, todolistId: string }, thunkAPI) => {
    return todolistsAPI.deleteTask(param.todolistId, param.taskId).then(res => ({
        taskId: param.taskId,
        todolistId: param.todolistId
    }))
})

export const addTasksTC = (taskTitle: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, taskTitle).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootState) => {

    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
        console.warn("task not found in the state")
        return
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel).then(res => {
        dispatch(setAppStatusAC({status: 'loading'}))
        if (res.data.resultCode === 0) {
            dispatch(updateTasksAC({taskId: taskId, model: domainModel, todolistId: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        /* removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
             const tasks = state[action.payload.todolistId]
             const index = tasks.findIndex(t => t.id === action.payload.taskId)
             if (index > -1) {
                 tasks.splice(index, 1)
             }
         },*/
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        /* setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
             state[action.payload.todolistId] = action.payload.tasks
         },*/
        updateTasksAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
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
    }
})


export const tasksReducer = slice.reducer;
export const {addTaskAC, updateTasksAC} = slice.actions;


///thunk


/*
export const removeTasksTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({taskId: taskId, todolistId: todolistId}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const addTasksTC = (taskTitle: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, taskTitle).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootState) => {

    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
        console.warn("task not found in the state")
        return
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel).then(res => {
        dispatch(setAppStatusAC({status: 'loading'}))
        if (res.data.resultCode === 0) {
            dispatch(updateTasksAC({taskId: taskId, model: domainModel, todolistId: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}*/
