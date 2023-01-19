import React, {useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";

import {Delete} from "@mui/icons-material";
import {TasksStatuses, TaskType} from "../api/todolists-api";
import {useAppDispatch} from "../state/store";
import {updateTaskTC} from "../state/tasks-reducer";


type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (taskId: string, status: TasksStatuses, todolistId: string) => void
    removeTask: (id: string, todolistId: string) => void
}


export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch();
    return <div>
        <Checkbox checked={props.task.status === TasksStatuses.Completed}
                  onChange={(e) => props.changeTaskStatus(props.task.id, e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New, props.todolistId)}/>
        <EditableSpan title={props.task.title}
                      onChange={useCallback((title: string) => dispatch(updateTaskTC(props.task.id, props.todolistId,{title})), [props.todolistId, props.task.id])}/>
        <IconButton onClick={() => props.removeTask(props.task.id, props.todolistId)}>
            <Delete/>
        </IconButton>
    </div>

})