import {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC, FilterValueType, TodolistDomainType,
} from './todolists-reducer'
import {v1} from 'uuid'
import {StatusType} from "../../app/app-reducer";
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistTC, removeTodolistTC} from "./todolist-action";
import { todolistsReducer } from '.';
import {tasksReducer} from "./Task";


test('correct todolist should be removed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]

    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({id: todolistId1},'',{todolistId: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)

})

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]

    const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist: {id: todolistId1, title: 'string', addedDate: "", order: 0}},'',{todolistTitle:'string'}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe("string")

})

test('correct todolist should change its name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]

    const action = {
        type: 'CHANGE-TODOLIST-TITLE' as const,
        id: todolistId2,
        title: newTodolistTitle
    }

    const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled({id:todolistId2,title:newTodolistTitle},"",{todolistTitle:newTodolistTitle,todolistId:todolistId2}))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newFilter: FilterValueType = 'completed'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]

    const action = {
        type: 'CHANGE-TODOLIST-FILTER' as const,
        id: todolistId2,
        filter: newFilter
    }

    const endState = todolistsReducer(startState, changeTodolistFilterAC({id:todolistId2,filter:newFilter}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]

    const endState = todolistsReducer([], fetchTodolistTC.fulfilled({todolists:startState},''))

    expect(endState.length).toBe(2)
})

test('empty arrays should be added when we set todolists', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const action =  fetchTodolistTC.fulfilled({todolists:[
            {id: '1', title: 'What to learn', addedDate: "", order: 0},
            {id: '2', title: 'What to buy', addedDate: "", order: 0}
        ]},'')

    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('correct entityStatus of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newStatus: StatusType = 'loading'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0}
    ]


    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({id:todolistId2,status:newStatus}))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})