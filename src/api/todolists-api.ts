import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '15ef91a2-718f-4efd-a9c0-b73ca136f7cc'
    }

})

export type TasksStateType = {
    [x: string]: Array<TaskType>
}

export enum TasksStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    id: string,
    title: string,
    description: string | null,
    todoListId: string,
    order: number,
    status: TasksStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
    addedDate: string
}

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D,
    fieldsErrors?: Array<string>
}

type TasksResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}

export type UpdateTaskModelType = {
    title: string
    description: string | null
    status: TasksStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type  LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}


export const todolistsAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(todolistTitle: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: todolistTitle})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    getTasks(todolistId: string) {
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, taskTitle: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

export const authAPI = {
    login(date: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('auth/login', date)
    },
    me() {
        return instance.get<ResponseType<{ id: number, login: string, email: string }>>('auth/me')
    },
    logout() {
        return instance.delete<ResponseType<{ userId?: number }>>('auth/login')
    }
}

