import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../components/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useActions, useAppDispatch, useAppSelector} from "../../state/store";
import {changeTodolistFilterAC, FilterValueType} from "./todolists-reducer";
import {Task} from "./Todolist/Task/Task";
import {TasksStatuses} from "../../api/todolists-api";
import {StatusType} from "../../app/app-reducer";
import {tasksActions, taskSelectors} from "./Todolist/Task";
import {addTasksTC, fetchTasksTC, removeTasksTC, updateTaskTC} from "./Todolist/Task/tasks-actions";
import {todolistAction} from "./index";


type propsType = {
    title: string
    id: string
    filter: FilterValueType
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (newValue: string, todolistId: string) => void
    entityStatus: StatusType
}


export const Todolist = React.memo((props: propsType) => {
   // const dispatch = useAppDispatch();
    const {fetchTasksTC,removeTasksTC,updateTaskTC,addTasksTC}=useActions(tasksActions)
    const {changeTodolistFilterAC}=useActions(todolistAction)
        const task = useAppSelector(taskSelectors.selectTask)
        const tasks =task[props.id]

    useEffect(() => {
            fetchTasksTC(props.id)
        }, [])

        const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
            changeTodolistFilterAC({id: todolistId, filter: value})
        }, [])


        const removeTask = useCallback((taskId: string, todolistId: string) => {
           removeTasksTC({taskId, todolistId})
        }, [])

        const changeTaskStatus = useCallback((taskId: string, status: TasksStatuses , todolistId: string) => {
            updateTaskTC({taskId,todolistId,domainModel:{status}})
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

        return <div>
            <h3><EditableSpan title={props.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={useCallback(title => addTasksTC({taskTitle: title, todolistId: props.id}), [props.id])}
                disabled={props.entityStatus === 'loading'}/>
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



