import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../state/store";
import {
    addTasksTC,
    fetchTasksTC,
    removeTasksTC, updateTaskTC
} from "../state/tasks-reducer";
import {changeTodolistFilterAC,FilterValueType} from "../state/todolists-reducer";
import {Task} from "./Task";
import {TasksStatuses} from "../api/todolists-api";
import {StatusType} from "../state/app-reducer";


type propsType = {
    title: string
    id: string
    filter: FilterValueType
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (newValue: string, todolistId: string) => void
    entityStatus:StatusType
}


export const Todolist = React.memo((props: propsType) => {
        console.log("Todolist is called")
        const dispatch = useAppDispatch();
        const tasks = useAppSelector(state => state.tasks[props.id])
        useEffect(() => {
            dispatch(fetchTasksTC(props.id))
        }, [])

        const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
            dispatch(changeTodolistFilterAC(todolistId, value))
        }, [])


        const removeTask = useCallback((id: string, todolistId: string) => {
            dispatch(removeTasksTC(id,todolistId))
        }, [])

        const changeTaskStatus = useCallback((taskId: string, status: TasksStatuses, todolistId: string) => {
            dispatch(updateTaskTC(taskId, todolistId, {status}))
        }, [])


        const onAllClickHandler = useCallback(() => changeFilter("all", props.id), [changeFilter, props.id])
        const onActiveClickHandler = useCallback(() => changeFilter("active", props.id), [changeFilter, props.id])
        const onCompletedClickHandler = useCallback(() => changeFilter("completed", props.id), [changeFilter, props.id])
        const removeTodolist = () => props.removeTodolist(props.id)
        const changeTodolistTitle = useCallback((newValue: string) => props.changeTodolistTitle(newValue, props.id), [props.changeTodolistTitle, props.id])

        let tasksForTodolist = tasks;
        if (props.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(f => f.status === TasksStatuses.Completed)
        }
        if (props.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(f => f.status === TasksStatuses.New)
        }
console.log(props.entityStatus)
        return <div>
            <h3><EditableSpan title={props.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={useCallback(title => dispatch(addTasksTC(title,props.id)), [props.id])}disabled={props.entityStatus === 'loading'}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task task={t} todolistId={props.id} changeTaskStatus={changeTaskStatus}
                                                    removeTask={removeTask} key={t.id}/>)
                }

            </div>
            <div>
                <Button variant={props.filter === "all" ? "contained" : "text"} onClick={onAllClickHandler}>All</Button>
                <Button color={"success"} variant={props.filter === "active" ? "contained" : "text"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={"secondary"} variant={props.filter === "completed" ? "contained" : "text"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    }
)



