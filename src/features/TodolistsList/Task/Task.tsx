import React, {useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../components/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TasksStatuses, TaskType} from "../../../api/todolists-api";
import {tasksActions} from "./index";
import {useActions} from "../../../utils/redux-utils";


type TaskPropsType = {
    task: TaskType
    todolistId: string

}


export const Task = React.memo((props: TaskPropsType) => {
    const {updateTaskTC, removeTasksTC} = useActions(tasksActions)

    const changeTaskStatus = useCallback((taskId: string, status: TasksStatuses, todolistId: string) => {
        updateTaskTC({taskId, todolistId, domainModel: {status}})
    }, [])

    return <div key={props.task.id} style={{position: 'relative'}}>
        <Checkbox checked={props.task.status === TasksStatuses.Completed}
                  onChange={(e) => changeTaskStatus(props.task.id, e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New, props.todolistId)}/>
        <EditableSpan title={props.task.title}
                      onChange={useCallback((title: string) => updateTaskTC({
                          taskId: props.task.id,
                          todolistId: props.todolistId,
                          domainModel: {title}
                      }), [props.todolistId, props.task.id])}/>
        <IconButton onClick={useCallback(() => {
            removeTasksTC({taskId: props.task.id, todolistId: props.todolistId})
        }, [props.task.id, props.todolistId])} style={{position:'absolute',top:'2px',right:'2px'}}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </div>

})

