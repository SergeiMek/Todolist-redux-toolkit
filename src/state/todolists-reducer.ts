import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {ActionsType} from "./store";
import {setAppErrorAC, setAppStatusAC, StatusType} from "./app-reducer";
import {handlerServerError} from "../utils/error-utils";


///types
export type FilterValueType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: StatusType
}
export type actionsTypeTodolists =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


let initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: actionsTypeTodolists): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(f => f.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case 'SET-TODOLIST': {
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
        default :
            return state
    }
}


///action

export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)

export const changeTodolistEntityStatusAC = (id: string, status: StatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    id,
    status
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValueType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)

export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: "SET-TODOLIST", todolists} as const)

///thunk

export const fetchTodolistTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists().then(res => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    }).catch((error)=>{
        handlerServerError(error,dispatch)
    })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
        dispatch(setAppStatusAC('succeeded'))
    }).catch((error)=>{
        handlerServerError(error,dispatch)
    })
}


export const addTodolistTC = (todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(todolistTitle).then(res => {
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    }).catch((error)=>{
        handlerServerError(error,dispatch)
    })

}

export const changeTodolistTitleTC = (todolistId: string, todolistTitle: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTodolist(todolistId, todolistTitle).then(res => {
            dispatch(changeTodolistTitleAC(todolistId, todolistTitle))
        }).catch((error)=>{
            handlerServerError(error,dispatch)
        })
    }
}

