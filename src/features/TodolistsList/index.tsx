import * as todolistSelectors from './selectors'
import * as todolistAsyncAction from './todolist-action'
import {slice} from './todolists-reducer'
import { TodolistList } from './TodolistsList'

const todolistAction ={
    ...slice.actions,
    ...todolistAsyncAction
}


export {
    todolistSelectors,
    todolistAction,
    TodolistList
}