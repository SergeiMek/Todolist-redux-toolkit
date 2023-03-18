import React, {ChangeEvent, KeyboardEvent, SetStateAction, useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";


export type AddItemPropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean

}

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemPropsType) => {
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [error, setError] = useState<string| undefined | SetStateAction<any>>(null)

    const addTask = async () => {
        if (newTaskTitle.trim() !== "") {
            try {
                await addItem(newTaskTitle)
                setNewTaskTitle("")
            } catch (error:any) {
                setError(error.message)
            }


        } else {
            setError("Title is required")

        }
    }
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
        setError(null)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addTask()
        }
    }


    return <div>
        <div>
            <TextField value={newTaskTitle}
                       disabled={disabled}
                       label={"Type value"}
                       variant={"outlined"}
                       onChange={onNewTitleChangeHandler}
                       onKeyPress={onKeyPressHandler}
                       error={!!error}
                       helperText={error}
            />
            <IconButton onClick={addTask} color={"primary"} disabled={disabled} style={{marginLeft: '5px'}}>
                <ControlPoint/>
            </IconButton>
        </div>
    </div>

})