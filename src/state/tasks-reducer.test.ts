import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer, updateTasksAC
} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TasksStateType, TasksStatuses} from '../api/todolists-api';
import {v1} from "uuid";

export let todolistID1 = v1();

test('correct task should be deleted from correct array', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    });

});

test('correct task should be added to correct array', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = addTaskAC({
        id: "3",
        title: "juce",
        status: TasksStatuses.New,
        addedDate: "",
        startDate: "",
        order: 1,
        deadline: "",
        todoListId: "todolistId2",
        priority: TaskPriorities.Low,
        description: ""
    });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TasksStatuses.New);
})

test('status of specified task should be changed', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = updateTasksAC("2", {status:TasksStatuses.New},"todolistId2", );

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TasksStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TasksStatuses.New);
});


test('title of specified task should be changed', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = updateTasksAC("2", {title:"Milkyway"}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("Milkyway");
});



test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

test('tasks should be added for todolist', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "JS",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "React",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "2",
                title: "milk",
                status: TasksStatuses.Completed,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            },
            {
                id: "3",
                title: "tea",
                status: TasksStatuses.New,
                addedDate: "",
                startDate: "",
                order: 1,
                deadline: "",
                todoListId: todolistID1,
                priority: TaskPriorities.Low,
                description: ""
            }
        ]
    };

    const action = setTasksAC(startState["todolistId1"], "todolistId1");

    const endState = tasksReducer({
        "todolistId2": [],
        "todolistId1": []
    }, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(0)
});


