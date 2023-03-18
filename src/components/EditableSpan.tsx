import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    onChange:(value:string)=>void
}

export const EditableSpan=React.memo((props: EditableSpanPropsType)=> {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState("")
    const activateEditMode =()=> {

        setEditMode(true)
        setTitle(props.title)
    }
    const onChangeTitleHandler=(e:ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.currentTarget.value)
    }

    const activateViewMode =()=>{
        setEditMode(false)
    props.onChange(title)
    }

    return editMode
        ? <TextField value={title}onChange={onChangeTitleHandler} onBlur={activateViewMode}/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
})