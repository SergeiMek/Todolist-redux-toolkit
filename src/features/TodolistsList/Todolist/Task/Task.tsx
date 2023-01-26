import React, {useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan";

import {Delete} from "@mui/icons-material";
import {TasksStatuses, TaskType} from "../../../../api/todolists-api";
import {useActions, useAppDispatch} from "../../../../state/store";
import {updateTaskTC} from "./tasks-actions";
import {tasksActions} from "./index";


type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (taskId: string, status: TasksStatuses, todolistId: string) => void
    removeTask: (id: string, todolistId: string) => void
}


export const Task = React.memo((props: TaskPropsType) => {
    const {updateTaskTC} = useActions(tasksActions)
    return <div>
        <Checkbox checked={props.task.status === TasksStatuses.Completed}
                  onChange={(e) => props.changeTaskStatus(props.task.id, e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New, props.todolistId)}/>
        <EditableSpan title={props.task.title}
                      onChange={useCallback((title: string) => updateTaskTC({
                          taskId: props.task.id,
                          todolistId: props.todolistId,
                          domainModel: {title}
                      }), [props.todolistId, props.task.id])}/>
        <IconButton onClick={() => props.removeTask(props.task.id, props.todolistId)}>
            <Delete/>
        </IconButton>
    </div>

})

