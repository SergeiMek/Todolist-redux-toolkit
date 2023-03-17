import {useActions, useAppSelector} from "../../state/store";
import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist";
import {Navigate} from "react-router-dom";
import {appSelectors} from "../../app";
import {authSelectors} from "../auth";
import {selectTodolists} from "./selectors";
import {todolistAction} from "./index";

export const TodolistList = () => {
    const todolists = useAppSelector(selectTodolists)
    const entityStatus = useAppSelector(appSelectors.selectStatus)
    const isLoginIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const {fetchTodolistTC, addTodolistTC} = useActions(todolistAction)

    useEffect(() => {
        if (!isLoginIn) {
            return
        }
        fetchTodolistTC()
    }, [])

    if (!isLoginIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={async (todolistTitle) => addTodolistTC({todolistTitle})}
                         disabled={entityStatus === 'loading'}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap:"nowrap",overflowX:'scroll'}}>
            {todolists.map(tl => {
                return <Grid item key={tl.id}>
                    <div style={{width:"300px"}}>
                        <Todolist
                            key={tl.id}
                            id={tl.id}
                            title={tl.title}
                            filter={tl.filter}
                            entityStatus={tl.entityStatus}
                        />
                    </div>
                </Grid>
            })}
        </Grid>
    </>
}