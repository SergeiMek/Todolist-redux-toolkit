import * as todolistSelectors from './selectors'
import * as todolistAsyncAction from './todolist-action'
import {slice} from './todolists-reducer'

const todolistAction ={
    ...slice.actions,
    ...todolistAsyncAction
}


export {
    todolistSelectors,
    todolistAction
}