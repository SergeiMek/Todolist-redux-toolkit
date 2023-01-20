import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {ActionsType} from "./store";
import { setAppStatusAC, StatusType} from "./app-reducer";
import {handlerServerError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


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

const slice = createSlice({
    initialState: initialState,
    name: 'todolist',
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].title = action.payload.title
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: StatusType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].entityStatus = action.payload.status
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].filter = action.payload.filter
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
           return action.payload.todolists.map(tl=>({...tl,filter:'all',entityStatus:'idle'}))
        }

    }
})




export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    setTodolistsAC
} = slice.actions


///thunk

export const fetchTodolistTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists().then(res => {
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC({id: todolistId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })
}


export const addTodolistTC = (todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(todolistTitle).then(res => {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }).catch((error) => {
        handlerServerError(error, dispatch)
    })

}

export const changeTodolistTitleTC = (todolistId: string, todolistTitle: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTodolist(todolistId, todolistTitle).then(res => {
            dispatch(changeTodolistTitleAC({id: todolistId, title: todolistTitle}))
        }).catch((error) => {
            handlerServerError(error, dispatch)
        })
    }
}

