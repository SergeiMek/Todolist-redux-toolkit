import * as taskSelectors from './selectors'
import { Task } from './Task'
import * as tasksActions from './tasks-actions'
import { slice } from './tasks-reducer'


const tasksReducer = slice.reducer

export {
    taskSelectors,
    tasksActions,
    Task,
    tasksReducer
}