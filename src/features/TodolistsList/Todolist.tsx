import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../components/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan";
import {Button, IconButton, Paper, PropTypes} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useAppSelector} from "../../state/store";
import {FilterValueType} from "./todolists-reducer";

import {TasksStatuses} from "../../api/todolists-api";
import {StatusType} from "../../app/app-reducer";
import {Task, tasksActions, taskSelectors} from "./Task";
import {todolistAction} from "./index";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";
import {useActions} from "../../utils/redux-utils";


type propsType = {
    title: string
    id: string
    filter: FilterValueType
    entityStatus: StatusType
}
type colorType = OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>


export const Todolist = React.memo((props: propsType) => {
        const {fetchTasksTC, addTasksTC} = useActions(tasksActions)
        const {changeTodolistFilterAC, removeTodolistTC, changeTodolistTitleTC} = useActions(todolistAction)

        const task = useAppSelector(taskSelectors.selectTask)
        const tasks = task[props.id]

        useEffect(() => {
            fetchTasksTC(props.id)
        }, [])

        const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
            changeTodolistFilterAC({id: todolistId, filter: value})
        }, [])

        let tasksForTodolist = tasks;
        if (props.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(f => f.status === TasksStatuses.Completed)
        }
        if (props.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(f => f.status === TasksStatuses.New)
        }
        const onFilterButtonClickHandler = useCallback((buttonFilter: FilterValueType) => changeFilter(buttonFilter, props.id), [changeFilter, props.id])


        const filterRenderButton = (buttonFilter: FilterValueType, color: colorType, text: string) => {
            return <Button color={color} variant={props.filter === buttonFilter ? "contained" : "text"}
                           onClick={() => onFilterButtonClickHandler(buttonFilter)}
            >{text}</Button>
        }

        return <Paper style={{padding: '10px', position: 'relative'}}>
            <IconButton onClick={() => removeTodolistTC({todolistId: props.id})}
                        disabled={props.entityStatus === 'loading'}
                        style={{position: 'absolute', right: '5px', top: '5px'}}>
                <Delete fontSize={'small'}/>
            </IconButton>
            <h3><div style={{ wordWrap: 'break-word'}}><EditableSpan title={props.title} onChange={useCallback((newValue: string) => changeTodolistTitleTC({
                todolistTitle: newValue,
                todolistId: props.id
            }), [changeTodolistTitleTC, props.id])}/>
            </div>
            </h3>
            <AddItemForm
                addItem={useCallback(async title => addTasksTC({taskTitle: title, todolistId: props.id}), [props.id])}
                disabled={props.entityStatus === 'loading'}/>
            <div>
                {tasksForTodolist.map(t => <Task task={t} todolistId={props.id} key={t.id}/>)}
                {!tasksForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No task</div>}
            </div>
            <div style={{paddingTop: '10px'}}>

                {filterRenderButton("all", 'inherit', 'All')}
                {filterRenderButton("active", "success", 'Active')}
                {filterRenderButton("completed", "secondary", 'Completed')}
            </div>
        </Paper>
    }
)



