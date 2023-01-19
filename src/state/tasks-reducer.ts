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
    todolistsAPI,
    UpdateTaskModelType
} from "../api/todolists-api";
import {/**/Dispatch} from "redux";
import {ActionsType, AppRootState} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handlerServerError, handleServerAppError} from "../utils/error-utils";

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
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTasksAC>

let initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: actionsTypeTasks): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLIST': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'CHANGE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }

        default :
            return state
    }
}


//action
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
    type: "SET-TASKS",
    tasks,
    todolistId
} as const)
export const updateTasksAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'CHANGE-TASK',
    taskId,
    model,
    todolistId
} as const)


///thunk
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId).then(res => {
        dispatch(setTasksAC(res.data.items, todolistId))
        dispatch(setAppStatusAC('succeeded'))
    }).catch((error)=>{
        handlerServerError(error,dispatch)
    })
}

export const removeTasksTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error)=>{
        handlerServerError(error,dispatch)
    })
}

export const addTasksTC = (taskTitle: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, taskTitle).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
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
        dispatch(setAppStatusAC('loading'))
        if (res.data.resultCode === 0) {
            dispatch(updateTasksAC(taskId, domainModel, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}