import {TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./Todolist/Task/tasks-reducer";
import {TasksStateType} from "../../api/todolists-api";
import {addTodolistTC} from "./todolist-action";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = addTodolistTC.fulfilled({todolist:{
            id: "string",
            title: "string",
            addedDate: "string",
            order: 1
        }},"",{todolistTitle:"string"});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;


});
