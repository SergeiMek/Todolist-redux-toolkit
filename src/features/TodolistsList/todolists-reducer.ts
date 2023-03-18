import {TodolistType} from "../../api/todolists-api";
import {StatusType} from "../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistTC, removeTodolistTC} from "./todolist-action";


///types
export type FilterValueType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: StatusType
}
export type actionsTypeTodolists =
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


export const slice = createSlice({
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


//export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
} = slice.actions



